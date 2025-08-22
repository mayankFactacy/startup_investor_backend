// const { z } = require("zod");

// const BaseUserSchema = z
//   .object({
//     id: z
//     .string("Id required"),

//     email: z
//     .string("Email is required")
//     .trim()
//     .email("Invalid Email"),

//     createdAt: z
//     .string(),

//     updatedAt: z
//     .string(),

//     status: z
//     .enum(["pending", "verified", "expired"]).default("pending"),
//   });

// const GoogleUserSchema = BaseUserSchema.extend({
//   googleId: z
//   .string(),

//   firstName: z
//   .string("First name is required")
//   .trim()
//   .min(1,"First name is required")
//   .default(""),

//   lastName: z
//   .string("Last name is required")
//   .trim()
//   .default(""),

//   token: z
//   .string("Token is required")
//   .trim()
//   .min(1,"Token is required"),

//   password: z
//   .string("Password is required")
//   .trim()
//   .min(6, "Password of atleast 5 characters required"),

//   otp: z
//   .string("Otp is required")
//   .length(6),
  
//   otpCreatedAt: z.string().optional()
// });

// const OTPUserSchema = BaseUserSchema.extend({
//   otp: z.string().length(6),
//   otpCreatedAt: z.string(),
// });

// module.exports = {
//   BaseUserSchema,
//   GoogleUserSchema,
//   OTPUserSchema
// };
