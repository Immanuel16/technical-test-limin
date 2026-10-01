import { pool } from '../config/database.js';
import { IVessel } from '../models/vessel.model.js';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export class VesselRepository {
  findAll = async (): Promise<IVessel[]> => {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT id, name, created_at, updated_at FROM vessels ORDER BY name ASC`,
    );
    return rows as IVessel[];
  };

  findById = async (id: number): Promise<IVessel | null> => {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT id, name, created_at, updated_at FROM vessels WHERE id = ?`,
      [id],
    );
    return rows.length > 0 ? (rows[0] as IVessel) : null;
  };

  create = async (name: string): Promise<number> => {
    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO vessels (name) VALUES (?)`,
      [name],
    );
    return result.insertId;
  };

  update = async (id: number, name: string): Promise<boolean> => {
    const [result] = await pool.execute<ResultSetHeader>(
      `UPDATE vessels SET name = ? WHERE id = ?`,
      [name, id],
    );
    return result.affectedRows > 0;
  };
}
