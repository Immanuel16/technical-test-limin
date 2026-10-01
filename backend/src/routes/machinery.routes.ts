import { Router } from 'express';
import { MachineryController } from '../controllers/machinery.controller.js';

export const machineryGroupRouter = Router();
export const machineryRouter = Router();

const controller = new MachineryController();

machineryGroupRouter.get('/', controller.getGroups);
machineryRouter.get('/', controller.getMachineries);
