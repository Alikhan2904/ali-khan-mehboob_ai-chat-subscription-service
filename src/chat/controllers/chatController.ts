import express from "express";
import { chatService } from "../services/chatService";
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { userId, question } = req.body;
    const result = await chatService.askQuestion(userId, question);
    res.json(result);
  } catch (e: any) {
    res.status(e.statusCode || 500).json({ error: e.message });
  }
});

export default router;
