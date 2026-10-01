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
}
