import { Request, Response } from 'express';
import { ChecklistService } from '../services/checklist.service.js';

export class ChecklistController {
  private service: ChecklistService;

  constructor() {
    this.service = new ChecklistService();
  }

  getAll = async (req: Request, res: Response) => {
    try {
      const search = req.query.search as string | undefined;
      const isActive =
        req.query.is_active !== undefined
          ? req.query.is_active === 'true'
          : undefined;
      const data = await this.service.getChecklists(search, isActive);
      res.status(200).json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const data = await this.service.getChecklistDetail(id);
      res.status(200).json({ success: true, data });
    } catch (err: any) {
      res.status(404).json({ success: false, message: err.message });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const result = await this.service.createChecklist(req.body);
      res
        .status(201)
        .json({
          success: true,
          message: 'Checklist created successfully',
          data: result,
        });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const result = await this.service.updateChecklist(id, req.body);
      res
        .status(200)
        .json({
          success: true,
          message: 'Checklist updated successfully',
          data: result,
        });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  };

  toggleActive = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const { is_active } = req.body;
      await this.service.toggleActive(id, Boolean(is_active));
      res
        .status(200)
        .json({
          success: true,
          message: 'Checklist status updated successfully',
        });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      await this.service.deleteChecklist(id);
      res
        .status(200)
        .json({ success: true, message: 'Checklist deleted successfully' });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  };
}
