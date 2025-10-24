import jwt from 'jsonwebtoken';


//Function to genrrate a token for a user 
export const genrateToken=(userId)=>{
    const token=jwt.sign({userId},process.env.JWT_SECRET)
    return token;
}