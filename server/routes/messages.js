import express from 'express'
import Message from '../models/Message.js'
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post("/" , async (req , res) => {
    const newMessage = new Message({
        conversationId : req.body.conversationId,
        sender : req.body.sender,
        text : req.body.text
    });

    try {
        await newMessage.save();
        const allMessages = await Message.find();
        res.status(200).json(allMessages)
    } catch (error) {
        res.status(500).json(error)
    }
})

router.get("/:conversationId" , verifyToken , async (req , res) => {
    try {
        const messages = await Message.find({
            conversationId : req.params.conversationId
        })
    
        res.status(200).json(messages)
    } catch (error) {
        res.status(500).json(error)
    }
})

export default router;