import express from 'express'
import Conversation from '../models/Conversation.js'
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();


router.post("/", async (req, res) => {
    const newConversation = new Conversation({
      members: [req.body.senderId, req.body.receiverId],
    });
  
    try {
      await newConversation.save();
      const allConversations = await Conversation.find()
      res.status(200).json(allConversations);
    } catch (err) {
      res.status(500).json(err);
    }
  });

router.get("/byconvo/:conversationId" , verifyToken , async (req , res) => {
  try {
    const conversation = await Conversation.findById(req.params.conversationId);
    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json(error)
  }
})

router.get("/:userId", verifyToken , async (req, res) => {
    try {
      const conversation = await Conversation.find({
        members: { $in: [req.params.userId] },
      });
      res.status(200).json(conversation);
    } catch (err) {
      res.status(500).json(err);
    }
  });

router.get("/find/:firstUserId/:secondUserId", verifyToken , async (req, res) => {
    try {
      const conversation = await Conversation.findOne({
        members: { $all: [req.params.firstUserId, req.params.secondUserId] },
      });
      res.status(200).json(conversation)
    } catch (err) {
      res.status(500).json(err);
    }
  });

  export default router