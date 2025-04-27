import express from 'express';
import {
  summarizeMessage,
  translateMessage,
  suggestReply
} from '../controllers/groqController.js';

const router = express.Router();

// Route to summarize the conversation
router.post('/summarize', summarizeMessage);

// Route to translate a message
router.post('/translate', translateMessage);

// Route to suggest a reply to a message
router.post('/suggest-reply', suggestReply);

export default router;
