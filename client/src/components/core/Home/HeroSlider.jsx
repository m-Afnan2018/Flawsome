import React, { useEffect, useState } from 'react';
import style from './Home.module.css';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

import slideImages from 'assets/data/heroData';
import { useSelector } from 'react-redux';

const HeroSlider = () => {

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
        <div className={style.HeroSlider}>
            <Carousel showThumbs={false} showStatus={false} infiniteLoop={true} swipeable={false} showIndicators={false} autoPlay={true} interval={3000} transitionTime={500}>
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
    );
};

export default HeroSlider;