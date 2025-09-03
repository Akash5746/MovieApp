// import { Request, Response } from "express";
// import { customSuccesshandler } from "../utils/successHandler";
// import { customErrorHandler } from "../utils/errorHandler";
// import {
//   fetchUserByEmail,
//   fetchUserById,
//   fetchUserByMobileNumber,
//   onboardNewUser,
//   updateUserDetails,
// } from "../controllerUtils/user.controllerUtils";

// import { createGroupConnection } from "../controllerUtils/userConnection.controllerUtils";
// import { hashPassword } from "../utils/bcrypt.utils";
// import {
//   fetchAllSpecialities,
//   fetchCountries,
//   fetchSpecialityByName,
// } from "../controllerUtils/miscellaneous.controllerUtils";
// import {
//   sendWelcomeEmail,
//   generateTemporaryPassword,
// } from "../utils/onesignal-email.util";

// interface Country {
//   id: number;
//   name: string;
//   phone_code?: string;
// }

// export const onboardUser = async (req: Request, res: Response) => {
//   try {
//     const { firstName, lastName, email, mobile, speciality, country } =
//       req.body;

//     // finding country details from JSON
//     const countries: Country[] = await fetchCountries();
//     const countryData = countries.find(
//       (c: Country) =>
//         c.name.toLowerCase().trim() === country.toLowerCase().trim()
//     );

//     if (!countryData) {
//       return customErrorHandler(res, 404, "Country not found");
//     }

//     // getting dial code without "\r, \n, +"
//     const dialCode = (countryData.phone_code ?? "")
//       .replace(/\r?\n|\r/g, "")
//       .replace(/\+/g, "")
//       .trim();

//     // stripping dial code from mobile
//     let localMobile = mobile;
//     if (localMobile.startsWith(dialCode)) {
//       localMobile = localMobile.slice(dialCode.length);
//     }

//     // Check if user exists with this email or mobile number
//     const emailExists = await fetchUserByEmail(email);
//     const mobileExists = await fetchUserByMobileNumber(dialCode, localMobile);

//     if (emailExists || mobileExists) {
//       // User already exists - send welcome back email (no password)
//       const existingUser = emailExists || mobileExists;
//       const fullName =
//         `${existingUser.first_name || ""} ${existingUser.last_name || ""}`.trim() ||
//         "there";

//       try {
//         await sendWelcomeEmail({
//           to: email,
//           subject: "Welcome Back to Surgeons Masterclass!",
//           templateData: {
//             name: fullName,
//             email: email,
//           },
//           isExistingUser: true,
//         });

//         return customSuccesshandler(
//           res,
//           200,
//           "Welcome back email sent successfully",
//           {
//             message: "User already exists, welcome back email sent",
//             userId: existingUser.id,
//             isExistingUser: true,
//           }
//         );
//       } catch (emailError) {
//         console.error("Error sending welcome back email:", emailError);
//         // Still return success but log the email error
//         return customSuccesshandler(res, 200, "User already exists", {
//           message: "User already exists, but failed to send welcome back email",
//           userId: existingUser.id,
//           isExistingUser: true,
//           emailError: "Failed to send welcome back email",
//         });
//       }
//     }

//     // User doesn't exist - create new user with temporary password
//     const temporaryPassword = generateTemporaryPassword(10);
//     const hashedPassword = await hashPassword(temporaryPassword);

//     // creating new user
//     const newUser = await onboardNewUser(
//       firstName,
//       lastName,
//       email,
//       localMobile,
//       dialCode,
//       hashedPassword
//     );

//     if (!newUser) {
//       return customErrorHandler(res, 500, "Error while creating user");
//     }

//     // Send welcome email with temporary password
//     try {
//       await sendWelcomeEmail({
//         to: email,
//         subject: "Welcome to Surgeons Masterclass - Your Account Details",
//         templateData: {
//           name: `${firstName} ${lastName}`.trim(),
//           email: email,
//           password: temporaryPassword,
//         },
//         isExistingUser: false,
//       });
//     } catch (emailError) {
//       console.error("Error sending welcome email:", emailError);
//       // Log error but continue with user creation
//       // You might want to handle this differently based on your requirements
//     }

//     // onboarding step 2
//     // creating user group connection using specility IDs & updating profile points
//     // to fetch the speciality ID from `speciality` table.
//     const specialityData = await fetchSpecialityByName(speciality);
//     if (specialityData) {
//       await createGroupConnection(
//         specialityData.id,
//         Number(newUser.id),
//         "additional_speciality"
//       );
//     }
//     await updateUserDetails(newUser.id, {
//       profilePoints: newUser.profilePoints + (specialityData ? 10 : 0),
//     });

//     // can't do step 3 as we don't get the city of practice from google sheet

//     return customSuccesshandler(res, 200, "User onboarded successfully", {
//       password: temporaryPassword,
//       userId: newUser.id,
//       mobile: newUser.mobile_number,
//       countryCode: newUser.country_code,
//       email: newUser.email,
//       createdAt: newUser.created_date,
//       isExistingUser: false,
//       welcomeEmailSent: true,
//     });
//   } catch (error) {
//     if (error instanceof Error) {
//       console.log("Error in onboard-user API", error);
//       return customErrorHandler(res, 500, error.message, error);
//     }
//   }
// };
