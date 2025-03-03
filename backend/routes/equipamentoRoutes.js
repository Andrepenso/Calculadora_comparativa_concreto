const express = require("express");
const multer = require("multer");
const Equipamento = require("../models/Equipamento");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// 📂 Configuração do Multer para armazenar imagens
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Salva os arquivos na pasta 'uploads'
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Define um nome único
  },
});

const upload = multer({ storage });

// 📌 Criar um novo equipamento com upload de imagem
router.post("/", authMiddleware, upload.single("imagem"), async (req, res) => {
  try {
    console.log("Recebendo requisição para criar equipamento:", req.body);

    const novoEquipamento = new Equipamento({
      ...req.body,
      imagem: req.file ? `/uploads/${req.file.filename}` : null, // Armazena o caminho da imagem
    });

    await novoEquipamento.save();
    res.status(201).json(novoEquipamento);
  } catch (error) {
    console.error("Erro ao criar equipamento:", error);
    res.status(500).json({ error: "Erro interno ao criar equipamento" });
  }
});

// 📌 Listar todos os equipamentos
router.get("/", async (req, res) => {
  try {
    const equipamentos = await Equipamento.find();
    res.json(equipamentos);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar equipamentos" });
  }
});

// 📌 Editar um equipamento por ID
router.put("/:id", authMiddleware, upload.single("imagem"), async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.imagem = `/uploads/${req.file.filename}`; // Atualiza a imagem se for enviada
    }

    const equipamento = await Equipamento.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(equipamento);
  } catch (error) {
    res.status(500).json({ error: "Erro ao editar equipamento" });
  }
});

// 📌 Deletar um equipamento por ID
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Equipamento.findByIdAndDelete(req.params.id);
    res.json({ message: "Equipamento deletado!" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar equipamento" });
  }
});

// Servir imagens estáticas
router.use("/uploads", express.static("uploads"));

module.exports = router;
