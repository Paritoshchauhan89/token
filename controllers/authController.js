import userModel from "../models/userModel.js";
import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import JWT from 'jsonwebtoken';

// register
export const registercontroller = async(req,res)=>{


    try {
        const {name, email,password} = req.body 
        // validations
        if(!name){
            return res.send({error:'Name is Required'})
        }
        if(!email){
            return res.send({error:'Email is Required'})
        }
        if(!password){
            return res.send({error:'Password is Required'})
        }
        // check user
        const exisitingUser = await userModel.findOne({email})
       // exisiting user
 if (exisitingUser){
    return res.status(200).send({
        success:true,
        message:'Already Register please login',
    })
 }
//  register  user
const hashedPassword = await hashPassword(password)
// save
const user = await  new userModel({name,email,password:hashedPassword}).save()
res.status(201).send({
    success:true,
    message:"User Register Successfully",
    user,
});

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in Registration',
            error
        })
        
    }

};

// login

export const logincontroller = async(req,res)=>{

    try {
        const {email,password} = req.body
        // validations
        if(!email || !password){
            return res.status(404).send({
                success:false,
                message:'Invalid email or password'
            })
        }
        // check user
        const user = await userModel.findOne({email})
        if(!user){
            return res.status(404).send({
                success:false,
                message:'Email is not registered'
            })
        }
        const match = await comparePassword(password,user.password)
        if(!match){
            return res.status(200).send({
                success:false,
                message:'Invalid Password'
            })
        }
        // token
        const token = await JWT.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:"7d",});
        res.status(200).send({
            success:true,
            message:'login successfully',
            user:{
                name:user.name,
                email:user.email,
            },
            token,
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in login',
            error
        })
        
    }

};




// test controller
export const testcontroller = (req,res)=>{
    res.send("Protected Routes");
};


// admin access

export const isAdmin = async(req,res,next) =>{
    try {
        const user =  await userModel.findById(req.user._id)
        if(user.role !==1){
            return res.status(401).send({
                success:false,
                message:'Error in isAdmin middleware',
                error,
            });
        }else{
            next();
        }
    } catch (error) {
        console.log(error)
        
    }
}

// All users
export const getAllUsers = async (req,res)=>{


    try {
        const users = await userModel.find({})
        return res.status(200).send({
            userCount:users.length,
            success:true,
            message:'all users data',
            users,
        });
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success:false,
            message:"Error in get All users",
            error,
        })
        
    }
};


export const getUserByIdController =async(req,res)=>{
    try {
        const {id} = req.params;
        const user = await userModel.findById(id)
        if(!user){
            return res.status(404).send({
                success:false,
                message:'user not found with this is ',

            });
        }
        return res.status(200).send({
            success:true,
            message:'fetch single user',
            user,
        });
    } catch (error) {
        console.log(error)
        return res.status(400).send({
            success:false,
            message:'error while getting single user',
            error,
        });
        
    }
};

export const updateUserController = async (req, res) => {
    try {
      const userId = req.params.id;
      const { name, email, password } = req.body;
  
      // Validate if at least one field to update is provided
      if (!name && !email && !password) {
        return res.status(400).send({
          success: false,
          message: "At least one field (name, email, or password) is required for update.",
        });
      }
  
      // Find the user by ID
      const user = await userModel.findById(userId);
  
      // Check if the user exists
      if (!user) {
        return res.status(404).send({
          success: false,
          message: "User not found",
        });
      }
  
      // Update user fields if provided
      if (name) {
        user.name = name;
      }
  
      if (email) {
        user.email = email;
      }
  
      if (password) {
        const hashedPassword = await hashPassword(password);
        user.password = hashedPassword;
      }
  
      // Save the updated user
      await user.save();
  
      return res.status(200).send({
        success: true,
        message: "User updated successfully",
        user,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        success: false,
        message: "Error while updating user",
        error,
      });
    }
  };
  

export const deleteUserController = async (req, res) => {
    try {
      const user = await userModel.findByIdAndDelete(req.params.id);
      
      // Check if the user exists
      if (!user) {
        return res.status(404).send({
          success: false,
          message: "User not found",
        });
      }
  
      // If the user has a reference to another user
      if (user.user) {
        // Remove the user from the referenced user's 'users' array
        await userModel.findByIdAndUpdate(user.user, {
          $pull: { users: user._id },
        });
      }
  
      return res.status(200).send({
        success: true,
        message: "User Deleted!",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        success: false,
        message: "Error while deleting user",
        error,
      });
    }
  };
  