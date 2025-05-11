import React, { useEffect, useState } from 'react'
import style from './Cart.module.css'
import { useSelector } from 'react-redux';
import ProductCart from 'components/common/ProductCart/ProductCart';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Cart = () => {

    const [totalCost, setTotalCost] = useState(0);

    const navigate = useNavigate();

    const { cart } = useSelector(state => state.products);
    const { user } = useSelector(state => state.user);

    useEffect(() => {
        let total = 0;
        if (cart) {
            cart.forEach((item) => {
                total += (item.price * item.quantity);
            })
            setTotalCost(total);
        }
    }, [cart]);

    const handleClick = ()=>{
        if(user.email === null){
            toast.error('Please add email ID before login');
            return;
        }
        navigate('/booking');
    }

    if (!cart) {
        return <div className='loaderBg'><div className='loader'></div></div>
    }

    return (
        <div className={style.Cart}>
            <h3>My Cart</h3>
            <div>
                <ProductCart products={cart} type={'cart'} />
                {cart?.length !== 0 && <div className={style.detail}>
                    <div>
                        <h3>Total Cost:</h3>
                        <h4>₹{totalCost}</h4>
                    </div>
                    {/* <div>
                        <h3>Delivery Charges:</h3>
                        <h4>₹40</h4>
                    </div> */}
                    <div>
                        <h3>Delivery Charges:</h3>
                        <h4 style={{ color: 'red' }}> ₹0</h4>
                    </div>
                    <div>
                        <h3>Final Cost:</h3>
                        <h4>{totalCost}</h4>
                    </div>
                    <button className='border-btn' onClick={handleClick}>Pay ₹{totalCost}</button>
                </div>}
            </div>
        </div>
    )
}

export default Cart