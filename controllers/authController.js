import User from "../models/user.js";
import { qb } from "@lakshya004/cosmos-odm";
import redis from "../utils/redisClient.js";
import otpQueue from "../queue/otpQueue.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Orders from "../models/order.js";
import { callModel } from "../utils/callModel.js";
import { success } from "zod";



export async function sendOtp(req, res) {
  try {
    const { name, email, password, confirm_password, role, company_name } = req.body;

    if (!email || !name || !password || !confirm_password || !role || !company_name) {
      return res.status(400).json({
        success:false,
        message: "Missing Fields",
      })
    }

    if (password !== confirm_password) {
      return res.status(400).json({
        success:false,
        message: "Password do not match"
                
      })
    }

    const query = qb().eq(User.fields.Email, email);
    const { resources } = await User.find({
      filter: query,
      limit: 1
    })

    const UserExist = resources.length > 0 ? resources[0] : null;

    if (UserExist && UserExist.Status === "verified") {
      return res.status(400).json({
        success:false,
        message: "User already Exists"
      })
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log(otp);

    const hashedPassword = await bcrypt.hash(password, 10);

    await redis.setex(`otp:${email}`, 600,
      JSON.stringify({
        name: name,
        company_name:company_name,
        password: hashedPassword,
        role:role,
        otp: otp,
        timestamp: Date.now()
      })
    )
    console.log("Stored in redis:", `otp:${email}`);

    await otpQueue.add("send-otp", { email, otp });

    console.log("OTP job added to the queue");

    return res.status(200)
      .json({
        success:true,
        message: 'Otp will be sent to your email shortly'
      })

  } catch (error) {

    console.log(error.stack);
    return res.status(500)
    .json({ 
      success:false,
      message: "Internal server error" });
      }

}
export async function verifyOtp(req, res) {
  try {

    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success:false,
        message: "Email and otp is required"
      })
    }

    const data = await redis.get(`otp:${email}`);
    console.log("Stored in redis:", `otp:${email}`);


    if (!data) {
      return res.status(400).json({
        success:false,
        message: "Otp not found or expired"
      })
    }

    const { otp: storedOtp, password: hashedPassword, name, role, company_name } = JSON.parse(data);

    const inputOtp = Number(otp);

    if (storedOtp !== inputOtp) {
      return res.status(400).json({
        success:false,
        message: "Invalid otp"
      })
    }

    const newUser = await User.insert({
      Email: email,
      Name:name,
      Company_Name:company_name,
      Password: hashedPassword,
      Status: "verified",
      Role:role
    });

    await redis.del(`otp:${email}`);

    const token = jwt.sign(
      {
        id: newUser.id,
        email: newUser.Email,
        role: newUser.Role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "10d",
      }

    )

    res.cookie(newUser.Role, token, {
      path:"/",
      sameSite:"none",
      httpOnly: true,
      secure: false,
      maxAge: 10 * 24 * 60 * 60 * 1000,
    });


    return res.status(201).json({
      success:true,
      message: "User registered and verified successfully",
      userId: newUser.id,
      UserRole:newUser.Role,
      token:token

    })



  } catch (error) {

    console.log(error.stack);
    return res.status(500).json({
      success:false,
      message: "Internal server error"
    })


  }
}


export async function login(req, res) {
  try {
    const { email, password,role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({
        success:false,
        message: "Invalid request"
      })
    }

    const query = qb().eq(User.fields.Email, email);
    const { resources } = await User.find({
      filter: query,
      limit: 1
    })

    const user = resources.length > 0 ? resources[0] : null;

    if (user.Status !== "verified") {
      return res.status(403).json({
        success:false,
        message: "User not verified. Please complete OTP verification.",
      })
    }

    const validPassword = await bcrypt.compare(password, user.Password);

    if (!validPassword) {
      return res.status(400).json({
        success:false,
        message: "Password do not match",
      })
    }


    const token = jwt.sign(
      {
        id: user.id,
        email: user.Email,
        role: role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "10d",
      }

    );

    res.cookie(user.Role, token, {
      httpOnly: true,
  path: "/",
  secure: true,
  sameSite: "none",
  //  domain: ".trycloudflare.com",
  maxAge: 60 * 60 * 24 * 7 * 1000, // 1 week
  // signed: true,
    });

    return res.status(200).json({
      success:true,
      message: "Login successful",
      UserId: user.id,
      UserRole:user.Role,
      token: token
    })

  } catch (error) {
    console.log(error.stack);
    return res.status(500)
    .json({ 
      success:false,
      message: "Internal server error" });

  }
}

export async function profileSetup(req, res) {
  try {

    // if(req.user.role !=="startup"){
    //   return res.status(403).json({ error: "Access denied: Only startups can complete profile" });
    // }

    const { Major_sector, Minor_sector, Series } = req.body;

    if (!Major_sector || !Minor_sector || !Series) {
      return res.status(400)
        .json({
          success:false,
          message: "Invalid Request"
        })
    }

    const UserId = req.user.id;

    if (!UserId) {
      console.log(error);
      return res.status(404)
      .json({
        success:false,
        message:"User not found"
      })
    }
    // console.log(UserId);
    // console.log(Major_sector);
    // console.log(Minor_sector);
    // console.log(Series);


    const response = await Orders.insert({
      userId: UserId,              
      Major_Sector: Major_sector,   
      Minor_Sector: Minor_sector,   
      Series: Series                
    });

    const model = await callModel({
      UserId,
      Major_sector,
      Minor_sector,
      Series
    })


    //console.log(response);

    return res.status(200).json({
      success:true,
      message: "Profile completed successfully",
      modelResponse: model,
      profile:response
    })


  } catch (error) {
    console.log(error.stack);
    return res.status(500)
      .json({
        success:false,
        message: "Internal Server Error"
      })

  }
}

// export async function getProfile(req,res){
//   const {userId}= req.query;

//   const query = qb().eq("userId",userId);

//    const response = await Orders.find({
//     filter:query,
//     limit:10
//    });

//    console.log(response);

//    return res.status(200).json({
//     success:true,
//     response
//    })
   
// }

