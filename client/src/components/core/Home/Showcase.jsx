import React from 'react';
import style from './Home.module.css';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import ProductCard from 'components/common/ProductCard/ProductCard';

const Showcase = ({ products }) => {
    const settings = {
        className: "center",
        centerMode: true,
        centerPadding: "60px",
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        rows: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2500,
        cssEase: "linear",
        variableWidth: true,
    };

    return (
        <div className={style.Showcase}>
            <h1 className={style.heading}>OUR BEST PRODUCTS</h1>
            <Slider {...settings}>
                {products.map((product, index) => (
                    <div className={style.singleSlide}>

                        <ProductCard key={index} data={product} />
                    </div>

                ))}
            </Slider>
        </div>
    );
};

export default Showcase;