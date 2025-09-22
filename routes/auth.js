import express from 'express';
import {
  getDadoById,
  updateDado,
  deleteDado,
} from '../controller/usersController.js';
import {login} from '../controller/authController.js'
import { authenticateToken } from '../middleware/auth.js';

const auth = express.Router();

auth.post('/login', login);
auth.get('/:id', getDadoById);
auth.put('/:id', authenticateToken, updateDado);
auth.delete('/:id', authenticateToken, deleteDado);

export { auth };
