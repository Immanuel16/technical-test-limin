import { SpecificationGroupRepository } from '../repositories/specification-group.repository.js';
import { ISpecificationGroup } from '../models/specification-group,model.js';
import { pool } from '../config/database.js';

export class SpecificationGroupService {
  private repo: SpecificationGroupRepository;

  constructor() {
    this.repo = new SpecificationGroupRepository();
  }

  async getAll(search?: string, vesselId?: number) {
    return await this.repo.findAll(search, vesselId);
  }

  async createGroup(payload: ISpecificationGroup) {
    if (!payload.name || payload.name.trim() === '') {
      throw new Error('Name is required');
    }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const newId = await this.repo.create(payload, connection);
      if (payload.vessel_ids && payload.vessel_ids.length > 0) {
        await this.repo.syncVessels(newId, payload.vessel_ids, connection);
      }

      await connection.commit();
      return { id: newId, ...payload };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async removeGroup(id: number) {
    return await this.repo.delete(id);
  }
}
