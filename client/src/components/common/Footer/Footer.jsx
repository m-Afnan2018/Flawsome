import React from 'react';
import style from './Footer.module.css';
import { useNavigate } from 'react-router-dom';
import { MdOutlineCall, MdOutlineLocationOn, MdOutlineMailOutline } from 'react-icons/md';
import { FaFacebookF, FaInstagram, FaPinterest, FaTwitter, FaWhatsapp, FaYoutube } from "react-icons/fa";
import logo from 'assets/images/shortLogo.svg';
import userData from 'assets/data/userData.json';

const Footer = () => {
    const navigate = useNavigate();
    return (
        <footer className={style.Footer}>
            <div className={style.topSection}>
                <div className={style.contactInfo}>
                    <div className={style.contactItem}>
                        <MdOutlineLocationOn className={style.icon} />
                        <a href={userData.location}>Visit Us</a>
                    </div>
                    <div className={style.contactItem}>
                        <MdOutlineMailOutline className={style.icon} />
                        <a href={userData.email}>@Flawsome</a>
                    </div>
                    <div className={style.contactItem}>
                        <MdOutlineCall className={style.icon} />
                        <a href={`tel:${userData.phone}`}>+91 {userData.phone}<br /></a>
                    </div>
                </div>
                <div className={style.aboutUs}>
                    <h2>About Us</h2>
                    <div className={style.links}>
                        <p onClick={() => navigate('/aboutUs')}>Our Story</p>
                        <p onClick={() => navigate('/contactUs')}>Contact Us</p>
                        <p onClick={() => navigate('/privacy')}>Privacy Policy</p>
                        <p onClick={() => navigate('/refund')}>Refund Policy</p>
                    </div>
                    <div className={style.socialIcons}>
                        <a href={userData.whatsapp}><FaWhatsapp /></a>
                        <a href={userData.facebook}><FaFacebookF /></a>
                        <a href={userData.twitter}><FaTwitter /></a>
                        <a href={userData.instagram}><FaInstagram /></a>
                        <a href={userData.pinterest}><FaPinterest /></a>
                        <a href={userData.youtube}><FaYoutube /></a>
                    </div>
                </div>
                <div className={style.quickLinks}>
                    <h2>Quick Links</h2>
                    <div className={style.links}>
                        <p onClick={() => navigate('/orders')}>My Orders</p>
                        <p onClick={() => navigate('/cart')}>My Cart</p>
                        <p onClick={() => navigate('/myaccount')}>My Account</p>
                    </div>
                </div>
                <div className={style.logoContainer}>
                    <img src={logo} alt='logo' className={style.logo} />
                </div>
            </div>
            <div className={style.bottomSection}>
                <p>© 2025, Flawsome. All rights reserved.</p>
                <p>Best in work from last 20+ years.</p>
            </div>
        </footer>
    );
};

export default Footer;