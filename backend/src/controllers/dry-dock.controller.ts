import { Request, Response } from 'express';
import { DryDockService } from '../services/dry-dock.service.js';

export class DryDockController {
  private service: DryDockService;

  constructor() {
    this.service = new DryDockService();
  }

  getAll = async (req: Request, res: Response) => {
    try {
      const search = req.query.search as string | undefined;
      const status = req.query.status as string | undefined;
      const data = await this.service.getAllDryDocks(search, status);
      res.status(200).json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const data = await this.service.getDryDockById(id);
      res.status(200).json({ success: true, data });
    } catch (err: any) {
      res.status(404).json({ success: false, message: err.message });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const result = await this.service.createDryDock(req.body);
      res
        .status(201)
        .json({
          success: true,
          message: 'Dry Dock created successfully',
          data: result,
        });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  };

  updateStatus = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const { status } = req.body;
      await this.service.changeStatus(id, status);
      res
        .status(200)
        .json({ success: true, message: 'Status updated successfully' });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  };

  getSpecifications = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const data = await this.service.getSpecifications(id);
      res.status(200).json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  addSpecifications = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const { work_order_ids } = req.body;
      const result = await this.service.linkSpecifications(id, work_order_ids);
      res.status(201).json({ success: true, data: result });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  };

  getCostSummary = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const data = await this.service.getCostSummary(id);
      res.status(200).json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  copyYardEstimates = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const result = await this.service.copyYardEstimates(id);
      res.status(200).json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  };
}
