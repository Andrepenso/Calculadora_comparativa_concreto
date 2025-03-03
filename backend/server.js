const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path"); // 🔹 Importação do `path`
require("dotenv").config();

const equipamentoRoutes = require("./routes/equipamentoRoutes");
const tracoRoutes = require("./routes/tracoRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// 📌 Middlewares globais
app.use(express.json());
app.use(cors());

// 📂 Servir imagens estáticas
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 📌 Conectar ao MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Atlas conectado com sucesso!"))
  .catch((err) => console.error("❌ Erro ao conectar ao MongoDB:", err));

// 📌 Registrar as rotas
app.use("/api/auth", authRoutes);
app.use("/api/equipamentos", equipamentoRoutes);
app.use("/api/tracos", tracoRoutes);

// 📌 Criar admin automaticamente
const User = require("./models/User");

const criarUsuarioAdmin = async () => {
  try {
    console.log("🔹 Verificando usuário admin...");
    await User.deleteOne({ username: "admin" });

    const novoAdmin = new User({ username: "admin", password: "admin" });
    await novoAdmin.save();

    console.log("✅ Usuário admin recriado com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao criar admin:", error);
  }
};
criarUsuarioAdmin();

// 📌 Iniciar o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
