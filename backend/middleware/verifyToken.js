import jwt from "jsonwebtoken"


export const verifyToken = (req, res, next) => {
    const token = req.cookies.token

    if (!token) {

        return res.status(400).json({ success: false, message: "unauthorised - no- token provided" })

    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (!decoded) return res.status(401).json({ success: false, message: "Unauthorised, invalid token" })
        req.userId = decoded.userId
        next()



    } catch (error) {
        console.log("Error in verifying token ", error)
        return res.status(500).json({ success: false, message: "Server Error" })
    }


}