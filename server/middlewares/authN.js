const { customError } = require('../utils/errorHandler');
const jwt = require('jsonwebtoken')

exports.authN = async (req, res, next) => {
    try {
        //  Fetch Token
        const token = req.cookies.token
            || req.body.token
            || req.header("Authorization")?.replace("Bearer ", "");

        //  Validate Token
        if (!token) {
            throw customError('Token Not Found', 404);
        }

        //  Verify Token
        try {
            const check = jwt.verify(token, process.env.JWT_SECRET_KEY);
            req.user = check;
        } catch (err) {
            throw customError('Invalid Token', 400);
        }

        //  Move Forward
        next();
    }
    catch (err) {
        res.status(err.code ? err.code : 500).json({
            success: false,
            message: err.message,
        })
    }
}