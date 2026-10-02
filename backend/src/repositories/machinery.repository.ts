import { pool } from '../config/database.js';
import { IMachineryGroup, IMachinery } from '../models/machinery.model.js';
import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';

export class MachineryRepository {
  findAllGroups = async (): Promise<IMachineryGroup[]> => {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT id, name, created_at FROM machinery_groups ORDER BY name ASC`,
    );
    return rows as IMachineryGroup[];
  };

  findMachineries = async (groupId?: number): Promise<IMachinery[]> => {
    let sql = `
      SELECT m.id, m.machinery_group_id, m.name, m.code, mg.name AS machinery_group_name
      FROM machineries m
      LEFT JOIN machinery_groups mg ON m.machinery_group_id = mg.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (groupId) {
      sql += ` AND m.machinery_group_id = ?`;
      params.push(groupId);
    }

    sql += ` ORDER BY m.name ASC`;
    const [rows] = await pool.query<RowDataPacket[]>(sql, params);
    return rows as IMachinery[];
  };

  // Create Machinery Group
  createGroup = async (name: string): Promise<number> => {
    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO machinery_groups (name) VALUES (?)`,
      [name],
    );
    return result.insertId;
  };

  // Create Machinery
  createMachinery = async (data: {
    machinery_group_id: number;
    name: string;
    code?: string | null;
  }): Promise<number> => {
    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO machineries (machinery_group_id, name, code) VALUES (?, ?, ?)`,
      [data.machinery_group_id, data.name, data.code || null],
    );
    return result.insertId;
  };

  findGroupById = async (id: number): Promise<IMachineryGroup | null> => {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT id, name, created_at FROM machinery_groups WHERE id = ?`,
      [id],
    );
    return rows.length > 0 ? (rows[0] as IMachineryGroup) : null;
  };
}
