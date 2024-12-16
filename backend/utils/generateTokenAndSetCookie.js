import jwt from "jsonwebtoken"
export const generateTokenAndSetCookie = (res, userId) => {

    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" },)


    res.cookie("token", token, {

        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 24 * 60 * 60 * 1000, //15days


    })
    return token

}