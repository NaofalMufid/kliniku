import { Router } from 'express';
import dokter from './dokter.route.js';
import rawat from './rawat.route.js';
import lab from './lab.route.js';
import periksa from './pemeriksaan.route.js';
import auth from './auth.route.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const routes = Router();

// Public routes (no auth required)
routes.use("/auth", auth);

// Protected routes (auth required)
routes.use("/dokter", verifyToken, dokter);
routes.use("/rawat", verifyToken, rawat);
routes.use("/lab", verifyToken, lab);
routes.use("/pemeriksaan", verifyToken, periksa);

export default routes;