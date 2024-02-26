import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    conversationId : {
        type : String,
    },
    sender : {
        type : String
    },
    text : {
        type : String
    }
} , {timestamps : true})

const Message = new mongoose.model("Message" , MessageSchema);

export default Message;