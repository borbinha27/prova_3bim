import express from 'express';
import {
  getAllDados,
  createDado,
} from '../controller/usersController.js';


const users = express.Router();

users.get('/', getAllDados);
users.post('/', createDado);

export { users };
