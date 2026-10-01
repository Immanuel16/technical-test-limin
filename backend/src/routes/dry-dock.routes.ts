import { Router } from 'express';
import { DryDockController } from '../controllers/dry-dock.controller.js';

const router = Router();
const controller = new DryDockController();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.patch('/:id/status', controller.updateStatus);

// Specs & Work Orders
router.get('/:id/specifications', controller.getSpecifications);
router.post('/:id/specifications', controller.addSpecifications);

// Costs Summary & Bulk Operations
router.get('/:id/costs-summary', controller.getCostSummary);
router.post('/:id/costs/copy-yard-to-actual', controller.copyYardEstimates);

export default router;
