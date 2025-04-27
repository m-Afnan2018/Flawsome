import React from 'react'
import style from './ProductCard.module.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { setQuickView } from 'slices/productSlice';
import { useDispatch } from 'react-redux';

const ProductCard = ({ data }) => {

    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const quickView = (e)=>{
        e.preventDefault();
        e.stopPropagation();
        dispatch(setQuickView(data));
    }

    return (
        <div className={`${style.ProductCard} ${location.pathname === '/search' && style.search}`} >
            <div className={style.img} style={{ backgroundImage: `url(${data.images[0]})` }} onClick={() => navigate(`/product/${data._id}`)} >
                <div>{(data.maxDiscount*100).toFixed(0)}% OFF</div>
                <div>
                    <h3 onClick={() => navigate(`/product/${data._id}`)}>{data?.name}s</h3>
                    <h4 onClick={() => navigate(`/product/${data._id}`)}>Starting from  ₹{data.minPrice}</h4>
                    <button className='border-round-btn' onClick={quickView}>Quick view</button>
                </div>
            </div>
        </div>
    )
}

export default ProductCard