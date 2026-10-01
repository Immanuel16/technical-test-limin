import { pool } from '../config/database.js';
import { ISpecificationGroup } from '../models/specification-group,model.js';
import { PoolConnection, RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export class SpecificationGroupRepository {
  async findAll(
    search?: string,
    vesselId?: number,
  ): Promise<ISpecificationGroup[]> {
    let sql = `
      SELECT 
        sg.id,
        sg.name,
        sg.group_no,
        sg.sort_order,
        sg.is_frontpage,
        GROUP_CONCAT(v.name ORDER BY v.name SEPARATOR ', ') AS vessel_names
      FROM specification_groups sg
      LEFT JOIN specification_group_vessels sgv ON sg.id = sgv.specification_group_id
      LEFT JOIN vessels v ON sgv.vessel_id = v.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (search) {
      sql += ` AND (sg.name LIKE ? OR sg.group_no LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    if (vesselId) {
      sql += ` AND sg.id IN (
        SELECT specification_group_id FROM specification_group_vessels WHERE vessel_id = ?
      )`;
      params.push(vesselId);
    }

    sql += ` GROUP BY sg.id ORDER BY sg.sort_order ASC, sg.id DESC`;

    const [rows] = await pool.query<RowDataPacket[]>(sql, params);
    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      group_no: row.group_no,
      sort_order: row.sort_order,
      is_frontpage: Boolean(row.is_frontpage),
      vessels: row.vessel_names ? row.vessel_names.split(', ') : [],
    }));
  }

  async create(
    data: ISpecificationGroup,
    connection: PoolConnection,
  ): Promise<number> {
    const sql = `
      INSERT INTO specification_groups (name, group_no, sort_order, is_frontpage) 
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await connection.execute<ResultSetHeader>(sql, [
      data.name,
      data.group_no || null,
      data.sort_order ?? 0,
      data.is_frontpage ?? false,
    ]);
    return result.insertId;
  }

  async syncVessels(
    groupId: number,
    vesselIds: number[],
    connection: PoolConnection,
  ): Promise<void> {
    await connection.execute(
      `DELETE FROM specification_group_vessels WHERE specification_group_id = ?`,
      [groupId],
    );
    if (vesselIds.length > 0) {
      const values = vesselIds.map((vId) => `(${groupId}, ${vId})`).join(', ');
      await connection.query(
        `INSERT INTO specification_group_vessels (specification_group_id, vessel_id) VALUES ${values}`,
      );
    }
  }

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>(
      `DELETE FROM specification_groups WHERE id = ?`,
      [id],
    );
    return result.affectedRows > 0;
  }
}
