import { ChecklistRepository } from '../repositories/checklist.repository.js';
import { IChecklist } from '../models/checklist.model.js';
import { pool } from '../config/database.js';

export class ChecklistService {
  private repo: ChecklistRepository;

  constructor() {
    this.repo = new ChecklistRepository();
  }

  async getChecklists(search?: string, isActive?: boolean) {
    return await this.repo.findAll(search, isActive);
  }

  async getChecklistDetail(id: number) {
    const checklist = await this.repo.findById(id);
    if (!checklist) throw new Error('Checklist not found');
    return checklist;
  }

  async createChecklist(payload: IChecklist) {
    if (!payload.name || payload.name.trim() === '') {
      throw new Error('Checklist Name is required');
    }
    if (!payload.items || payload.items.length === 0) {
      throw new Error('Minimum one item required');
    }

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      const checklistId = await this.repo.create(payload, conn);
      await this.repo.insertItems(checklistId, payload.items, conn);

      await conn.commit();
      return { id: checklistId, ...payload };
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  async updateChecklist(id: number, payload: IChecklist) {
    if (!payload.name || payload.name.trim() === '') {
      throw new Error('Checklist Name is required');
    }
    if (!payload.items || payload.items.length === 0) {
      throw new Error('Minimum one item required');
    }

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      await this.repo.update(id, payload, conn);
      // Sinkronisasi item: bersihkan data lama, masukkan set item baru
      await this.repo.deleteItemsByChecklistId(id, conn);
      await this.repo.insertItems(id, payload.items, conn);

      await conn.commit();
      return { id, ...payload };
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  async toggleActive(id: number, isActive: boolean) {
    return await this.repo.updateActiveStatus(id, isActive);
  }

  async deleteChecklist(id: number) {
    return await this.repo.delete(id);
  }
}
