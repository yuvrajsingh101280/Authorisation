import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplate.js"
import { mailtrapClient, sender } from "./mailtrap.config.js"

export const sendVerificationEmail = async (email, verificationToken) => {

    const recipient = [{ email }]



    try {

        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Verify Your Email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email verification"
        })
        console.log("Email Sent successfully")

    } catch (error) {
        console.log(error)
        throw new Error(`Error sending verification email :${error}`)
    }


}