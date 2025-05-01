import React, { useEffect, useState } from 'react'
import style from './Product.module.css'
import ReactImageGallery from 'react-image-gallery'
import '../../../../node_modules/react-image-gallery/styles/css/image-gallery.css'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { setCart, setWishlist } from 'slices/productSlice'

const convertToGalleryImages = (images) => {
    if (images) {
        return images.map((image) => ({
            original: image,
            thumbnail: image,
            thumbnailHeight: '50px',
            thumbnailWidth: '100px',
            originalHeight: '500px',
            originalWidth: '400px',
            thumbnailClass: style.thumbnailClass,
            originalClass: style.originalClass
        }));
    }
    return [];
};

const countItems = (cart, productId, sizeId) => {
    if (!sizeId) {
        return 0;
    }
    const item = cart.filter((item => item.productId === productId && item.sizeId === sizeId))
    if (item.length !== 0) {
        return item[0].quantity;
    }
    return 0;
}

const CollapsibleSection = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={style.collapsibleSection}>
            <div className={style.sectionHeader} onClick={() => setIsOpen(!isOpen)}>
                <h3>{title}</h3>
                <span>{isOpen ? '-' : '+'}</span>
            </div>
            <div className={`${style.sectionContent} ${isOpen ? style.open : ''}`}>
                {isOpen && children}
            </div>
        </div>
    );
};

const ProductDetail = ({ product }) => {
    const { user } = useSelector(state => state.user);
    const { cart, wishlist } = useSelector(state => state.products);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [size, setSize] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);

    const [checkCart, setCheckCart] = useState(0)
    const [checkWishlist, setCheckWishlist] = useState(0)

    const [maxDiscount, setMaxDiscount] = useState(0);

    const handleCart = async (val) => {
        if (!user) {
            navigate('/login')
            return;
        }
        if (val) {
            if (checkCart !== 0) {
                navigate('/cart');
            } else {
                if (!selectedSize) {
                    toast.error('Select the size');
                    return;
                }
                if (selectedSize.stock === 0) {
                    toast.error('Item is out of stock');
                    return;
                }
                const obj = {
                    productId: product._id,
                    description: product.description,
                    image: product.images[0],
                    price: selectedSize.discountedPrice,
                    sizeId: selectedSize._id,
                    quantity: 1,
                    maxQuantity: selectedSize.stock

                }
                dispatch(setCart([
                    ...cart, obj
                ]));
                navigate('/cart');
            }
        }
        else {
            if (checkCart !== 0) {
                // await removeFromCart({ productId: product._id }, dispatch, user);
                const filteredCart = cart.filter(item => item.productId !== product._id);
                dispatch(setCart(filteredCart))
            } else {
                if (!selectedSize) {
                    toast.error('Select the size');
                    return;
                }
                if (selectedSize.stock === 0) {
                    toast.error('Item is out of stock');
                    return;
                }
                const obj = {
                    productId: product._id,
                    name: `${product.name} - ${selectedSize.size}`,
                    description: product.description,
                    image: product.images[0],
                    price: selectedSize.price,
                    sizeId: selectedSize._id,
                    quantity: 1,
                    maxQuantity: selectedSize.stock

                }
                dispatch(setCart([
                    ...cart, obj
                ]));
            }
        }
    }

    const addToWishlist = async () => {
        if (!selectedSize) {
            toast.error('Select the size');
            return;
        }
        const obj = {
            productId: product._id,
            name: `${product.name}- ${selectedSize.size}`,
            description: product.description,
            image: product.images[0],
            price: selectedSize.price,

        }
        if (wishlist) {
            dispatch(setWishlist([...wishlist, obj]));
        } else {
            dispatch(setWishlist([obj]));
        }
    }
    const removeFromWishlist = async () => {
        const updatedWishlist = wishlist.filter(
            (item) => item.productId !== product._id
        );
        dispatch(setWishlist(updatedWishlist));
    }

    useEffect(() => {
        if (product) {
            const maxDiscount = product.buyingOption.reduce((max, item) => {
                const discount = ((item.originalPrice - item.discountedPrice) / item.originalPrice) * 100;
                return Math.max(max, discount).toFixed(0);
            }, 0);
            setMaxDiscount(maxDiscount);
        }
        if (cart) {
            setCheckCart(countItems(cart, product._id, selectedSize?._id))
        }
        if (wishlist) {
            const temp = wishlist.filter((item => item.productId === product._id))
            if (temp.length > 0) {
                setCheckWishlist(true)
            } else {
                setCheckWishlist(false)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cart, wishlist, selectedSize])

    return (
        <div className={style.ProductDetail} style={{ backgroundColor: '#dec8e5' }}>
            <div>
                <ReactImageGallery key={`gallery`} showNav={false} items={convertToGalleryImages(product?.images)} thumbnailPosition='bottom' showIndex={true} showPlayButton={false} />
            </div>
            <div>
                <h2>{product.name}</h2>
                <h3>{product?.category?.name || 'Fashion'}</h3>

                <h3>Select Size</h3>
                <div className={style.sizeButtonContainer}>{
                    product.buyingOption.map((item, index) => (
                        <button key={index} className={`${style.sizeButton} ${size === item._id ? style.active : ''}`} onClick={() => {
                            setSize(item._id);
                            setSelectedSize(item);
                        }}>{item.size}</button>
                    ))
                }</div>
                <h4 style={{ color: 'red', fontWeight: '700', height: '1rem' }}>{selectedSize && selectedSize.stock === 0 ? 'This Item is out of Stock' : ''}</h4>
                <h4 style={{ color: 'red', fontWeight: '700', height: '1rem' }}>{selectedSize && selectedSize.stock > 0 && selectedSize.stock <= 10 ? `Hurry Up, Only ${selectedSize.stock} left !!!` : ''}</h4>

                <CollapsibleSection title="Description">
                    <h4>{product.description}</h4>
                </CollapsibleSection>

                <CollapsibleSection title="Offers">
                    <ul>
                        <li>3 Days Replacement Guarantee</li>
                        <li>Free Delivery on orders above ₹499</li>
                        <li>Upto {maxDiscount}% discount</li>
                        {product.cashOnDelivery && <li>Cash On Delivery Available</li>}
                    </ul>
                </CollapsibleSection>

                <CollapsibleSection title="Information">
                    <table className={style.detailsTable}>
                        <tbody>
                            {product.details.map((detail, index) => (
                                <tr key={index} className={style.detailRow}>
                                    <td className={style.detailHeading}>{detail.heading}</td>
                                    <td className={style.detailValue}>{detail.detail}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CollapsibleSection>

                {selectedSize && <div className={style.priceTag}>
                    <h2><span>Buy now at </span>₹ {selectedSize.discountedPrice}</h2>
                    <h3>₹ {selectedSize.originalPrice}</h3>
                </div>}
                {checkWishlist ? <button className='border-round-btn' onClick={removeFromWishlist}>Remove from wishlist</button> : <button className='border-round-btn' onClick={addToWishlist}>Add to wishlist</button>}
                <div>
                    <button className='primary-round-btn' style={{ backgroundColor: 'hsl(0deg 81.13% 32.69%)' }} onClick={() => handleCart('buy')}>{checkCart !== 0 ? `View Cart` : 'Buy Now'}</button>
                    <button className='border-round-btn' onClick={() => handleCart()}>{checkCart !== 0 ? `Remove From Cart` : 'Add to Cart'}</button>
                </div>
            </div>
        </div>
    )
}

export default ProductDetail