import mongoose, { mongo } from "mongoose";

const ConversationSchema = new mongoose.Schema({
    members : {
        type : Array
    }
} , {timestamps : true})

const Conversation = new mongoose.model("Conversation" , ConversationSchema);

export default Conversation;