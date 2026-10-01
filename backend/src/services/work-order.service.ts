import { WorkOrderRepository } from '../repositories/work-order.repository.js';
import {
  IWorkOrder,
  IWorkOrderSubJob,
  IWorkOrderSpare,
} from '../models/work-order.model.js';
import { pool } from '../config/database.js';

export class WorkOrderService {
  private repo: WorkOrderRepository;

  constructor() {
    this.repo = new WorkOrderRepository();
  }

  async getWorkOrders(search?: string, specGroupId?: number) {
    return await this.repo.findAllGrouped(search, specGroupId);
  }

  async getWorkOrderDetail(id: number) {
    const wo = await this.repo.findById(id);
    if (!wo) throw new Error('Work Order not found');
    return wo;
  }

  async createWorkOrder(payload: IWorkOrder) {
    if (!payload.job_name || payload.job_name.trim() === '') {
      throw new Error('Job Name is required');
    }
    if (!payload.specification_group_id) {
      throw new Error('Specification Group is required');
    }
    if (!payload.job_description || payload.job_description.trim() === '') {
      throw new Error('Job Description is required');
    }

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      const insertId = await this.repo.create(payload, conn);
      await conn.commit();
      return { id: insertId, ...payload };
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  async createSubJob(workOrderId: number, payload: IWorkOrderSubJob) {
    if (!payload.description || payload.description.trim() === '') {
      throw new Error('Sub Job description is required');
    }
    payload.work_order_id = workOrderId;
    const subJobId = await this.repo.addSubJob(payload);
    return { id: subJobId, ...payload };
  }

  async createSpare(workOrderId: number, payload: IWorkOrderSpare) {
    if (!payload.spare_name || payload.spare_name.trim() === '') {
      throw new Error('Spare name is required');
    }
    payload.work_order_id = workOrderId;
    const spareId = await this.repo.addSpare(payload);
    return { id: spareId, ...payload };
  }

  async attachChecklist(workOrderId: number, checklistId: number) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      const instanceId = await this.repo.attachChecklist(
        workOrderId,
        checklistId,
        conn,
      );
      await conn.commit();
      return {
        instance_id: instanceId,
        work_order_id: workOrderId,
        checklist_id: checklistId,
      };
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  async getWorkOrderChecklists(workOrderId: number) {
    return await this.repo.getChecklistsByWorkOrder(workOrderId);
  }

  async fillChecklistAnswers(
    headerId: number,
    isCompleted: boolean,
    completedDate: string | null,
    remarks: string | null,
    answers: { id: number; answer_value: string }[],
  ) {
    await this.repo.updateChecklistAnswer(
      headerId,
      isCompleted,
      completedDate,
      remarks,
      answers,
    );
    return { success: true };
  }

  async deleteWorkOrder(id: number) {
    return await this.repo.delete(id);
  }

  // Sub Jobs
  async getSubJobs(workOrderId: number) {
    return await this.repo.findSubJobs(workOrderId);
  }

  async updateSubJob(
    workOrderId: number,
    subJobId: number,
    payload: Partial<IWorkOrderSubJob>,
  ) {
    const success = await this.repo.updateSubJob(
      workOrderId,
      subJobId,
      payload,
    );
    if (!success) throw new Error('Sub Job not found or failed to update');
    return { id: subJobId, ...payload };
  }

  async removeSubJob(workOrderId: number, subJobId: number) {
    const success = await this.repo.deleteSubJob(workOrderId, subJobId);
    if (!success) throw new Error('Sub Job not found or failed to delete');
    return { success: true };
  }

  // Spares
  async getSpares(workOrderId: number) {
    return await this.repo.findSpares(workOrderId);
  }

  // Tasks
  async getTasks(workOrderId: number, status?: string) {
    return await this.repo.findTasks(workOrderId, status);
  }

  async createTask(workOrderId: number, payload: any) {
    if (
      !payload.task_type ||
      !payload.responsibility ||
      !payload.due_date ||
      !payload.description
    ) {
      throw new Error(
        'Task type, responsibility, due date, and description are required',
      );
    }
    const id = await this.repo.addTask(workOrderId, payload);
    return { id, work_order_id: workOrderId, ...payload };
  }

  // Purchase Orders
  async getPurchaseOrders(workOrderId: number, category?: string) {
    return await this.repo.findPurchaseOrders(workOrderId, category);
  }
}
