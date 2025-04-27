import React from 'react';
import style from './Home.module.css';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

import slideImages from 'assets/data/heroData';

const HeroSlider = () => {

    
    return (
        <div className={style.HeroSlider}>
            <Carousel showThumbs={false} showStatus={false} infiniteLoop={true} autoPlay={true} interval={3000} transitionTime={500}>
                {slideImages.map((image, index) => (
                    <div key={index} className={style.Slide}>
                        <img src={image.url} alt={image.alt} className={style.SlideImage} />
                        <h2>{image.heading}</h2>
                        <h3>{image.detail}</h3>
                    </div>
                ))}
            </Carousel>
        </div>
    );
};

export default HeroSlider;