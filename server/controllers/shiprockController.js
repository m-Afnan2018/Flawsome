const Order = require("../models/Order");
const ShipToken = require("../models/ShipToken");
const { generateInvoice, generateLable, printManifest } = require("../utils/deliveryHandler");
const { failed, customError } = require("../utils/errorHandler")
const axios = require('axios');


exports.generateToken = async (req) => {
    try {
        //  Fetching
        const data = {
            email: process.env.SHIPROCKET_EMAIL,
            password: process.env.SHIPROCKET_PASSWORD
        };

        //  Perform task
        var config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://apiv2.shiprocket.in/v1/external/auth/login',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        const response = await axios(config)
        if (response) {
            const already = await ShipToken.findOne();
            if (already) {
                await ShipToken.findByIdAndUpdate(already._id, { token: response.data.token });
            } else {
                await ShipToken.create({ token: response.data.token });
            }
        } else {
            throw customError('Unable to get new Credentials', 501);
        }

        // //  Send Response
        // res.status(200).json({
        //     success: true,
        //     message: 'Successfully created new token'
        // })
    } catch (err) {
        console.log(err);
    }
}

exports.handleOrder = async (req, res) => {
    try {
        //  Fetching
        let { awb, current_status, order_id, etd } = req.body;

        if (typeof etd === "string" && etd.trim() !== "") {
            etd = new Date(etd.replace(" ", "T"));
            if (isNaN(etd)) {
                etd = new Date(); // fallback if invalid
            }
        } else {
            etd = new Date(); // fallback if empty or not a string
        }

        const order = await Order.findOneAndUpdate({ 'orderDetails.public_order_id': order_id }, {
            orderDetails: {
                status: current_status,
                expected_delivery: etd
            },
            shiprocketDetails: {
                awb_code: awb,
            }
        })

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        const token = (await ShipToken.findOne({})).token;

        await generateInvoice(order_id, token);
        await generateLable(order.shiprocketDetails.shipment_id, token);
        await printManifest(order.shiprocketDetails.shipment_id, token);
        res.status(200).json({
            success: true,
            message: 'Updated Order'
        })
    } catch (err) {
        console.log("Shiprocket Handle Error: -", err);
        res.status(200).json({
            success: true,
            message: 'Updated Order'
        })
    }
}