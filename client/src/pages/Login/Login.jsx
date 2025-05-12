import React, { useEffect, useState } from 'react';
import style from 'components/common/Login/Login.module.css'
import background from 'assets/images/background.png'
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { signinUser } from 'services/operations/userAPI';
import { Link } from 'react-router-dom';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import slideImages from 'assets/data/heroData'
import toast from 'react-hot-toast';

const Login = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const [loginType, setLoginType] = useState('email');

	const dispatch = useDispatch();

	const onSubmit = (data) => {
		if (!data.email && !data.phone) {
			toast.error('Please provide either an email or a phone number.');
			return;
		}
		let newData;
		if (loginType === 'email') {
			newData = {
				email: data.email,
				password: data.password
			}
		}
		if (loginType === 'phone') {
			newData = {
				phone: data.phone,
				password: data.password
			}
		}

		signinUser(newData, dispatch);
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
					<h2>Login:</h2>
					<div>
						{loginType === 'email' ? <div>
							<label htmlFor="email">Email</label>
							<input
								type="email"
								id="email"
								{...register('email', {
									pattern: {
										value: /\S+@\S+\.\S+/,
										message: 'Invalid email address',
									},
								})}
							/>
							{errors.email && <span>{errors.email.message}</span>}
						</div> :
							<div>
								<label htmlFor="email">Phone number</label>
								<input
									type="text"
									id="phone"
									{...register('phone', {
										pattern: {
											value: /^\d{10}$/,
											message: 'Invalid phone number',
										},
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
					</div>
					<button style={{ marginTop: '2rem', marginBottom: '2rem' }} type="submit" className='border-round-btn'>Login</button>
					{loginType === 'email' && <p onClick={() => setLoginType('phone')} className={style.loginTypeButton}>Sign In with Phone number</p>}
					{loginType === 'phone' && <p onClick={() => setLoginType('email')} className={style.loginTypeButton}>Sign In with Email ID</p>}
					<div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
						<Link className='border-round-btn' to={'/signup'}>Create Account</Link>
						<Link className='border-round-btn' to={'/reset-password'}>Forget Password</Link>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Login;