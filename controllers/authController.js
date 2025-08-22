import User from "../models/user.js";
import { qb } from "@lakshya004/cosmos-odm";
import redis from "../utils/redisClient.js";
import otpQueue from "../queue/otpQueue.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Orders from "../models/order.js";



export async function sendOtp(req, res) {
  try {
    const { name, email, password, confirm_password, role } = req.body;

    if (!email || !name || !password || !confirm_password || !role) {
      return res.status(400).json({
        error: "Missing Fields",
      })
    }

    if (password !== confirm_password) {
      return res.status(400).json({
        error: "Password do not match"
      })
    }

    const query = qb().eq("Email", email);
    const { resources } = await User.find({
      filter: query,
      limit: 1
    })

    const UserExist = resources.length > 0 ? resources[0] : null;

    if (UserExist && UserExist.Status === "verified") {
      return res.status(400).json({
        message: "User already Exists"
      })
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log(otp);

    const hashedPassword = await bcrypt.hash(password, 10);

    await redis.setex(`otp:${email}`, 600,
      JSON.stringify({
        name: name,
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
        message: 'Otp will be sent to your email shortly'
      })

  } catch (error) {

    console.log(error.stack);
    return res.status(500).json({ message: "Internal server error" });


  }

}
export async function verifyOtp(req, res) {
  try {

    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        error: "Email and otp is required"
      })
    }

    const data = await redis.get(`otp:${email}`);
    console.log("Stored in redis:", `otp:${email}`);


    if (!data) {
      return res.status(400).json({
        error: "Otp not found or expired"
      })
    }

    const { otp: storedOtp, password: hashedPassword, name, role } = JSON.parse(data);

    const inputOtp = Number(otp);

    if (storedOtp !== inputOtp) {
      return res.status(400).json({
        error: "Invalid otp"
      })
    }

    const newUser = await User.insert({
      Email: email,
      Company_Name: name,
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
      message: "User registered and verified successfully",
      userId: newUser.id
    })



  } catch (error) {

    console.log(error.stack);
    return res.status(500).json({
      error: "Internal server error"
    })


  }
}


export async function login(req, res) {
  try {
    const { email, password,role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({
        error: "Invalid request"
      })
    }

    const query = qb().eq("Email", email);
    const { resources } = await User.find({
      filter: query,
      limit: 1
    })

    const user = resources.length > 0 ? resources[0] : null;

    if (user.Status !== "verified") {
      return res.status(403).json({
        error: "User not verified. Please complete OTP verification.",
      })
    }

    const validPassword = await bcrypt.compare(password, user.Password);

    if (!validPassword) {
      return res.status(400).json({
        error: "Password do not match",
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
  domain: ".trycloudflare.com",
  maxAge: 60 * 60 * 24 * 7 * 1000, // 1 week
  // signed: true,
    });

    return res.status(200).json({
      message: "Login successful",
      UserId: user.id,
      UserRole:user.Role
    })

  } catch (error) {
    console.log(error.stack);
    return res.status(500).json({ message: "Internal server error" });

  }
}

export async function profile(req, res) {
  try {

    // if(req.user.role !=="startup"){
    //   return res.status(403).json({ error: "Access denied: Only startups can complete profile" });
    // }

    const { Major_sector, Minor_sector, Series } = req.body;

    if (!Major_sector || !Minor_sector || !Series) {
      return res.status(400)
        .json({
          error: "Invalid Request"
        })
    }

    const UserId = req.user.id;

    if (!UserId) {
      console.log(error);
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
      message: "Profile completed successfully",
      modelResponse: model,
      profile:response
    })


  } catch (error) {
    console.log(error.stack);
    return res.status(500)
      .json({
        error: "Internal Server Error"
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

