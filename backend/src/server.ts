import express from 'express';
import cors from 'cors';

import specGroupRoutes from './routes/specification-group.routes.js';
import checklistRoutes from './routes/checklist.routes.js';
import workOrderRoutes from './routes/work-order.routes.js';
import dryDockRoutes from './routes/dry-dock.routes.js';
import vesselRoutes from './routes/vessel.routes.js';
import {
  machineryGroupRouter,
  machineryRouter,
} from './routes/machinery.routes.js';

const app = express();
app.use(cors());
app.use(express.json());

// API Endpoints
app.use('/api/v1/vessels', vesselRoutes);
app.use('/api/v1/machinery-groups', machineryGroupRouter);
app.use('/api/v1/machineries', machineryRouter);
app.use('/api/v1/specification-groups', specGroupRoutes);
app.use('/api/v1/checklists', checklistRoutes);
app.use('/api/v1/work-orders', workOrderRoutes);
app.use('/api/v1/dry-docks', dryDockRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`DryDock Backend Server running on port ${PORT}`);
});
