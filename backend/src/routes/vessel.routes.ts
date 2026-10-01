import { Router } from 'express';
import { VesselController } from '../controllers/vessel.controller.js';

const router = Router();
const controller = new VesselController();

router.get('/', controller.getAll);
router.post('/', controller.create);
router.put('/:id', controller.update);

export default router;
