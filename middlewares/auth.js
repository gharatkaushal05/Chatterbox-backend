import { ErrorHandler } from "../utils/utility.js";
import { TryCatch } from "./error.js";
import jwt from "jsonwebtoken";

const isAuthenticated = TryCatch((req, res, next) => {
    const token = req.cookies["chatterbox-token"];
    
    if (!token) {
        return next(new ErrorHandler("Please login to access this route", 401)); // Use 401 status code
    }

    try {
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedData._id;
        next();
    } catch (error) {
        return next(new ErrorHandler("Invalid token, please login again", 401)); // Handle invalid token
    }
});

export { isAuthenticated };
