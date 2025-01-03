import { Router } from 'express';
import { login } from '../controllers/auth.controller.js';

const auth = Router();

auth.post('/login', login);

export default auth;
