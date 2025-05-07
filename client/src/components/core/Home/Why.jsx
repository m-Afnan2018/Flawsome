import React from 'react'
import style from './Home.module.css'
import { CiDeliveryTruck } from "react-icons/ci";
import { GoShieldCheck } from "react-icons/go";
import { CiShoppingTag } from "react-icons/ci";
import { LiaWalletSolid } from "react-icons/lia";

const Why = () => {
    return (
        <div className={style.Why}>
            <div>
                <CiDeliveryTruck />
                <h2>FREE SHIPPING</h2>
                <p>pan india</p>
            </div>
            <div>
                <GoShieldCheck />
                <h2>Guaranteed Quality</h2>
                <p>best quality saree</p>
            </div>
            <div>
                <CiShoppingTag />
                <h2>BEST PRICE</h2>
                <p>directly from weaver to you</p>
            </div>
            <div>
                <LiaWalletSolid />
                <h2>FAST & SECURE PAYMENTS</h2>
                <p>hassel free payemnt</p>
            </div>

        </div>
    )
}

export default Why