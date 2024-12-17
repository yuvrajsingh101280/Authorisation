import { VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE } from "./emailTemplate.js"
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
export const sendWelcomeEmail = async (email, name) => {
    const recipient = [{ email }]


    try {
        const response = await mailtrapClient.send({

            from: sender,
            to: recipient,
            template_uuid: "8926f517-1642-48b6-abd6-9061db0859f4",
            template_variables: {
                "company_info_name": "Dream Forge",
                "name": name
            }
        })
        console.log("Welcome Email sent successfully")
    } catch (error) {

        console.log("Error sending email", error)


    }



}
export const sendPasswordResetEmail = async (email, resetURL) => {


    const recipient = [{ email }]



    try {

        const response = await mailtrapClient.send({

            from: sender,
            to: recipient,
            subject: "Reset your password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
            category: "password reset"

        })


    } catch (error) {
        console.log("Error sending email", error)

    }


}
export const sendRestSuccessEmail = async (email) => {

    const recipient = [{ email }]
    try {
        const response = await mailtrapClient.send({

            from: sender,
            to: recipient,
            subject: "Password Reset Successfull",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Password reset"

        })

        console.log("password reset email sent succeffully", response)
    } catch (error) {
        console.log("Error sending reset password email", error)
    }

}