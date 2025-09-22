import express from "express"
import { users } from "./routes/users.js";
import { auth } from './routes/auth.js'
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));


app.use("/api/dados", users);
app.use("/api/dados", auth);


app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});