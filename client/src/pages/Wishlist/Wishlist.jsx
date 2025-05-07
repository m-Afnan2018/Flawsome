import React from 'react'
import style from './Wishlist.module.css'
import { useSelector } from 'react-redux';
import ProductCart from 'components/common/ProductCart/ProductCart';

const Wishlist = () => {

    const { wishlist } = useSelector(state => state.products);

    if (!wishlist) {
        return <div className='loaderBg'><div className='loader'></div></div>
    }

    return (
        <div className={style.Cart} style={{ backgroundImage: `linear-gradient(356deg, #250a23 20%, #c594c1)` }}>
            <h3>My Wishlist</h3>
            <div>
                <ProductCart products={wishlist} type={'wishlist'} />
            </div>
        </div>
    )
}

export default Wishlist