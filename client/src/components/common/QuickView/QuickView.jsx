import React, { useRef } from 'react'
import style from './QuickView.module.css'
import { setQuickView } from 'slices/productSlice';
import { MdClose } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import useOnClickOutside from 'hooks/useOnClickOutside';
import { useNavigate } from 'react-router-dom';

const QuickView = ({ data }) => {

    console.log(data);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const quickViewRef = useRef();

    useOnClickOutside(quickViewRef, () => dispatch(setQuickView(null)));

    return (
        <div className={style.QuickView} ref={quickViewRef}>
            <button className={`${style.closeButton} primary-btn`} onClick={() => dispatch(setQuickView(null))}><MdClose /></button>
            <div className={style.imageContainer}>
                <img src={data.images[0]} alt='product' className={style.productImage} />
            </div>
            <div className={style.content}>
                <h1 className={style.productName}>{data.name}</h1>
                <h3 className={style.productDescription}>{data.description}</h3>
                <h2 className={style.detailsHeading}>Details:</h2>
                <table className={style.detailsTable}>
                    <tbody>
                        {data.details.map((detail, index) => (
                            <tr key={index} className={style.detailRow}>
                                <td className={style.detailHeading}>{detail.heading}</td>
                                <td className={style.detailValue}>{detail.detail}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button className={`${style.viewMoreButton} border-round-btn`} onClick={() => {dispatch(setQuickView(null)); navigate(`/product/${data._id}`)}}>View More</button>
            </div>
        </div >
    )
}

export default QuickView