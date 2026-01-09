import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { authenticate } from './middlewares/auth.middleware.js';
import authRoutes from './modules/auth/auth.routes.js';
import masterRoutes from './modules/master-data/master.routes.js';
import procurementRoutes from './modules/procurement/procurement.routes.js';
import movementRoutes from './modules/movement/movement.routes.js';
// import stockRoutes from './modules/stock/stock.routes.js';
import reorderRoutes from './modules/reorder/reorder.routes.js';
import reportRoutes from './modules/reports/reports.routes.js';
import userRoutes from './modules/users/user.routes.js';
import notificationRoutes from './modules/notifications/notifications.routes.js';
// import errorMiddleware from './middlewares/error.middleware.js';
import dashboardRoutes from './modules/dashboard/dashboard.routes.js';
import batchRoutes from './modules/batches/batch.routes.js';
import reorderRuleRoutes from './modules/reorderRules/reorderRule.routes.js';
import putawayRoutes from './modules/putaway/putaway.routes.js';
import warehouseRoutes from './modules/warehouse/warehouse.routes.js';
import pickingRoutes from './modules/picking/picking.routes.js'
import stockAgingRoutes from './modules/stock/stockAging.routes.js'
const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
console.log(process.env.DATABASE_URL);
app.use(express.json());
app.use(morgan('dev'));

/* ---------- Health Check ---------- */
app.get('/health', (_, res) => {
    res.json({ status: 'OK' });
});

/* ---------- Routes ---------- */
app.use('/api/auth', authRoutes);
app.use('/api', masterRoutes);
app.use('/api', procurementRoutes);
app.use('/api', movementRoutes);
app.use("/api/stock-aging", stockAgingRoutes);
app.use('/api', reorderRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api', batchRoutes);

app.use('/api/putaway', putawayRoutes);

app.use('/api/warehouses', warehouseRoutes);
// Mount warehouse routes also under /api/bins so frontend calls to
// `/api/bins` (e.g. GET /api/bins?warehouse_id=...) resolve correctly.
app.use('/api/bins', warehouseRoutes);
app.use('/api/picking', pickingRoutes);

app.use('/api/reorder-rules', reorderRuleRoutes);
/* ---------- Error Handler ---------- */
// app.use(errorMiddleware);

export default app;
