# 📋 Avaliação do Trabalho - CRUD JWT JSON

## 📊 Resumo Geral
**Pontuação Geral: 7.5/10**

O projeto apresenta uma implementação funcional da API com autenticação JWT, demonstrando compreensão dos conceitos básicos. Porém, há divergências significativas em relação às especificações do README, principalmente nas rotas e na estrutura do projeto.

---

## ✅ Pontos Positivos

### 1. **Implementação de Segurança**
- ✅ Uso correto do `bcryptjs` para hash de senhas
- ✅ Implementação adequada de JWT com expiração de 1h
- ✅ Middleware de autenticação funcional (`authenticateToken`)
- ✅ Proteção de rotas sensíveis (update e delete)

### 2. **Persistência de Dados**
- ✅ Implementação correta de leitura/escrita no `db.json`
- ✅ Funções helper bem organizadas (`readData`, `saveData`)

### 3. **Funcionalidades Implementadas**
- ✅ CRUD completo de usuários
- ✅ Sistema de login funcional
- ✅ Controle de acesso (usuário só pode editar/deletar próprio perfil)

### 4. **Boas Práticas**
- ✅ Uso de ES6 modules
- ✅ Separação de controllers e routes
- ✅ Middleware isolado
- ✅ Tratamento básico de erros

---

## ❌ Problemas Encontrados

### 1. **Divergências nas Rotas (CRÍTICO)**

#### ❌ Rota de Registro
**Esperado:** `POST /register`  
**Implementado:** `POST /api/dados`

```javascript
// Deveria ser:
app.post('/register', createDado);

// Está como:
users.post('/', createDado); // resulta em /api/dados
```

#### ❌ Rotas de Usuários
**Esperado:** `/users/*`  
**Implementado:** `/api/dados/*`

Todas as rotas deveriam seguir o padrão `/users` conforme especificação:
- `GET /users` (listar todos)
- `GET /users/:id` (buscar por ID)
- `PUT /users/:id` (atualizar)
- `DELETE /users/:id` (deletar)

### 2. **Estrutura de Diretórios**

#### ❌ Nomenclatura Incorreta
**Esperado:** `controllers/`  
**Implementado:** `controller/` (singular)

#### ❌ Arquivo Faltante
**Esperado:** `utils/db.js`  
**Implementado:** Funções de DB estão dentro do `usersController.js`

As funções `readData()` e `saveData()` deveriam estar em um arquivo separado `utils/db.js` para melhor organização e reutilização.

### 3. **Exportação de Funções**

#### ⚠️ Problema no `usersController.js`
A função `readData` não é exportada explicitamente, mas é usada no `authController.js`:

```javascript
// authController.js
import {readData} from '../controller/usersController.js'
```

**Solução:** Adicionar export em `usersController.js`:
```javascript
export const readData = () => { ... };
```

### 4. **Segurança**

#### ⚠️ JWT Secret Hardcoded
```javascript
const JWT_SECRET = "SenhaSuperSecreta";
```

**Recomendação:** Usar variável de ambiente:
```javascript
const JWT_SECRET = process.env.JWT_SECRET || "SenhaSuperSecreta";
```

#### ⚠️ GET de Usuários Não Protegido
A rota `GET /api/dados` (que lista todos os usuários) **NÃO está protegida**, mas deveria estar segundo o README.

### 5. **Tecnologia Não Utilizada**

#### ❌ UUID
O README sugere o uso de `uuid`, mas o projeto usa IDs incrementais:
```javascript
id: data.length ? data[data.length - 1].id + 1 : 1
```

**Nota:** Isso não é necessariamente um erro, mas diverge da sugestão.

### 6. **Problemas Menores**

#### ⚠️ Exposição de Senhas
Ao listar usuários (`GET /api/dados`), as senhas hasheadas são expostas:
```javascript
export const getAllDados = (req, res) => {
  const data = readData();
  res.json(data); // Retorna objetos com campo 'senha'
};
```

**Solução:** Remover campo senha antes de retornar:
```javascript
const sanitizedData = data.map(({ senha, ...user }) => user);
res.json(sanitizedData);
```

---

## 📋 Checklist de Conformidade

| Item | Status | Observação |
|------|--------|------------|
| POST /register | ❌ | Rota está como /api/dados |
| POST /login | ✅ | Implementado corretamente |
| GET /users | ❌ | Rota está como /api/dados e não está protegida |
| GET /users/:id | ⚠️ | Funciona mas rota incorreta |
| PUT /users/:id | ⚠️ | Funciona mas rota incorreta |
| DELETE /users/:id | ⚠️ | Funciona mas rota incorreta |
| JWT (1h) | ✅ | Implementado corretamente |
| bcryptjs | ✅ | Implementado corretamente |
| uuid | ❌ | Não utilizado |
| Estrutura de pastas | ⚠️ | Controller no singular, falta utils/ |
| Proteção de rotas | ⚠️ | Parcial - GET /users não protegido |

---

## 🔧 Correções Necessárias

### 1. **Ajustar Rotas (PRIORIDADE ALTA)**

**routes/users.js:**
```javascript
const users = express.Router();

users.post('/register', createDado);
users.get('/', authenticateToken, getAllDados); // Adicionar proteção
```

**routes/auth.js:**
```javascript
const auth = express.Router();

auth.post('/login', login);
```

**server.js:**
```javascript
app.use("/users", users);
app.use("/", auth); // Para /login
```

### 2. **Criar utils/db.js**

```javascript
import fs from 'fs';
import path from 'path';

const filePath = path.resolve('db.json');

export const readData = () => {
  if (!fs.existsSync(filePath)) return [];
  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
};

export const saveData = (data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};
```

### 3. **Proteger Rota GET /users**

```javascript
users.get('/', authenticateToken, getAllDados);
```

### 4. **Sanitizar Resposta de Usuários**

```javascript
export const getAllDados = (req, res) => {
  const data = readData();
  const sanitized = data.map(({ senha, ...user }) => user);
  res.json(sanitized);
};
```

---

## 📈 Sugestões de Melhoria

### 1. **Validação de Dados**
Adicionar validação de email e força de senha:
```javascript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  return res.status(400).json({ message: 'Email inválido' });
}
```

### 2. **Tratamento de Erros Global**
Criar middleware de erro:
```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erro interno do servidor' });
});
```

### 3. **Verificar Duplicação de Email**
```javascript
const emailExists = data.find(u => u.email === email);
if (emailExists) {
  return res.status(409).json({ message: 'Email já cadastrado' });
}
```

### 4. **Usar Variáveis de Ambiente**
Criar arquivo `.env`:
```
JWT_SECRET=seu_secret_super_seguro
PORT=3000
```

---

## 🎯 Conclusão

O projeto demonstra **boa compreensão dos conceitos fundamentais** de autenticação JWT e CRUD, mas precisa de ajustes para atender completamente às especificações do README.

### Principais Ações Requeridas:
1. ✅ Corrigir nomenclatura das rotas
2. ✅ Proteger rota GET /users
3. ✅ Criar estrutura utils/
4. ✅ Renomear pasta controller para controllers
5. ✅ Sanitizar dados de saída

### Pontuação Detalhada:
- **Funcionalidade:** 8/10
- **Conformidade com README:** 6/10
- **Segurança:** 7/10
- **Estrutura de Código:** 8/10
- **Boas Práticas:** 8/10

**Nota Final: 7.5/10** ⭐⭐⭐⭐

Com as correções sugeridas, o projeto pode facilmente alcançar **9/10**! 🚀
