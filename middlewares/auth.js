import { ErrorHandler } from "../utils/utility.js";
import { TryCatch } from "./error.js";
import jwt from "jsonwebtoken";
import { adminSecretKey } from "../app.js";

const isAuthenticated = TryCatch ((req, res, next) => {
    const token = req.cookies["chatterbox-token"];
    if(!token)
        return next (new ErrorHandler ("Please login to access this route", 401));

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedData._id;
    next()
})

const adminOnly = TryCatch ((req, res, next) => {
    const token = req.cookies["chatterbox-admin-token"];
    if(!token)
        return next (new ErrorHandler ("Only admin can access this route", 401));

    const secretKey = jwt.verify(token, process.env.JWT_SECRET);
    const isMatched = secretKey === adminSecretKey;

    if(!isMatched) return next (new ErrorHandler ("Invalid Admin Key", 401))
    next()
})




export { isAuthenticated , adminOnly};
