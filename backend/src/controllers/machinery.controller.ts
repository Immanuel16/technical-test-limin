import { Request, Response } from 'express';
import { MachineryService } from '../services/machinery.service.js';

export class MachineryController {
  private service: MachineryService;

  constructor() {
    this.service = new MachineryService();
  }

  getGroups = async (_req: Request, res: Response) => {
    try {
      const data = await this.service.getMachineryGroups();
      res.status(200).json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  createGroup = async (req: Request, res: Response) => {
    try {
      const { name } = req.body;
      const data = await this.service.createMachineryGroup(name);
      res.status(201).json({
        success: true,
        message: 'Machinery group created successfully',
        data,
      });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  };

  getMachineries = async (req: Request, res: Response) => {
    try {
      const groupId = req.query.group_id
        ? Number(req.query.group_id)
        : undefined;
      const data = await this.service.getMachineries(groupId);
      res.status(200).json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  createMachinery = async (req: Request, res: Response) => {
    try {
      const { machinery_group_id, name, code } = req.body;
      const data = await this.service.createMachinery({
        machinery_group_id: Number(machinery_group_id),
        name,
        code,
      });
      res.status(201).json({
        success: true,
        message: 'Machinery created successfully',
        data,
      });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  };
}
