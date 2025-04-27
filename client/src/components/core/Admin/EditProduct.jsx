import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import style from './Admin.module.css';
import { MdClose, MdArrowUpward, MdArrowDownward, MdAdd, MdCheck, MdEdit, MdDelete, MdEditOff } from 'react-icons/md';
import { createProduct, getProduct, updateProduct } from 'services/operations/productAPI';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const EditProduct = () => {
    const [data, setData] = useState(null);

    return (
        <div className={style.Product}>
            <EditProductForm
                setData={setData}
                data={data}
            />
        </div>
    );
};


const EditProductForm = ({ setData, data }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const imageRef = useRef();

    const { categories } = useSelector(state => state.products);

    const [images, setImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [details, setDetails] = useState(data?.details || []);
    const [options, setOptions] = useState([]);
    const [detail, setDetail] = useState('');
    const [heading, setHeading] = useState('');
    const [addingOption, setAddingOption] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        getValues,
        setError,
        clearErrors,
    } = useForm();

    useEffect(() => {
        if (data) {
            setValue('name', data.name);
            setValue('description', data.description);
            setDetails(data.details);
            setValue('category', data.category._id);
            setImages(data.images);
            setPreviewImages(data.images);
            setOptions(data.buyingOption);
            setValue('cashOnDelivery', data.isCOD || false);
            console.log(data)
        } else {
            setValue('name', '');
            setValue('description', '');
            setDetails([]);
            setValue('category', '');
            setValue('originalPrice', '');
            setValue('discountedPrice', '');
            setValue('category', '');
            setImages([]);
            setPreviewImages([]);
            setValue('cashOnDelivery', false);
        }
    }, [data, setValue]);

    useEffect(() => {
        if (id) {
            getProduct({ 'id': id }, setData);
        } else {
            setData(null);
        }
    }, [id, setData]);

    const addProductHandler = async (formData) => {
        formData.details = JSON.stringify(details);
        formData.buyingOptions = JSON.stringify(options);
        if (!isNaN(formData.originalPrice) && !isNaN(formData.discountedPrice) && formData.originalPrice < formData.discountedPrice) {
            setError('discountedPrice', {
                type: 'manual',
                message: 'Discounted Price must be less than Original Price'
            });
            return;
        }
        if (!isNaN(formData.stocks)) {
            setError('stocks', {
                type: 'manual',
                message: 'Stocks must be a number'
            })
        }
        if (!images || images.length === 0) {
            setError('images')
            return;
        }
        if (details.length === 0) {
            setError('details', {
                type: 'manual',
                message: 'Atleast one detail is required'
            });
            return;
        }
        formData.images = images;
        formData.productId = id;
        if (data) {
            formData.id = data._id;
            await updateProduct(formData);
            navigate('/admin/manage-products');
        } else {
            console.log('reached here')
            await createProduct(formData);
            navigate('/admin/manage-products');
        }
    };

    const addDetails = () => {
        if (detail.length !== 0) {
            setDetails([...details, { heading: heading, detail: detail }]);
            setHeading('');
            setDetail('');
        }
    };

    const removeDetails = (index) => {
        setDetails(details.filter((_, i) => i !== index));
    };

    const moveDetailUp = (index) => {
        if (index > 0) {
            const newDetails = [...details];
            [newDetails[index - 1], newDetails[index]] = [newDetails[index], newDetails[index - 1]];
            setDetails(newDetails);
        }
    };

    const moveDetailDown = (index) => {
        if (index < details.length - 1) {
            const newDetails = [...details];
            [newDetails[index + 1], newDetails[index]] = [newDetails[index], newDetails[index + 1]];
            setDetails(newDetails);
        }
    };

    const editOption = (index) => {
        if (addingOption) {
            return;
        }
        const option = options[index];
        setValue('size', option.size);
        setValue('originalPrice', option.originalPrice);
        setValue('discountedPrice', option.discountedPrice);
        setValue('stocks', option.stock);
        setAddingOption(index+1);
    }

    const removeOption = (index) => {
        setOptions(options.filter((_, i) => i !== index));
    }

    const moveOptionLeft = (index) => {
        if (index > 0) {
            const newOptions = [...options];
            [newOptions[index - 1], newOptions[index]] = [newOptions[index], newOptions[index - 1]];
            setOptions(newOptions);
        }
    }

    const moveOptionRight = (index) => {
        if (index < options.length - 1) {
            const newOptions = [...options];
            [newOptions[index + 1], newOptions[index]] = [newOptions[index], newOptions[index + 1]];
            setOptions(newOptions);
        }
    }

    const addOption = () => {
        const addedOption = {
            size: getValues('size'),
            originalPrice: getValues('originalPrice'),
            discountedPrice: getValues('discountedPrice'),
            stock: getValues('stocks')
        }

        if (addingOption === true) {
            setOptions([...options, addedOption]);
        } else {
            setOptions(prev => {
                const newOptions = [...prev];
                newOptions[addingOption-1] = addedOption;
                return newOptions;
            })
        }

        setValue('size', '');
        setValue('originalPrice', '');
        setValue('discountedPrice', '');
        setValue('stocks', '');
        setAddingOption(false);
    }
    const cancelOption = () => {
        setValue('size', '');
        setValue('originalPrice', '');
        setValue('discountedPrice', '');
        setValue('stocks', '');
        setAddingOption(false);
    }

    const addImage = (file) => {
        if (file) {
            setImages((prev) => [...prev, file]);
            clearErrors('images');
        }
    };

    const previewFile = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            addImage(file);
            setPreviewImages((prev) => [...prev, reader.result]);
        };
    };

    const handleImage = (event) => {
        const files = event.target.files;
        if (files) {
            Array.from(files).forEach((file) => {
                previewFile(file);
            });
        }
    };

    const removeImage = (index) => {
        if (index >= 0) {
            let temp = previewImages.filter((_, i) => i !== index);
            setPreviewImages(temp);

            temp = images.filter((_, i) => i !== index);
            setImages(temp);
        }
    };
    return (
        <form key='product-form' className={style.productForm} onSubmit={handleSubmit(addProductHandler)}>
            <div>
                {/* Name */}
                <div>
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        {...register('name', { required: true })}
                    />
                    {errors.name && <span>{errors.name.message}</span>}
                </div>

                {/* Description */}
                <div>
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        {...register('description', { required: true })}
                    ></textarea>
                    {errors.description && <span>{errors.description.message}</span>}
                </div>



                {/* Category */}
                <div>
                    <label htmlFor="category">Category</label>
                    <select id="category" {...register('category', { required: true })}>
                        <option disabled value="">Select a category</option>
                        {categories.map(category => (
                            <option key={category._id} value={category._id}>{category.name}</option>
                        ))}
                    </select>
                    {errors.category && <span>{errors.category.message}</span>}
                </div>

                {/* Cash on Delivery */}
                <div>
                    <label htmlFor="cashOnDelivery">Cash on Delivery</label>
                    <label class="toggle-switch">
                        <input type="checkbox" onClick={() => console.log(getValues('cashOnDelivery'))} {...register('cashOnDelivery')} />
                        <div class="toggle-switch-background">
                            <div class="toggle-switch-handle"></div>
                        </div>
                    </label>
                </div>

                {/* Details */}
                <div className={style.details}>
                    <label htmlFor="details">Details</label>
                    {details.length > 0 &&
                        details.map((detail, index) => (
                            <div key={index}>
                                <p>{detail.heading}</p>
                                <p>{detail.detail}</p>
                                <div className={style.groupButtons}>
                                    <button className='border-round-btn' type='button' onClick={() => moveDetailUp(index)}><MdArrowUpward /></button>
                                    <button className='border-round-btn' type='button' onClick={() => moveDetailDown(index)}><MdArrowDownward /></button>
                                    <button className='border-round-btn' type='button' onClick={() => removeDetails(index)}><MdClose /></button>
                                </div>
                            </div>
                        ))}
                    <div>
                        <input
                            type="text"
                            id="heading"
                            value={heading}
                            placeholder='Heading'
                            onChange={(e) => setHeading(e.target.value)}
                        />
                        <input
                            type="text"
                            id="detail"
                            value={detail}
                            placeholder='information'
                            onChange={(e) => setDetail(e.target.value)}
                        />
                    </div>

                    <button className='border-round-btn' onClick={addDetails} type='button'>Add Detail</button>
                    {errors.details && <span>{errors.details.message}</span>}
                </div>

                {/* Buying Options */}
                <div className={style.buyingOptions}>
                    <label htmlFor="buyingOptions">Buying Options</label>
                    <div>
                        {options.length > 0 &&
                            options.map((option, index) => (
                                <div key={index}>
                                    <div>
                                        <label htmlFor="size">Size</label>
                                        <p>{option.size}</p></div>
                                    <div>
                                        <label htmlFor="originalPrice">Original Price</label>
                                        <p>{option.originalPrice}</p></div>
                                    <div>
                                        <label htmlFor="discountedPrice">Discounted Price</label>
                                        <p>{option.discountedPrice}</p></div>
                                    <div>
                                        <label htmlFor="stock">Stock</label>
                                        <p>{option.stock}</p></div>
                                    <div className={style.groupButtons}>
                                        <button className='border-round-btn' type='button' onClick={() => moveOptionLeft(index)}><MdArrowUpward /></button>
                                        <button className='border-round-btn' type='button' onClick={() => moveOptionRight(index)}><MdArrowDownward /></button>
                                        <button className='border-round-btn' type='button' onClick={() => editOption(index)}>{!addingOption ? <MdEdit /> : <MdEditOff />}</button>
                                        <button className='border-round-btn' type='button' onClick={() => removeOption(index)}><MdDelete /></button>
                                    </div>
                                </div>
                            ))}
                        {addingOption && <div>
                            <div>
                                <label htmlFor="size">Size</label>
                                <input
                                    type="text"
                                    id="size"
                                    placeholder='Size'
                                    {...register('size')}
                                />
                            </div>
                            <div>
                                <label htmlFor="originalPrice">Original Price</label>
                                <input
                                    type="text"
                                    id="originalPrice"
                                    placeholder='Original Price'
                                    {...register('originalPrice')}
                                />
                            </div>
                            <div>
                                <label htmlFor="discountedPrice">Discounted Price</label>
                                <input
                                    type="text"
                                    id="discountedPrice"
                                    placeholder='Discounted Price'
                                    {...register('discountedPrice')}
                                />
                            </div>
                            <div>
                                <label htmlFor="stocks">Stocks</label>
                                <input
                                    type="stocks"
                                    id="stocks"
                                    placeholder='stocks'
                                    {...register('stocks')}
                                />
                            </div>
                            <div className={style.groupButtons}>
                                <button className='border-round-btn' style={{ width: '50%' }} type='button' onClick={() => addOption()}><MdCheck /></button>
                                <button className='border-round-btn' style={{ width: '50%' }} type='button' onClick={() => cancelOption()}><MdClose /></button>
                            </div>
                        </div>}
                        <div onClick={() => setAddingOption(true)}>
                            <MdAdd />
                        </div>
                    </div>

                    {errors.originalPrice && <span>{errors.originalPrice.message}</span>}
                    {errors.discountedPrice && <span>{errors.discountedPrice.message}</span>}
                    {errors.buyingOptions && <span>{errors.buyingOptions.message}</span>}
                </div>

                {/* Images */}
                <div className={style.imageSection}>
                    <input ref={imageRef} onChange={handleImage} type='file' accept='image/*' multiple />
                    {images.length === 0 && <div onClick={() => imageRef.current.click()} className={style.tempImage}>
                        <h2>Add at least one image</h2>
                    </div>}
                    <div>
                        {previewImages.map((image, index) => (
                            <div key={index} className={style.imageContainer}>
                                <MdClose onClick={() => removeImage(index)} />
                                <img src={image} alt='productImage' />
                            </div>
                        ))}
                    </div>
                    {errors.images && <span>{errors.images.message}</span>}
                    {images.length !== 0 && <button onClick={() => imageRef.current.click()} type='button' className='border-round-btn'>Add Image</button>}
                </div>

                <button type="submit" className='border-round-btn'>{data ? 'Update Product' : 'Add Product'}</button>
            </div>
        </form>
    );
};

export default EditProduct;