import { Router } from 'express';
import { WorkOrderController } from '../controllers/work-order.controller.js';

const router = Router();
const controller = new WorkOrderController();

// Header
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.delete('/:id', controller.delete);

// Sub Jobs
router.get('/:id/sub-jobs', controller.getSubJobs);
router.post('/:id/sub-jobs', controller.addSubJob);
router.put('/:id/sub-jobs/:subJobId', controller.updateSubJob);
router.delete('/:id/sub-jobs/:subJobId', controller.deleteSubJob);

// Spares
router.get('/:id/spares', controller.getSpares);
router.post('/:id/spares', controller.addSpare);

// Checklists Instance
router.post('/:id/checklists', controller.attachChecklist);
router.get('/:id/checklists', controller.getChecklists);
router.put(
  '/:id/checklists/:checklistId/answers',
  controller.saveChecklistAnswers,
);

// Tasks
router.get('/:id/tasks', controller.getTasks);
router.post('/:id/tasks', controller.createTask);

// Purchase Orders
router.get('/:id/purchase-orders', controller.getPurchaseOrders);

export default router;
