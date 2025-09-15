import User from "../models/user.js";
import { qb } from "@lakshya004/cosmos-odm";
import redis from "../utils/redisClient.js";
import otpQueue from "../queue/otpQueue.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Orders from "../models/order.js";
import { callModel } from "../utils/callModel.js";
import { success } from "zod";
import { errorResponse, successResponse } from "../utils/response.js";



export async function sendOtp(req, res) {
  try {
    const { name, email, password, confirm_password, role, company_name } = req.body;

    if (!email || !name || !password || !confirm_password || !role || !company_name) {
      return errorResponse(res, "Missing fields", 400);
    }

    if (password !== confirm_password) {
      return errorResponse(res, "Password not matched", 401);
    }

    const query = qb().eq(User.fields.Email, email);
    const { resources } = await User.find({
      filter: query,
      limit: 1
    })

    const UserExist = resources.length > 0 ? resources[0] : null;

    if (UserExist && UserExist.Status === "verified") {
      return errorResponse(res, "User already exist and verified", 409)
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
    
      return successResponse(res,{},"Otp will be sent to your email shortly")

  } catch (error) {

    console.log(error.stack);
    return errorResponse(res);

}
}
export async function verifyOtp(req, res) {
  try {

    const { email, otp } = req.body;

    if (!email || !otp) {
      return errorResponse(res, "Email and otp required", 400);
    }

    const data = await redis.get(`otp:${email}`);
    console.log("Stored in redis:", `otp:${email}`);


    if (!data) {
      return errorResponse(res, "Otp not found or expired", 404);
    }

    const { otp: storedOtp, password: hashedPassword, name, role, company_name } = JSON.parse(data);

    const inputOtp = Number(otp);

    if (storedOtp !== inputOtp) {
      return errorResponse(res, "Invalid otp", 401);
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

    return successResponse(res,{
      userId: newUser.id,
      UserRole:newUser.Role,
      token:token
    }, "User registered and verified successfully", 201);



  } catch (error) {

    console.log(error.stack);
    return errorResponse(res);
  }
}


export async function login(req, res) {
  try {
    const { email, password,role } = req.body;
    if (!email || !password || !role) {
      return errorResponse(res, "Invalid request", 400);
    }

    const query = qb().eq(User.fields.Email, email);
    const { resources:userData } = await User.find({
      filter: query,
      limit: 1
    })

    const user = userData.length > 0 ? userData[0] : null;

    if (user.Status !== "verified") {
      return errorResponse(res, "User status not verified", 403 )
    }

    const validPassword = await bcrypt.compare(password, user.Password);

    if (!validPassword) {
      return errorResponse(res, "Password do not match", 401);
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

    return successResponse(res,{ UserId: user.id,
      Name: userData[0].Name,
      UserRole:user.Role,
      token: token}, "Login successfull")

  } catch (error) {
    console.log(error.stack);
    return errorResponse(res);

  }
}

export async function profileSetup(req, res) {
  try {

    // if(req.user.role !=="startup"){
    //   return res.status(403).json({ error: "Access denied: Only startups can complete profile" });
    // }

    const { Major_Sector, Minor_Sector, Series } = req.body;

    if (!Major_Sector || !Minor_Sector || !Series) {
      return errorResponse(res, "Missing fields", 400);
    }

    const userId = req.user.id;

    // console.log(UserId);
    // console.log(Major_sector);
    // console.log(Minor_sector);
    // console.log(Series);


    const response = await Orders.insert({
      userId: userId,              
      Major_Sector: Major_Sector,   
      Minor_Sector: Minor_Sector,   
      Series: Series                
    });

    const model = await callModel({
      userId,
      Major_Sector,
      Minor_Sector,
      Series
    })


    //console.log(response);    

    return successResponse(res,{
      modelResponse: model,
      profile:response

    }, "Profile completed successfully")


  } catch (error) {
    console.log(error.stack);
    return errorResponse(res);

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

