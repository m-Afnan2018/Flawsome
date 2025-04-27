import React from 'react';
import style from './Home.module.css';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';


import banner1 from 'assets/images/banners/banner-1.png'
import banner2 from 'assets/images/banners/banner-2.png';
import banner3 from 'assets/images/banners/banner-3.png';
import banner4 from 'assets/images/banners/banner-4.png';

const HeroSlider = () => {

    const slideImages = [{
        url: banner1,
        alt: 'banner1'
    }, {
        url: banner2,
        alt: 'banner2'
    }, {
        url: banner3,
        alt: 'banner3'
    }, {
        url: banner4,
        alt: 'banner4'
    }];
    return (
        <div className={style.HeroSlider}>
            <Carousel showThumbs={false} showStatus={false} infiniteLoop={true} autoPlay={true} interval={3000} transitionTime={500}>
                {slideImages.map((image, index) => (
                    <div key={index} className={style.Slide}>
                        <img src={image.url} alt={image.alt} className={style.SlideImage} />
                    </div>
                ))}
            </Carousel>
        </div>
    );
};

export default HeroSlider;