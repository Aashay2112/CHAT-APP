import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";
import { io,userSocketMap} from "../server.js";

//get all the user exxcept logged in user 
export const getUsersForSidebar=async(req,res)=>{
    try{
        const userId=req.user._id;
        const filteredUser=await User.find({_id:{$ne:userId}}).select("-password");


        //count number of msg not seen

        const unseenMessages={ }
        const promises=filteredUser.map(async(user)=>{
            const messages=await Message.find({senderId:user._id,recieverId:userId,seen:false})
            if(messages.length>0){
                unseenMessages[user._id]=messages.length;
            }
        })
        await Promise.all(promises);
        res.json({success:true,users:filteredUser,unseenMessages})
    }catch(error){
        console.log(error.message);
        res.json({
            success:false,message:error.message
        })
    }
}

//get all message for selected user 

export const getMessage=async(req,res)=>{
    try{
        const {id:selectedUserId}=req.params;
        const myId=req.user._id;

        const messages=await Message.find({$or:[
            {senderId:myId,recieverId:selectedUserId},
            {senderId:selectedUserId,recieverId:myId}
        ]})
        await Message.updateMany({senderId:selectedUserId,recieverId:myId},{seen:true})
        res.json({success:true,messages})

    }catch(error){
        console.log(error.message);
        res.json({
            success:false,message:error.message
        })
    }
}

//api to mark message as seen using message id 

export const markMessageSeen=async(req,res)=>{
    try{
        const{id}=req.params;
        await Message.findOneAndUpdate(id,{seen:true})
        res.json({success:true})

    }catch(error){
        console.log(error.message);
        res.json({
            success:false,message:error.message
        })
    }
}

//send message to selected user 

export const sendMessage=async(req,res)=>{
    try{

        const {text,image}=req.body;
        const recieverId=req.params.id;
        const senderId=req.user._id;

        let imageUrl;
        if(image){
            const uploadResponse=await cloudinary.uploader.upload(image)
            imageUrl=uploadResponse.secure_url;
        }

        const newMessage= await Message.create({
            senderId,
            recieverId,
            text,
            image:imageUrl
        })
        
        //emit the new message to the reciever socket id 
        const recieverSocketId=userSocketMap[recieverId]
        if(recieverId){
            io.to(recieverSocketId).emit("newMessage",newMessage)
        }

        res.json({
            success:true,newMessage
        })
        
    }catch(error){
        console.log(error.message);
        res.json({
            success:false,message:error.message
        })
    }
}

