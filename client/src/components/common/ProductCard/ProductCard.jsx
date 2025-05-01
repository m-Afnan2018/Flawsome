import React from 'react'
import style from './ProductCard.module.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { setQuickView } from 'slices/productSlice';
import { useDispatch } from 'react-redux';
import { FaOpencart } from "react-icons/fa";

const ProductCard = ({ data }) => {

    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const quickView = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(setQuickView(data));
    }

    return (
        <div className={`${style.ProductCard} ${location.pathname === '/search' && style.search}`}>
            <div className={style.img} style={{ backgroundImage: `url(${data.images[0]})` }} onClick={() => navigate(`/product/${data._id}`)}>
                <div className={style.topLeft}>{(data.maxDiscount * 100).toFixed(0)}% OFF</div>
                <div className={style.topRight} onClick={quickView}>Quick View</div>
                <div className={style.bottomLeft}>{data.rating} ★</div>
                <div className={style.bottomRight}><FaOpencart /></div>
            </div>
            <div className={style.details}>
                <h3 onClick={() => navigate(`/product/${data._id}`)}>{data?.name}</h3>
                <h5>{data.category || 'Fashion'}</h5>
                <h4 onClick={() => navigate(`/product/${data._id}`)}>Starting from ₹{data.minPrice}</h4>
            </div>
        </div>
    )
}

export default ProductCard