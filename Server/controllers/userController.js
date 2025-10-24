import cloudinary from "../lib/cloudinary.js";
import { genrateToken } from "../lib/utils.js";
import User from "../models/User.js"
import bcrypt from "bcryptjs"

//SignUp anew user 
export const signup = async(req,res)=>{
    const{fullName,email,password,bio}=req.body;

    try{
        if(!fullName||!email||!password||!bio){
            return res.json({
                success:false,
                message:"missing details"
            })
        }
        const user= await User.findOne({email});
        if(user){
            return res.json({
                success:false,
                message:"Account already exists"
            })
        }
        const salt=await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(password,salt);

        const newUser=await User.create({
            fullName,email,password:hashedPassword,bio
        });
        
        const token= genrateToken(newUser._id);
        res.json({
            success:true,
            userData:newUser,token,message:"Account created successfully"
        })

    }catch(error){
        console.log(error.message)
        return res.json({
                success:false,
                message:error.message
            })
    }
}


//controller to login a user 
export const Login=async(req,res)=>{
    try{
    const{email,password}=req.body;
    const userData=await User.findOne({email});

    const isPasswordCorrect= await bcrypt.compare(password,userData.password);
    if(!isPasswordCorrect){
         return res.json({
                success:false,
                message:"Invalid credentials"
            })
    }
   const token= genrateToken(userData._id);
    res.json({
            success:true,
            userData,token,message:"Login successful"
        })
    

    }catch(error){
        console.log(error.message)
        return res.json({
                success:false,
                message:error.message
            })
    }
}

//controller to check if user is authencticated

export const checkAuth=(req,res)=>{
    res.json({
        success:true,
        user:req.user
    })
}

//controller to update user profile details 
export const updateProfile = async (req, res) => {
  try {
    const { profilePic, bio, fullName } = req.body;
    const userId = req.user._id;

    console.log("🟢 Received update request for user:", userId);
    console.log("🟡 Received profilePic length:", profilePic?.length);

    let updatedUser;

    if (profilePic && profilePic.startsWith("data:image")) {
      console.log("🟣 Uploading image to Cloudinary...");
      const uploadResponse = await cloudinary.uploader.upload(profilePic, {
        folder: "chatApp/profilePics",
      });
      console.log("✅ Cloudinary upload success:", uploadResponse.secure_url);

      updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          profilePic: uploadResponse.secure_url,
          bio,
          fullName,
        },
        { new: true }
      );
    } else {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { bio, fullName },
        { new: true }
      );
    }

    console.log("✅ Updated user:", updatedUser);

    res.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error("❌ updateProfile error:", error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};
