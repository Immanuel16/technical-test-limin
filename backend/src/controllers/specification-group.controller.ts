import { Request, Response } from 'express';
import { SpecificationGroupService } from '../services/specification-group.service.js';

export class SpecificationGroupController {
  private readonly service: SpecificationGroupService;

  constructor() {
    this.service = new SpecificationGroupService();
  }

  getAll = async (req: Request, res: Response) => {
    try {
      const search = req.query.search as string | undefined;
      const vesselId = req.query.vessel_id
        ? Number(req.query.vessel_id)
        : undefined;
      const data = await this.service.getAll(search, vesselId);
      res.status(200).json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const result = await this.service.createGroup(req.body);
      res
        .status(201)
        .json({
          success: true,
          message: 'Specification group created successfully',
          data: result,
        });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      await this.service.removeGroup(id);
      res
        .status(200)
        .json({
          success: true,
          message: 'Specification group deleted successfully',
        });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  };
}
