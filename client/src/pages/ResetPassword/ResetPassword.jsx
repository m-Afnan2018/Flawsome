import React, { useEffect, useState } from 'react'
import style from 'components/common/Login/Login.module.css'
import background from 'assets/images/background.png'
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { getResetPasswordLink } from 'services/operations/authAPI';
import { useSelector } from 'react-redux';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

import slideImages from 'assets/data/heroData'
const ResetPassword = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        // Handle form submission logic here
        getResetPasswordLink({ email: data.email });
    };


    const [data, setData] = useState(slideImages);
        const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    
        const { banners } = useSelector(state => state.site);
    
        useEffect(() => {
            const handleResize = () => {
                setIsMobile(window.innerWidth <= 768);
            };
    
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }, []);
    
        useEffect(() => {
            if (banners === null || banners.length === 0) {
                setData(slideImages);
            } else {
                setData(banners);
            }
        }, [banners])

    return (
        <div className={style.Login} style={{ backgroundImage: `url(${background})` }}>
            <div>
                <div>
                    <Carousel showThumbs={false} showStatus={false} infiniteLoop={true} swipeable={false} showIndicators={false} autoPlay={false} interval={3000} transitionTime={500}>
                        {data.map((image, index) => (
                            <div key={index} className={style.Slide}>
                                <img src={isMobile ? image.smallImage : image.largeImage} alt={image.alt} className={style.SlideImage} />
                                <div className={style.blurBackground} />
                                <div className={style.details}>
                                    <h2>{image.title}</h2>
                                    <h3>{image.description}</h3>
                                </div>
                            </div>
                        ))}
                    </Carousel>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <h2>Reset Password:</h2>
                    <div>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /\S+@\S+\.\S+/,
                                    message: 'Invalid email address',
                                },
                            })}
                        />
                        {errors.email && <span>{errors.email.message}</span>}
                    </div>
                    <button type="submit" className='border-round-btn'>Reset Password</button>
                    <div>
                        <Link className='border-round-btn' to={'/login'}>Login</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ResetPassword