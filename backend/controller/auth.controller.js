
import { User } from "../models/user.model.js"
import bcrypt from "bcryptjs"
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js"
import { sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/email.js"
export const signup = async (req, res) => {

    const { email, password, name } = req.body
    try {

        // validation

        if (!email || !password || !name) {
            return res.status(400).json({ success: false, message: "All fields are required" })

        }
        const userAlreadyExist = await User.findOne({ email })


        if (userAlreadyExist) {
            return res.status(400).json({ success: false, message: "user already exist" })

        }
        const salt = 10
        const hashedPassword = await bcrypt.hash(password, salt)
        // verification code

        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString()
        // creating a user
        const user = new User({

            email, name, password: hashedPassword, verificationToken, verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000 //24 hours

        })
        // save the user in the databse
        await user.save()

        // jwt

        generateTokenAndSetCookie(res, user._id)


        // send email

        await sendVerificationEmail(user.email, verificationToken)

        res.status(201).json({
            success: true,
            message: "User created succefully",
            user: {

                ...user._doc, password: undefined
            }
        })

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }

}
export const verifyEmail = async (req, res) => {

    const { code } = req.body

    try {



        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() }
        })

        if (!user) {

            return res.status(400).json({ success: false, message: "Invalid or expired verification code" })
        }
        user.isVerified = true
        user.verificationToken = undefined
        user.verificationTokenExpiresAt = undefined

        await user.save()

        await sendWelcomeEmail(user.email, user.name)
        res.status(200).json({
            suceess: true, message: "email verified successfully", user: {

                ...user._doc, password: undefined,
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Error in verification" })
    }

}
export const login = async (req, res) => {
    const { email, password } = req.body
    try {
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        const user = await User.findOne({ email })
        if (!user) {


            return res.status(400).json({ success: false, message: "Invalid credential or invalid email or password" })

        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {


            return res.status(400).json({ success: false, message: "Wrong password" })


        }

        generateTokenAndSetCookie(res, user._id)
        user.lastLogin = new Date()
        await user.save()

        return res.status(200).json({
            success: true, message: "User Logged in successfully",

            user: {

                ...user._doc,
                password: undefined
            }
        })






    } catch (error) {
        console.log("Error in loggin", error)
    }

}
export const logout = async (req, res) => {

    res.clearCookie("token")
    res.status(200).json({ success: true, message: "Logged Out Successfully" })

}
export const forgotPassword = async (req, res) => {




}