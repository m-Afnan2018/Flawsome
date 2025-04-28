import React from 'react'
import style from './Utils.module.css'
import userData from 'assets/data/userData.json'

const ContactUs = () => {
    return (
        <div className={style.Utils}>
            <div>
                <h1>Contact Us</h1>
                <ul>
                    <li>Email: <a href={`mailto:${userData.email}`} target='_blank' rel='noreferrer'>{userData.email}</a></li>
                    <li>Phone: <a href={`tel://+91${userData.phone}`} target='_blank' rel='noreferrer'> +91{userData.phone}</a> (Hours: Monday-Friday, 9:00 AM to 5:00 PM PST)</li>
                    <li>Instagram: <a href={userData.instagram} target='_blank' rel='noreferrer'>Connect now on Facebook</a></li>
                    <li>Facebook: <a href={userData.facebook} target='_blank' rel='noreferrer'>Connect now on Instagram</a></li>
                    <li>Twitter: <a href={userData.twitter} target='_blank' rel='noreferrer'>Connect now on X</a></li>
                </ul>
            </div>

        </div>
    )
}

export default ContactUs