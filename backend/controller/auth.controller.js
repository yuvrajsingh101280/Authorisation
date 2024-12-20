
import crypto from "crypto"
import bcrypt from "bcryptjs"
import { User } from "../models/user.model.js"
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js"
import { sendPasswordResetEmail, sendRestSuccessEmail, sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/email.js"
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
    const { email } = req.body
    try {



        const user = await User.findOne({ email })

        if (!user) {

            return res.status(400).json({ success: false, message: "User not found" })
        }
        // generate Reset Token

        const resetToken = crypto.randomBytes(20).toString("hex")
        const resetTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000 //24 hours

        user.resetPasswordToken = resetToken
        user.resetPasswordExpiresAt = resetTokenExpiresAt


        await user.save()

        // send email
        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`)
        return res.status(200).json({ success: true, message: "Password reset link sent to your email" })

    } catch (error) {
        console.log(error)
        res.status(400).json({ success: false, message: error.message })

    }



}
export const resetPassword = async (req, res) => {

    try {
        const { token } = req.params
        const { password } = req.body

        const user = await User.findOne({

            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() }

        })
        if (!user) {

            return res.status(400).json({ success: false, message: "User not found" })
        }


        // update the password
        const hashedPassword = await bcrypt.hash(password, 10)
        user.password = hashedPassword

        user.resetPasswordToken = undefined
        user.resetPasswordExpiresAt = undefined
        await user.save()


        await sendRestSuccessEmail(user.email)

        return res.status(200).json({ success: true, message: "Password reset successfully" })

    } catch (error) {
        console.log(error.message)

    }

}
export const checkAuth = async (req, res) => {

    try {



        const user = await User.findById(req.userId)
        if (!user) {

            return res.status(400).json({ success: false, message: "User not found" })
        }
        res.status(200).json({
            success: true, user: {

                ...user._doc,
                password: undefined
            }
        })

    } catch (error) {


        console.log("Error in checkAuth", error)

    }

}