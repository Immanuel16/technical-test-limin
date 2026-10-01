import { Request, Response } from 'express';
import { VesselService } from '../services/vessel.service.js';

export class VesselController {
  private service: VesselService;

  constructor() {
    this.service = new VesselService();
  }

  getAll = async (_req: Request, res: Response) => {
    try {
      const data = await this.service.getAllVessels();
      res.status(200).json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const { name } = req.body;
      const data = await this.service.createVessel(name);
      res
        .status(201)
        .json({ success: true, message: 'Vessel created successfully', data });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const { name } = req.body;
      const data = await this.service.updateVessel(id, name);
      res
        .status(200)
        .json({ success: true, message: 'Vessel updated successfully', data });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  };
}
