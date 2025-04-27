import React, { useEffect, useState } from 'react'
import style from './Admin.module.css'
import { getProducts } from 'services/operations/productAPI';
import { useNavigate } from 'react-router-dom';

const ManageProducts = () => {

    const [products, setProducts] = useState([]);
    const [loader, setLoader] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        getProducts({ limit: 9999, sortBy: 'createdAt', availibility: false, all: true }, setProducts);
    }, [])

    useEffect(() => {
        if (products.length > 0) {
            setLoader(false);
        }
    }, [products])

    return (
        <div className={style.ManageProduct}>
            <div>
                <h1>Manage Products</h1>
                {
                    loader ? <div className='loaderBg'><div className='loader'></div></div> :
                        <div className={style.allProduct}>
                            {products?.length === 0 ? <div className={style.loaderBg}>No Product Found</div> :
                                products.map((p, index) => <SingleProduct key={index} navigate={navigate} product={p} />)}
                        </div>
                }
            </div>
        </div>
    )
}

const SingleProduct = ({ navigate, product }) => {
    return (
        <div onClick={() => navigate(`/admin/product/${product._id}`)} className={style.singleProduct}>
            <img src={product?.images[0]} alt={product.name} />
            <div>
                <h2>{product.name}</h2>
                <h4>Category: {product.category}</h4>
                <h3>Stock: {product?.minStock}</h3>
                <h4>Price: ₹{product?.minPrice}</h4>

            </div>
        </div>
    )
}

export default ManageProducts