import { DryDockRepository } from '../repositories/dry-dock.repository.js';
import { IDryDock } from '../models/dry-dock.model.js';
import { pool } from '../config/database.js';

export class DryDockService {
  private repo: DryDockRepository;

  constructor() {
    this.repo = new DryDockRepository();
  }

  getAllDryDocks = async (search?: string, status?: string) =>
    await this.repo.findAll(search, status);

  getDryDockById = async (id: number) => {
    const dd = await this.repo.findById(id);
    if (!dd) throw new Error('Dry Dock not found');
    return dd;
  };

  createDryDock = async (payload: IDryDock) => {
    if (!payload.vessel_id) throw new Error('Vessel is required');
    if (!payload.dock_list_no) throw new Error('Dock List No is required');
    if (!payload.description) throw new Error('Description is required');

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      const newId = await this.repo.create(payload, conn);
      await conn.commit();
      return { id: newId, ...payload };
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  };

  changeStatus = async (id: number, status: string) =>
    await this.repo.updateStatus(id, status);

  linkSpecifications = async (dryDockId: number, workOrderIds: number[]) => {
    await this.repo.addWorkOrders(dryDockId, workOrderIds);
    return { success: true, count: workOrderIds.length };
  };

  getSpecifications = async (dryDockId: number) =>
    await this.repo.getSpecifications(dryDockId);

  getCostSummary = async (dryDockId: number) =>
    await this.repo.getCostSummary(dryDockId);

  copyYardEstimates = async (dryDockId: number) => {
    await this.repo.copyYardEstimatesToActual(dryDockId);
    return {
      success: true,
      message: 'Yard estimates copied to actual costs successfully',
    };
  };
}
