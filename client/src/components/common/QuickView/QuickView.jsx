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
            <button className='primary-btn' onClick={() => dispatch(setQuickView(null))}><MdClose /></button>
            <div>
                <img src={data.images[0]} alt='product' />
            </div>
            <div style={{ padding: '1rem' }}>
                <h1>{data.name}</h1>
                <h3>{data.description}</h3>
                <h2>Details:</h2>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' }}>
                    <tbody>
                        {data.details.map((detail, index) => (
                            <tr key={index}>
                                <td style={{ padding: '0.5rem', borderBottom: '1px solid #eee' }}>{detail.heading}</td>
                                <td style={{ padding: '0.5rem', borderBottom: '1px solid #eee' }}>{detail.detail}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                <button className='border-round-btn' onClick={() => {dispatch(setQuickView(null)); navigate(`/product/${data._id}`)}}>View More</button>
            </div>
        </div >
    )
}

export default QuickView