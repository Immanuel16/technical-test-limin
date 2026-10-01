import { pool } from '../config/database.js';
import { IChecklist, IChecklistItem } from '../models/checklist.model.js';
import { PoolConnection, RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export class ChecklistRepository {
  async findAll(search?: string, isActive?: boolean): Promise<IChecklist[]> {
    let sql = `SELECT id, name, description, is_active, created_at FROM checklists WHERE 1=1`;
    const params: any[] = [];

    if (search) {
      sql += ` AND (name LIKE ? OR description LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    if (typeof isActive === 'boolean') {
      sql += ` AND is_active = ?`;
      params.push(isActive ? 1 : 0);
    }

    sql += ` ORDER BY id DESC`;

    const [rows] = await pool.query<RowDataPacket[]>(sql, params);
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      is_active: Boolean(r.is_active),
      created_at: r.created_at,
    }));
  }

  async findById(id: number): Promise<IChecklist | null> {
    const [checklistRows] = await pool.execute<RowDataPacket[]>(
      `SELECT id, name, description, is_active FROM checklists WHERE id = ?`,
      [id],
    );

    if (checklistRows.length === 0) return null;

    const [itemRows] = await pool.execute<RowDataPacket[]>(
      `SELECT id, title, data_type, sort_order 
       FROM checklist_items 
       WHERE checklist_id = ? 
       ORDER BY sort_order ASC, id ASC`,
      [id],
    );

    const checklist = checklistRows[0];
    return {
      id: checklist.id,
      name: checklist.name,
      description: checklist.description,
      is_active: Boolean(checklist.is_active),
      items: itemRows as IChecklistItem[],
    };
  }

  async create(data: IChecklist, conn: PoolConnection): Promise<number> {
    const [result] = await conn.execute<ResultSetHeader>(
      `INSERT INTO checklists (name, description, is_active) VALUES (?, ?, ?)`,
      [data.name, data.description || null, data.is_active ?? true],
    );
    return result.insertId;
  }

  async update(
    id: number,
    data: Partial<IChecklist>,
    conn: PoolConnection,
  ): Promise<void> {
    await conn.execute(
      `UPDATE checklists SET name = COALESCE(?, name), description = COALESCE(?, description), is_active = COALESCE(?, is_active) WHERE id = ?`,
      [data.name ?? null, data.description ?? null, data.is_active ?? null, id],
    );
  }

  async insertItems(
    checklistId: number,
    items: IChecklistItem[],
    conn: PoolConnection,
  ): Promise<void> {
    if (items.length === 0) return;

    const placeholders = items.map(() => `(?, ?, ?, ?)`).join(', ');
    const values: any[] = [];

    items.forEach((item, index) => {
      values.push(
        checklistId,
        item.title,
        item.data_type,
        item.sort_order ?? index + 1,
      );
    });

    const sql = `INSERT INTO checklist_items (checklist_id, title, data_type, sort_order) VALUES ${placeholders}`;
    await conn.query(sql, values);
  }

  async deleteItemsByChecklistId(
    checklistId: number,
    conn: PoolConnection,
  ): Promise<void> {
    await conn.execute(`DELETE FROM checklist_items WHERE checklist_id = ?`, [
      checklistId,
    ]);
  }

  async updateActiveStatus(id: number, isActive: boolean): Promise<boolean> {
    const [res] = await pool.execute<ResultSetHeader>(
      `UPDATE checklists SET is_active = ? WHERE id = ?`,
      [isActive ? 1 : 0, id],
    );
    return res.affectedRows > 0;
  }

  async delete(id: number): Promise<boolean> {
    const [res] = await pool.execute<ResultSetHeader>(
      `DELETE FROM checklists WHERE id = ?`,
      [id],
    );
    return res.affectedRows > 0;
  }
}
