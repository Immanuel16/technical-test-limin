import { IDryDock, ICostSummary } from './../models/dry-dock.model';
import { pool } from '../config/database';
import { PoolConnection, RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export class DryDockRepository {
  findAll = async (search?: string, status?: string): Promise<IDryDock[]> => {
    let sql = `
      SELECT dd.*, v.name AS vessel_name
      FROM dry_docks dd
      INNER JOIN vessels v ON dd.vessel_id = v.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (search) {
      sql += ` AND (dd.dock_list_no LIKE ? OR dd.description LIKE ? OR v.name LIKE ?)`;
      params.push(search);
    }

    if (status) {
      sql += ` AND dd.status = ?`;
      params.push(status);
    }

    sql += ` ORDER BY dd.id DESC`;

    const [rows] = await pool.query<RowDataPacket[]>(sql, params);
    return rows as IDryDock[];
  };

  findById = async (id: number): Promise<IDryDock | null> => {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT dd.*, v.name AS vessel_name
      FROM dry_docks dd
      INNER JOIN vessels v ON dd.vessel_id = v.id
      WHERE dd.id = ?`,
      [id],
    );
    return rows.length > 0 ? (rows[0] as IDryDock) : null;
  };

  create = async (data: IDryDock, conn: PoolConnection): Promise<number> => {
    const sql = `
      INSERT INTO dry_docks (
        vessel_id, dock_list_no, description, shipyard_name, details_of_shipyard,
        planned_start_date, planned_end_date, actual_start_date, actual_end_date,
        account_code, budget, currency, responsible_rank, status, priority
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await conn.execute<ResultSetHeader>(sql, [
      data.vessel_id,
      data.dock_list_no,
      data.description,
      data.shipyard_name || null,
      data.details_of_shipyard || null,
      data.planned_start_date || null,
      data.planned_end_date || null,
      data.actual_start_date || null,
      data.actual_end_date || null,
      data.account_code || null,
      data.budget || 0,
      data.currency || 'USD',
      data.responsible_rank || null,
      data.status || 'Planning',
      data.priority || 'Medium',
    ]);
    return result.insertId;
  };

  updateStatus = async (id: number, status: string): Promise<boolean> => {
    const [res] = await pool.execute<ResultSetHeader>(
      `UPDATE dry_docks SET status = ? WHERE id = ?`,
      [status, id],
    );
    return res.affectedRows > 0;
  };

  // Specifications link & group mapping
  addWorkOrders = async (
    dryDockId: number,
    workOrderIds: number[],
  ): Promise<void> => {
    if (workOrderIds.length === 0) return;
    const values = workOrderIds
      .map((woId) => `(${dryDockId}, ${woId})`)
      .join(', ');
    await pool.query(
      `INSERT IGNORE INTO dry_dock_work_orders (dry_dock_id, work_order_id) VALUES ${values}`,
    );
  };

  getSpecifications = async (
    dryDockId: number,
  ): Promise<Record<string, any[]>> => {
    const sql = `
      SELECT 
        ddwo.id AS dry_dock_work_order_id,
        ddwo.status,
        wom.id AS work_order_id,
        wom.job_name,
        wom.job_code,
        sg.name AS spec_group_name,
        m.name AS machinery_name
      FROM dry_dock_work_orders ddwo
      INNER JOIN work_order_masters wom ON ddwo.work_order_id = wom.id
      INNER JOIN specification_groups sg ON wom.specification_group_id = sg.id
      LEFT JOIN machineries m ON wom.machinery_id = m.id
      WHERE ddwo.dry_dock_id = ?
      ORDER BY sg.name ASC, ddwo.id ASC
    `;
    const [rows] = await pool.execute<RowDataPacket[]>(sql, [dryDockId]);

    return rows.reduce((acc: Record<string, any[]>, row) => {
      const group = row.spec_group_name;
      if (!acc[group]) acc[group] = [];
      acc[group].push(row);
      return acc;
    }, {});
  };

  // Cost Aggregation & Breakdown
  async getCostSummary(dryDockId: number): Promise<ICostSummary> {
    const [ddRows] = await pool.execute<RowDataPacket[]>(
      `SELECT budget FROM dry_docks WHERE id = ?`,
      [dryDockId],
    );
    const budget = Number(ddRows[0]?.budget || 0);

    const sql = `
      SELECT 
        COALESCE(SUM(sj.yard_estimates), 0) AS total_yard_estimates,
        COALESCE(SUM(sj.owner_estimate), 0) AS total_owner_estimates,
        COALESCE(SUM(ddwo.actual_yard_costs), 0) AS total_actual_yard_costs,
        COALESCE(SUM(ddwo.actual_owner_costs), 0) AS total_actual_owner_costs
      FROM dry_dock_work_orders ddwo
      LEFT JOIN work_order_sub_jobs sj ON ddwo.work_order_id = sj.work_order_id
      WHERE ddwo.dry_dock_id = ?
    `;
    const [costRows] = await pool.execute<RowDataPacket[]>(sql, [dryDockId]);
    const r = costRows[0];

    const yard_estimates = Number(r.total_yard_estimates);
    const owner_estimates = Number(r.total_owner_estimates);
    const total_estimates = yard_estimates + owner_estimates;
    const actual_yard_costs = Number(r.total_actual_yard_costs);
    const actual_owner_costs = Number(r.total_actual_owner_costs);
    const total_costs = actual_yard_costs + actual_owner_costs;
    const variance = budget - total_costs;

    return {
      budget,
      yard_estimates,
      owner_estimates,
      total_estimates,
      actual_yard_costs,
      actual_owner_costs,
      total_costs,
      variance,
    };
  }

  copyYardEstimatesToActual = async (dryDockId: number): Promise<void> => {
    const sql = `
      UPDATE dry_dock_work_orders ddwo
      SET ddwo.actual_yard_costs = (
        SELECT COALESCE(SUM(sj.yard_estimates), 0) 
        FROM work_order_sub_jobs sj 
        WHERE sj.work_order_id = ddwo.work_order_id
      )
      WHERE ddwo.dry_dock_id = ?
    `;
    await pool.execute(sql, [dryDockId]);
  };
}
