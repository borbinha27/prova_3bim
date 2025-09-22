import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const filePath = path.resolve('db.json');

// Helper: lê o arquivo JSON
const readData = () => {
  if (!fs.existsSync(filePath)) return [];
  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
};

// Helper: salva os dados no JSON
const saveData = (data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// GET: todos os dados
export const getAllDados = (req, res) => {
  const data = readData();
  res.json(data);
};

// GET: um dado por ID
export const getDadoById = (req, res) => {
  const data = readData();
  const item = data.find(d => d.id === parseInt(req.params.id));
  if (item) {
    res.json(item);
  } else {
    res.status(404).json({ message: "Item não encontrado" });
  }
};

// POST: criar novo usuário
export const createDado = (req, res) => {
  const data = readData();
  const { nome, email, senha } = req.body;

  if (!senha) return res.status(400).json({ message: 'Senha obrigatória' });

  const hashedPassword = bcrypt.hashSync(senha, 6);

  const newDado = {
    id: data.length ? data[data.length - 1].id + 1 : 1,
    nome,
    email,
    senha: hashedPassword
  };

  data.push(newDado);
  saveData(data);
  res.status(201).json({ id: newDado.id, nome: newDado.nome, email: newDado.email });
};

// PUT: atualizar usuário
export const updateDado = (req, res) => {
  const id = parseInt(req.params.id);
  if (req.user.id !== id) {
    return res.status(403).json({ message: 'Acesso negado' });
  }

  const data = readData();
  const index = data.findIndex(d => d.id === id);
  if (index !== -1) {
    // Atualizar dados (sem alterar senha aqui)
    const updated = { ...data[index], ...req.body, id };
    data[index] = updated;
    saveData(data);
    res.json({ id: updated.id, nome: updated.nome, email: updated.email });
  } else {
    res.status(404).json({ message: 'Item não encontrado' });
  }
};

// DELETE: excluir usuário
export const deleteDado = (req, res) => {
  const id = parseInt(req.params.id);
  if (req.user.id !== id) {
    return res.status(403).json({ message: 'Acesso negado' });
  }

  let data = readData();
  const index = data.findIndex(d => d.id === id);
  if (index !== -1) {
    const removed = data.splice(index, 1);
    saveData(data);
    res.json(removed[0]);
  } else {
    res.status(404).json({ message: 'Item não encontrado' });
  }
};
