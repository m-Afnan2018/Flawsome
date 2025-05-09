import React, { useEffect, useState } from 'react';
import style from 'components/common/Login/Login.module.css'
import background from 'assets/images/background.png'
import { useForm } from 'react-hook-form';
import { signupUser } from 'services/operations/userAPI';
import { Link, useNavigate } from 'react-router-dom';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

import slideImages from 'assets/data/heroData'
import { useSelector } from 'react-redux';
import { sendOTP } from 'services/operations/authAPI';

const Signup = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue
    } = useForm();

    const [loginType, setLoginType] = useState('email');
    const [saveData, setSaveData] = useState(false);

    useEffect(()=>{
        setValue('fullname', '')
        setValue('email', '')
        setValue('phone', '')
        setValue('password', '')
        setValue('confirmPassword', '')
        setValue('otp', '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loginType])


    const password = watch('password');
    const navigate = useNavigate();

    const onSubmit = (data) => {
        // Handle form submission logic here

        if (saveData) {
            signupUser(data, navigate);
            return;
        }
        if (loginType === 'email') {
            sendOTP({ email: data.email });
        } else {
            sendOTP({ phone: data.phone });
        }
        setSaveData(data);
    };

    const resendOTP = () => {
        console.log(saveData);
        if (saveData.email !== "") {
            sendOTP({ email: saveData.email });
        } else if (saveData.phone !== "") {
            sendOTP({ phone: saveData.phone });
        }
    }


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
                <form onSubmit={handleSubmit(onSubmit)} autocomplete="off">
                    <h2>Sign Up</h2>
                    <div>
                        <div>
                            <label htmlFor="fullname">Full Name</label>
                            <input
                                autoComplete="off" // Use a non-standard value
                                autoCorrect="off"         // Disable auto-correction
                                autoCapitalize="none"     // Disable auto-capitalization
                                spellCheck="false"        // Disable spell checkings
                                type="text"
                                id="fullname"
                                disabled={saveData}
                                {...register('fullname', { required: 'Full Name is required' })}
                            />
                            {errors.fullname && <span>{errors.fullname.message}</span>}
                        </div>
                        {loginType === 'email' ? <div>
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                autoComplete="off" // Use a non-standard value
                                autoCorrect="off"         // Disable auto-correction
                                autoCapitalize="none"     // Disable auto-capitalization
                                spellCheck="false"        // Disable spell checkings
                                disabled={saveData}
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /\S+@\S+\.\S+/,
                                        message: 'Invalid email address',
                                    },
                                })}
                            />
                            {errors.email && <span>{errors.email.message}</span>}
                        </div> :
                            <div>
                                <label htmlFor="phone">Phone number</label>
                                <input
                                    type="text"
                                    id="phone"
                                    autoComplete="off" // Use a non-standard value
                                    autoCorrect="off"         // Disable auto-correction
                                    autoCapitalize="none"     // Disable auto-capitalization
                                    spellCheck="false"        // Disable spell checkings
                                    disabled={saveData}
                                    {...register('phone', {
                                        required: 'Phone number is required',
                                    })}
                                />
                                {errors.phone && <span>{errors.phone.message}</span>}
                            </div>
                        }
                        <div>
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                autoComplete="off" // Use a non-standard value
                                autoCorrect="off"         // Disable auto-correction
                                autoCapitalize="none"     // Disable auto-capitalization
                                spellCheck="false"        // Disable spell checkings
                                disabled={saveData}
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: {
                                        value: 6,
                                        message: 'Password must be at least 6 characters',
                                    },
                                })}
                            />
                            {errors.password && <span>{errors.password.message}</span>}
                        </div>
                        <div>
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                autoComplete="off" // Use a non-standard value
                                autoCorrect="off"         // Disable auto-correction
                                autoCapitalize="none"     // Disable auto-capitalization
                                spellCheck="false"        // Disable spell checkings
                                disabled={saveData}
                                {...register('confirmPassword', {
                                    required: 'Confirm Password is required',
                                    validate: (value) =>
                                        value === password || 'Passwords do not match',
                                })}
                            />
                            {errors.confirmPassword && (
                                <span>{errors.confirmPassword.message}</span>
                            )}
                        </div>

                        {saveData && <div>
                            <label htmlFor="otp">OTP</label>
                            <input
                                type="text"
                                id="otp"
                                autoComplete="off" // Use a non-standard value
                                autoCorrect="off"         // Disable auto-correction
                                autoCapitalize="none"     // Disable auto-capitalization
                                spellCheck="false"        // Disable spell checkings
                                {...register('otp', {
                                    required: 'OTP is required',
                                })}
                            />
                            {errors.otp && (
                                <span>{errors.otp.message}</span>
                            )}
                        </div>}
                    </div>
                    {saveData && <div className={style.OTPbuttons}>
                        <p onClick={() => setSaveData(false)}> Edit Data</p>
                        <p onClick={resendOTP}> Resend OTP</p>
                    </div>}
                    <button type="submit" className='border-round-btn'>{saveData ? 'Sign Up' : 'Send OTP'}</button>
                    {loginType === 'email' && <p onClick={() => setLoginType('phone')} className={style.loginTypeButton}>Sign Up with Phone number</p>}
                    {loginType === 'phone' && <p onClick={() => setLoginType('email')} className={style.loginTypeButton}>Sign Up with Email ID</p>}
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                        <Link className='border-round-btn' to='/login'>Login</Link>
                        {/* <Link className='border-round-btn' to='/reset-password'>Forget Password ?</Link> */}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;