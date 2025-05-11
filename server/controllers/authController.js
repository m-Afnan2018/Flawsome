const Token = require("../models/Token");
const User = require("../models/User");
const bcrypt = require('bcrypt')
const { failed, customError } = require("../utils/errorHandler");
const mailSender = require("../utils/mailSender");
const speakeasy = require('speakeasy');
const verifyMail = require("../mails/verify");
const resetMail = require("../mails/reset");
const OTP = require("../models/OTP");

const getVerifyLink = async (req, res) => {
    try {
        //  Fetching
        const { id } = req.user;

        //  Validation
        const user = await User.findById(id);
        if (user.isVerified) {
            throw customError("You are already verified", 400);
        }
        const already = await Token.findOne({ user: user._id, type: "verification" });
        if (already) {
            await mailSender(user.email, 'Flawsome - Verify your account', verifyMail(user.fullname, already.token));
            return res.status(200).json({
                success: true,
                message: 'New link sent'
            })
        }

        //  Perform task
        const token = await require('crypto').randomBytes(20).toString("hex");
        const tokenObj = new Token({
            token,
            user: id,
            type: "verification",
            expirationDate: new Date(Date.now() + (15 * 60 * 1000)),
        })
        await tokenObj.save()

        await mailSender(user.email, 'Flawsome - Verify your account', verifyMail(user.fullname, token));

        //  Send response 
        res.status(200).json({
            success: true,
            message: "Verification link sent successfully",
        })
    } catch (err) {
        failed(res, err);
    }
}

const verify = async (req, res) => {
    try {
        //  Fetching
        const { token } = req.body;

        //  Validation
        const find = await Token.findOne({ token, type: 'verification' });
        if (!find) {
            throw customError("Unauthorized access", 404);
        }

        //  Perform Task
        const userId = find.user;
        await User.findByIdAndUpdate(userId, { isVerified: true });

        //  Send response
        res.status(200).json({
            success: true,
            message: "User successfully verified",
        })
    } catch (err) {
        failed(res, err);
    }
}

const getResetPasswordLink = async (req, res) => {
    try {
        //  Fetching
        const { email } = req.body;

        //  Validation
        if (!email) {
            throw customError("Unable to get the email", 401);
        }
        const user = await User.findOne({ email: email });
        if (!user) {
            throw customError("Unable to find the user", 401);
        }
        const already = await Token.findOne({ user: user._id, type: "reset" });
        if (already) {
            mailSender(user.email, 'Flawsome - Reset your password', resetMail(user.fullname, already.token));
            return res.status(200).json({
                success: true,
                message: 'New link sent'
            })
        }

        //  Perform task
        const token = await require('crypto').randomBytes(20).toString("hex");
        const tokenObj = new Token({
            token,
            user: user._id,
            type: "reset",
            expirationDate: new Date(Date.now() + (15 * 60 * 1000)),
        })
        await tokenObj.save()
        mailSender(user.email, 'Flawsome - Reset your password', resetMail(user.fullname, token));

        //  Send response 
        res.status(200).json({
            success: true,
            message: "Reset Password link sent successfully",
        })
    } catch (err) {
        failed(res, err);
    }
}

const resetPassword = async (req, res) => {
    try {
        //  Fetching
        const { token, password } = req.body;

        //  Validation
        if (!password) {
            throw customError("Password field is required", 401);
        }
        if (password.length < 8) {
            throw customError("Password is too short", 401);
        }
        const find = await Token.findOne({ token, type: 'reset' });
        if (!find) {
            throw customError("Unauthorized access", 404);
        }

        //  Perform Task
        const hashPassword = await bcrypt.hash(password, 10);
        const userId = find.user;
        await User.findByIdAndUpdate(userId, { password: hashPassword });
        await Token.findByIdAndDelete(find._id)

        //  Send response
        res.status(200).json({
            success: true,
            message: "Password changed successfully",
        })
    } catch (err) {
        failed(res, err);
    }
}

const sendOTP = async (req, res) => {
    try {
        //  Fetch Data
        const { email, phone } = req.body;
        //  Validation
        if (!email && !phone) {
            throw customError('Either phone number or email Id required', 400);
        }

        // if(phone){
        //     throw customError('Phone OTP is not currently available');
        // }

        if (email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                throw customError('User Already Registered')
            }
        }
        if (phone) {
            const existingUser = await User.findOne({ phone });
            if (existingUser) {
                throw customError('User Already Registered')
            }
        }

        //  Generate OTP
        const otp = (() => {
            return Math.floor(100000 + Math.random() * 900000).toString();
        })()

        let createOTP;
        if (email) {
            createOTP = new OTP({
                otp, email
            })
        }
        if (phone) {
            createOTP = new OTP({
                otp, phone
            })
        }

        await createOTP.save();

        //  Send Response
        res.status(200).json({
            success: true,
            message: 'OTP Sent Successfully',
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

const addEmailOrPhone = async (req, res) => {
    try {
        const { id } = req.user;
        //  Fetching
        const { email, phone, otp } = req.body;
        //  Validation
        if (!otp || (!email && !phone) ) {
            throw customError('Please enter the details correctly', 401);
        }

        if(email){
            const find = await User.findOne({ email })
            if (find) {
                throw customError('This email is already registered', 402);
            }
        }
        if(phone){
            const find = await User.findOne({ phone })
            if (find) {
                throw customError('This email is already registered', 402);
            }
        }

        //  Verify OTP
        if (email) {
            const recentOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
            if (!recentOtp || !recentOtp[0] || recentOtp[0].otp != otp) {
                throw customError('OTP does not matched', 400);
            }
            await User.findByIdAndUpdate(id, {
                email: email,
            })
        }
        if (phone) {
            const recentOtp = await OTP.find({ phone }).sort({ createdAt: -1 }).limit(1);
            if (!recentOtp || !recentOtp[0] || recentOtp[0].otp != otp) {
                throw customError('OTP does not matched', 400);
            }
            await User.findByIdAndUpdate(id, {
                phone: phone,
            })
        }

        
        //  Send Response
        res.status(200).json({
            success: true,
            message: 'Added successfully'
        })
    } catch (err) {
        failed(res, err)
    }
}

exports.getVerifyLink = getVerifyLink;
exports.verify = verify;
exports.getResetPasswordLink = getResetPasswordLink;
exports.resetPassword = resetPassword;
exports.sendOTP = sendOTP;
exports.addEmailOrPhone = addEmailOrPhone;