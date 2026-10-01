import { Router } from 'express';
import { ChecklistController } from '../controllers/checklist.controller.js';

const router = Router();
const controller = new ChecklistController();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id/status', controller.toggleActive);
router.delete('/:id', controller.delete);

export default router;
