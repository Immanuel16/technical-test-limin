import { Router } from 'express';
import { MachineryController } from '../controllers/machinery.controller.js';

export const machineryGroupRouter = Router();
export const machineryRouter = Router();

const controller = new MachineryController();

// /api/v1/machinery-groups
machineryGroupRouter.get('/', controller.getGroups);
machineryGroupRouter.post('/', controller.createGroup);

// /api/v1/machineries
machineryRouter.get('/', controller.getMachineries);
machineryRouter.post('/', controller.createMachinery);
