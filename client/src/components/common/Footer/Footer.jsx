import React from 'react';
import style from './Footer.module.css';
import { useNavigate } from 'react-router-dom';
import { MdOutlineCall, MdOutlineLocationOn, MdOutlineMailOutline } from 'react-icons/md';
import { FaFacebookF, FaInstagram, FaPinterest, FaTwitter, FaWhatsapp, FaYoutube } from "react-icons/fa";
import logo from 'assets/images/shortLogo.svg';

const Footer = () => {
    const navigate = useNavigate();
    return (
        <footer className={style.Footer}>
            <div className={style.topSection}>
                <div className={style.contactInfo}>
                    <div className={style.contactItem}>
                        <MdOutlineLocationOn className={style.icon} />
                        <a href='/'>Visit Us</a>
                    </div>
                    <div className={style.contactItem}>
                        <MdOutlineMailOutline className={style.icon} />
                        <a href='mailto:m.afnan2018@gmail.com'>@Flawsome</a>
                    </div>
                    <div className={style.contactItem}>
                        <MdOutlineCall className={style.icon} />
                        <a href='tel:9554522980'>+91 9554522980<br />Mon - Sat - 11:00 am to 6:00 pm (IST)</a>
                    </div>
                </div>
                <div className={style.aboutUs}>
                    <h2>About Us</h2>
                    <div className={style.links}>
                        <a href='/aboutUs'>Our Story</a>
                        <a href='/contactUs'>Contact Us</a>
                        <a href='/privacy'>Privacy Policy</a>
                        <a href='/refund'>Refund Policy</a>
                    </div>
                    <div className={style.socialIcons}>
                        <a href="/"><FaWhatsapp/></a>
                        <a href='/'><FaFacebookF /></a>
                        <a href='/'><FaTwitter /></a>
                        <a href='/'><FaInstagram /></a>
                        <a href='/'><FaPinterest /></a>
                        <a href='/'><FaYoutube /></a>
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