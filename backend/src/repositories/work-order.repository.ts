import { pool } from '../config/database.js';
import {
  IWorkOrder,
  IWorkOrderSubJob,
  IWorkOrderSpare,
} from '../models/work-order.model.js';
import { PoolConnection, RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export class WorkOrderRepository {
  async findAllGrouped(
    search?: string,
    specGroupId?: number,
  ): Promise<Record<string, any[]>> {
    let sql = `
      SELECT 
        wom.id,
        wom.job_code,
        wom.job_name,
        wom.job_type,
        sg.name AS spec_group_name
      FROM work_order_masters wom
      INNER JOIN specification_groups sg ON wom.specification_group_id = sg.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (search) {
      sql += ` AND (wom.job_name LIKE ? OR wom.job_code LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    if (specGroupId) {
      sql += ` AND wom.specification_group_id = ?`;
      params.push(specGroupId);
    }

    sql += ` ORDER BY sg.name ASC, wom.id DESC`;

    const [rows] = await pool.query<RowDataPacket[]>(sql, params);

    // Grouping berdasarkan Specification Group sesuai layout UI
    return rows.reduce((acc: Record<string, any[]>, row) => {
      const group = row.spec_group_name;
      if (!acc[group]) acc[group] = [];
      acc[group].push({
        id: row.id,
        job_code: row.job_code,
        job_name: row.job_name,
        job_type: row.job_type,
      });
      return acc;
    }, {});
  }

  async findById(id: number): Promise<IWorkOrder | null> {
    const headerSql = `
      SELECT 
        wom.*,
        v.name AS vessel_name,
        sg.name AS specification_group_name,
        COALESCE(SUM(sj.total_budget), 0) + COALESCE(sp.total_spare_cost, 0) AS calculated_total_budget,
        COALESCE(SUM(sj.owner_estimate), 0) AS calculated_internal_estimate
      FROM work_order_masters wom
      LEFT JOIN vessels v ON wom.vessel_id = v.id
      LEFT JOIN specification_groups sg ON wom.specification_group_id = sg.id
      LEFT JOIN work_order_sub_jobs sj ON wom.id = sj.work_order_id
      LEFT JOIN (
        SELECT work_order_id, SUM(cost_usd * expected_qty) AS total_spare_cost 
        FROM work_order_spares 
        GROUP BY work_order_id
      ) sp ON wom.id = sp.work_order_id
      WHERE wom.id = ?
      GROUP BY wom.id
    `;
    const [headerRows] = await pool.execute<RowDataPacket[]>(headerSql, [id]);
    if (headerRows.length === 0) return null;

    const [subJobRows] = await pool.execute<RowDataPacket[]>(
      `SELECT * FROM work_order_sub_jobs WHERE work_order_id = ? ORDER BY sort_order ASC, id ASC`,
      [id],
    );

    const [spareRows] = await pool.execute<RowDataPacket[]>(
      `SELECT * FROM work_order_spares WHERE work_order_id = ? ORDER BY id ASC`,
      [id],
    );

    const raw = headerRows[0];
    return {
      id: raw.id,
      vessel_id: raw.vessel_id,
      vessel_name: raw.vessel_name,
      machinery_group_id: raw.machinery_group_id,
      machinery_id: raw.machinery_id,
      specification_group_id: raw.specification_group_id,
      specification_group_name: raw.specification_group_name,
      job_code: raw.job_code,
      job_name: raw.job_name,
      job_category: raw.job_category,
      job_type: raw.job_type,
      job_description: raw.job_description,
      is_critical_job: Boolean(raw.is_critical_job),
      is_internal_job: Boolean(raw.is_internal_job),
      estimated_hours: Number(raw.estimated_hours),
      responsible_rank: raw.responsible_rank,
      total_budget: Number(raw.calculated_total_budget),
      total_internal_estimate: Number(raw.calculated_internal_estimate),
      sub_jobs: subJobRows as IWorkOrderSubJob[],
      spares: spareRows as IWorkOrderSpare[],
    };
  }

  async create(data: IWorkOrder, conn: PoolConnection): Promise<number> {
    const sql = `
      INSERT INTO work_order_masters (
        vessel_id, machinery_group_id, machinery_id, specification_group_id,
        job_code, job_name, job_category, job_type, job_description,
        is_critical_job, is_internal_job, estimated_hours, responsible_rank
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await conn.execute<ResultSetHeader>(sql, [
      data.vessel_id || null,
      data.machinery_group_id || null,
      data.machinery_id || null,
      data.specification_group_id,
      data.job_code || null,
      data.job_name,
      data.job_category || null,
      data.job_type,
      data.job_description,
      data.is_critical_job ?? false,
      data.is_internal_job ?? false,
      data.estimated_hours ?? 0,
      data.responsible_rank || 'Chief Officer',
    ]);
    return result.insertId;
  }

  // Sub Jobs operations
  async addSubJob(subJob: IWorkOrderSubJob): Promise<number> {
    const sql = `
      INSERT INTO work_order_sub_jobs (
        work_order_id, description, sort_order, is_internal_job,
        total_budget, yard_estimates, owner_estimate, internal_comment,
        responsible_rank, quantity, unit, account
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute<ResultSetHeader>(sql, [
      subJob.work_order_id || null,
      subJob.description,
      subJob.sort_order ?? 1,
      subJob.is_internal_job ?? false,
      subJob.total_budget ?? 0,
      subJob.yard_estimates ?? 0,
      subJob.owner_estimate ?? 0,
      subJob.internal_comment || null,
      subJob.responsible_rank || null,
      subJob.quantity ?? 1,
      subJob.unit || 'PCS',
      subJob.account || null,
    ]);
    return result.insertId;
  }

  // Related Spares operations
  async addSpare(spare: IWorkOrderSpare): Promise<number> {
    const sql = `
      INSERT INTO work_order_spares (work_order_id, spare_name, expected_qty, cost_usd)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await pool.execute<ResultSetHeader>(sql, [
      spare.work_order_id || null,
      spare.spare_name,
      spare.expected_qty ?? 1,
      spare.cost_usd ?? 0,
    ]);
    return result.insertId;
  }

  // Checklists Instance & Snapshot Clone
  async attachChecklist(
    workOrderId: number,
    checklistId: number,
    conn: PoolConnection,
  ): Promise<number> {
    // 1. Ambil data master checklist
    const [chkRows] = await conn.execute<RowDataPacket[]>(
      `SELECT name, description FROM checklists WHERE id = ?`,
      [checklistId],
    );
    if (chkRows.length === 0) throw new Error('Checklist master not found');

    const chk = chkRows[0];
    const [headerRes] = await conn.execute<ResultSetHeader>(
      `INSERT INTO work_order_checklists (work_order_id, checklist_id, checklist_name, checklist_description)
       VALUES (?, ?, ?, ?)`,
      [workOrderId, checklistId, chk.name, chk.description],
    );
    const instanceId = headerRes.insertId;

    // 2. Clone master items sebagai snapshot jawaban
    const [items] = await conn.execute<RowDataPacket[]>(
      `SELECT title, data_type, sort_order FROM checklist_items WHERE checklist_id = ? ORDER BY sort_order ASC`,
      [checklistId],
    );

    if (items.length > 0) {
      const placeholders = items.map(() => `(?, ?, ?, ?)`).join(', ');
      const values: any[] = [];
      items.forEach((item: any) => {
        values.push(instanceId, item.title, item.data_type, item.sort_order);
      });
      await conn.query(
        `INSERT INTO work_order_checklist_values (work_order_checklist_id, title, data_type, sort_order) VALUES ${placeholders}`,
        values,
      );
    }

    return instanceId;
  }

  async getChecklistsByWorkOrder(workOrderId: number) {
    const [headers] = await pool.execute<RowDataPacket[]>(
      `SELECT * FROM work_order_checklists WHERE work_order_id = ? ORDER BY id ASC`,
      [workOrderId],
    );

    for (const h of headers) {
      const [answers] = await pool.execute<RowDataPacket[]>(
        `SELECT * FROM work_order_checklist_values WHERE work_order_checklist_id = ? ORDER BY sort_order ASC`,
        [h.id],
      );
      h.items = answers;
    }

    return headers;
  }

  async updateChecklistAnswer(
    headerId: number,
    isCompleted: boolean,
    completedDate: string | null,
    remarks: string | null,
    answers: { id: number; answer_value: string }[],
  ): Promise<void> {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      await conn.execute(
        `UPDATE work_order_checklists SET is_completed = ?, completed_date = ?, remarks = ? WHERE id = ?`,
        [isCompleted ? 1 : 0, completedDate || null, remarks || null, headerId],
      );

      for (const ans of answers) {
        await conn.execute(
          `UPDATE work_order_checklist_values SET answer_value = ? WHERE id = ? AND work_order_checklist_id = ?`,
          [ans.answer_value, ans.id, headerId],
        );
      }

      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>(
      `DELETE FROM work_order_masters WHERE id = ?`,
      [id],
    );
    return result.affectedRows > 0;
  }

  // Sub Jobs operations
  async findSubJobs(workOrderId: number): Promise<IWorkOrderSubJob[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT * FROM work_order_sub_jobs WHERE work_order_id = ? ORDER BY sort_order ASC, id ASC`,
      [workOrderId],
    );
    return rows.map((r) => ({
      id: r.id,
      work_order_id: r.work_order_id,
      description: r.description,
      sort_order: r.sort_order,
      is_internal_job: Boolean(r.is_internal_job),
      total_budget: Number(r.total_budget),
      yard_estimates: Number(r.yard_estimates),
      owner_estimate: Number(r.owner_estimate),
      internal_comment: r.internal_comment,
      responsible_rank: r.responsible_rank,
      quantity: Number(r.quantity),
      unit: r.unit,
      account: r.account,
    }));
  }

  async updateSubJob(
    workOrderId: number,
    subJobId: number,
    data: Partial<IWorkOrderSubJob>,
  ): Promise<boolean> {
    const sql = `
    UPDATE work_order_sub_jobs SET
      description = COALESCE(?, description),
      sort_order = COALESCE(?, sort_order),
      is_internal_job = COALESCE(?, is_internal_job),
      total_budget = COALESCE(?, total_budget),
      yard_estimates = COALESCE(?, yard_estimates),
      owner_estimate = COALESCE(?, owner_estimate),
      internal_comment = COALESCE(?, internal_comment),
      responsible_rank = COALESCE(?, responsible_rank),
      quantity = COALESCE(?, quantity),
      unit = COALESCE(?, unit),
      account = COALESCE(?, account)
    WHERE id = ? AND work_order_id = ?
  `;
    const [result] = await pool.execute<ResultSetHeader>(sql, [
      data.description ?? null,
      data.sort_order ?? null,
      data.is_internal_job !== undefined
        ? data.is_internal_job
          ? 1
          : 0
        : null,
      data.total_budget ?? null,
      data.yard_estimates ?? null,
      data.owner_estimate ?? null,
      data.internal_comment ?? null,
      data.responsible_rank ?? null,
      data.quantity ?? null,
      data.unit ?? null,
      data.account ?? null,
      subJobId,
      workOrderId,
    ]);
    return result.affectedRows > 0;
  }

  async deleteSubJob(workOrderId: number, subJobId: number): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>(
      `DELETE FROM work_order_sub_jobs WHERE id = ? AND work_order_id = ?`,
      [subJobId, workOrderId],
    );
    return result.affectedRows > 0;
  }

  // Spares operations
  async findSpares(workOrderId: number): Promise<IWorkOrderSpare[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT * FROM work_order_spares WHERE work_order_id = ? ORDER BY id ASC`,
      [workOrderId],
    );
    return rows.map((r) => ({
      id: r.id,
      work_order_id: r.work_order_id,
      spare_name: r.spare_name,
      expected_qty: Number(r.expected_qty),
      cost_usd: Number(r.cost_usd),
    }));
  }

  // Tasks operations
  async findTasks(
    workOrderId: number,
    status?: string,
  ): Promise<Record<string, any[]>> {
    let sql = `SELECT * FROM work_order_tasks WHERE work_order_id = ?`;
    const params: any[] = [workOrderId];

    if (status) {
      sql += ` AND status = ?`;
      params.push(status);
    }

    sql += ` ORDER BY due_date ASC, id ASC`;
    const [rows] = await pool.execute<RowDataPacket[]>(sql, params);

    return rows.reduce(
      (acc: Record<string, any[]>, row) => {
        const key = row.status;
        if (!acc[key]) acc[key] = [];
        acc[key].push({
          id: row.id,
          task_type: row.task_type,
          responsibility: row.responsibility,
          due_date: row.due_date,
          description: row.description,
          status: row.status,
        });
        return acc;
      },
      { Open: [], 'In Progress': [], Closed: [] },
    );
  }

  async addTask(workOrderId: number, data: any): Promise<number> {
    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO work_order_tasks (work_order_id, task_type, responsibility, due_date, description, status)
     VALUES (?, ?, ?, ?, ?, ?)`,
      [
        workOrderId,
        data.task_type,
        data.responsibility,
        data.due_date,
        data.description,
        data.status || 'Open',
      ],
    );
    return result.insertId;
  }

  // Purchase Orders operations
  async findPurchaseOrders(
    workOrderId: number,
    category?: string,
  ): Promise<Record<string, any[]>> {
    let sql = `SELECT * FROM work_order_purchase_orders WHERE work_order_id = ?`;
    const params: any[] = [workOrderId];

    if (category) {
      sql += ` AND category = ?`;
      params.push(category);
    }

    sql += ` ORDER BY id DESC`;
    const [rows] = await pool.execute<RowDataPacket[]>(sql, params);

    return rows.reduce(
      (acc: Record<string, any[]>, row) => {
        const cat = row.category;
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push({
          id: row.id,
          purchase_order_no: row.purchase_order_no,
          supplier: row.supplier,
          total_usd: Number(row.total_usd),
          is_approved: Boolean(row.is_approved),
        });
        return acc;
      },
      { Inventory: [], 'Spare part': [], Machinery: [] },
    );
  }
}
