import bcrypt from 'bcryptjs';

import {generateToken}  from '../middleware/auth.js';
import {readData} from '../controller/usersController.js'

// POST /api/dados/login
export const login = (req, res) => {
  const { nome, senha, email } = req.body;
  const data = readData();
  const user = data.find(u => u.nome === nome && u.email === email);

  // Verifica usuário
  if (!user) return res.status(401).json({ message: 'Usuário não encontrado' });

  // Verifica senha
  if (!bcrypt.compareSync(senha, user.senha)) {
    return res.status(401).json({ message: 'Senha incorreta' });
  }

  const token = generateToken(user);
  res.json({ token });
};