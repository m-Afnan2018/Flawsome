import React from 'react'
import style from './Utils.module.css'

const Refund = () => {
    return (
        <div className={style.Utils}>
            <div>
                <h1>Refund Policy</h1>

                <ul>
                    <li>We offer a hassle-free 10-days (from the date of delivery) return and exchange for products bought at MRP.</li>
                    <li>Only exchange (same or higher value of any product) requests will be accepted for products bought during sales or at discounted prices.</li>
                    <li>Items will be considered for refund only if it is unused, unaltered and with all tags attached.</li>
                    <li>Returns that are damaged or soiled may not be accepted and may be sent back to the customer.</li>
                    <li>Please inform our customer care number if the product has been delivered without any Tag within 24hrs of receiving the product.</li>
                </ul>

                {/* <p>We offer a hassle-free 10-days (from the date of delivery) return and exchange for products bought at MRP.

Only exchange (same or higher value of any product) requests will be accepted for products bought during sales or at discounted prices.

Items will be considered for refund only if it is unused, unaltered and with all tags attached.

Returns that are damaged or soiled may not be accepted and may be sent back to the customer.

Please inform our customer care number if the product has been delivered without any Tag within 24hrs of receiving the product.</p> */}
                <h2>How to Request a Refund</h2>
                <p>To initiate a refund, please contact us directly via email or phone. Include your order number and the reason for the refund request:</p>
                <ul>
                    <li>Email: <a href="mailto:flawsome0510@gmail.com" target='_blank' rel='noreferrer'>flawsome0510@gmail.com</a></li>
                    <li>Phone: <a href="tel://+917634834998" target='_blank' rel='noreferrer'> +917634834998</a></li>
                </ul>
            </div>
        </div>
    )
}

export default Refund
