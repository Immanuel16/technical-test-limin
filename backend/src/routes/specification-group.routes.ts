// src/routes/specification-group.routes.ts
import { Router } from 'express';
import { SpecificationGroupController } from '../controllers/specification-group.controller.js';

const router = Router();
const controller = new SpecificationGroupController();

router.get('/', controller.getAll);
router.post('/', controller.create);
router.delete('/:id', controller.delete);

export default router;
