import { Request, Response } from 'express';
import { WorkOrderService } from '../services/work-order.service.js';

export class WorkOrderController {
  private service: WorkOrderService;

  constructor() {
    this.service = new WorkOrderService();
  }

  getAll = async (req: Request, res: Response) => {
    try {
      const search = req.query.search as string | undefined;
      const specGroupId = req.query.spec_group_id
        ? Number(req.query.spec_group_id)
        : undefined;
      const data = await this.service.getWorkOrders(search, specGroupId);
      res.status(200).json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const data = await this.service.getWorkOrderDetail(id);
      res.status(200).json({ success: true, data });
    } catch (err: any) {
      res.status(404).json({ success: false, message: err.message });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const result = await this.service.createWorkOrder(req.body);
      res.status(201).json({
        success: true,
        message: 'Work Order created successfully',
        data: result,
      });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  };

  addSubJob = async (req: Request, res: Response) => {
    try {
      const workOrderId = Number(req.params.id);
      const result = await this.service.createSubJob(workOrderId, req.body);
      res.status(201).json({
        success: true,
        message: 'Sub job added successfully',
        data: result,
      });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  };

  addSpare = async (req: Request, res: Response) => {
    try {
      const workOrderId = Number(req.params.id);
      const result = await this.service.createSpare(workOrderId, req.body);
      res.status(201).json({
        success: true,
        message: 'Spare added successfully',
        data: result,
      });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  };

  attachChecklist = async (req: Request, res: Response) => {
    try {
      const workOrderId = Number(req.params.id);
      const { checklist_id } = req.body;
      const result = await this.service.attachChecklist(
        workOrderId,
        Number(checklist_id),
      );
      res.status(201).json({
        success: true,
        message: 'Checklist attached successfully',
        data: result,
      });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  };

  getChecklists = async (req: Request, res: Response) => {
    try {
      const workOrderId = Number(req.params.id);
      const data = await this.service.getWorkOrderChecklists(workOrderId);
      res.status(200).json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  saveChecklistAnswers = async (req: Request, res: Response) => {
    try {
      const headerId = Number(req.params.checklistId);
      const { is_completed, completed_date, remarks, answers } = req.body;
      await this.service.fillChecklistAnswers(
        headerId,
        is_completed,
        completedDateOrNull(completed_date),
        remarks,
        answers,
      );
      res.status(200).json({
        success: true,
        message: 'Checklist responses saved successfully',
      });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      await this.service.deleteWorkOrder(id);
      res
        .status(200)
        .json({ success: true, message: 'Work Order deleted successfully' });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  // Sub Jobs Handlers
  getSubJobs = async (req: Request, res: Response) => {
    try {
      const workOrderId = Number(req.params.id);
      const data = await this.service.getSubJobs(workOrderId);
      res.status(200).json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  updateSubJob = async (req: Request, res: Response) => {
    try {
      const workOrderId = Number(req.params.id);
      const subJobId = Number(req.params.subJobId);
      const data = await this.service.updateSubJob(
        workOrderId,
        subJobId,
        req.body,
      );
      res
        .status(200)
        .json({ success: true, message: 'Sub job updated successfully', data });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  };

  deleteSubJob = async (req: Request, res: Response) => {
    try {
      const workOrderId = Number(req.params.id);
      const subJobId = Number(req.params.subJobId);
      await this.service.removeSubJob(workOrderId, subJobId);
      res
        .status(200)
        .json({ success: true, message: 'Sub job deleted successfully' });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  };

  // Spares Handler
  getSpares = async (req: Request, res: Response) => {
    try {
      const workOrderId = Number(req.params.id);
      const data = await this.service.getSpares(workOrderId);
      res.status(200).json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  // Tasks Handlers
  getTasks = async (req: Request, res: Response) => {
    try {
      const workOrderId = Number(req.params.id);
      const status = req.query.status as string | undefined;
      const data = await this.service.getTasks(workOrderId, status);
      res.status(200).json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  createTask = async (req: Request, res: Response) => {
    try {
      const workOrderId = Number(req.params.id);
      const data = await this.service.createTask(workOrderId, req.body);
      res
        .status(201)
        .json({ success: true, message: 'Task created successfully', data });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  };

  // Purchase Orders Handler
  getPurchaseOrders = async (req: Request, res: Response) => {
    try {
      const workOrderId = Number(req.params.id);
      const category = req.query.category as string | undefined;
      const data = await this.service.getPurchaseOrders(workOrderId, category);
      res.status(200).json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  };
}

function completedDateOrNull(val: any): string | null {
  if (!val) return null;
  return new Date(val).toISOString().slice(0, 19).replace('T', ' ');
}
