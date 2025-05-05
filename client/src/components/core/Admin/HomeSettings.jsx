import React, { useEffect, useRef, useState } from 'react'
import style from './Admin.module.css'
import { useForm } from 'react-hook-form';
import { MdClose, MdArrowUpward, MdArrowDownward, MdEdit, MdDelete, } from 'react-icons/md';
import { addSiteData, getSiteData, updateSiteArrangements, updateSiteData } from 'services/operations/siteAPI';


const HomeSettings = () => {
    return (
        <div className={style.HomeSettings}>
            <EditSliderForm />

        </div>
    )
}

const EditSliderForm = () => {
    const [data, setData] = useState(null);
    const [sliders, setSliders] = useState(null);
    const [smallImage, setSmallImage] = useState(null);
    const [largeImage, setLargeImage] = useState(null);
    const [previewSmallImage, setPreviewSmallImage] = useState(null);
    const [previewLargeImage, setPreviewLargeImage] = useState(null);
    const smallImageRef = useRef();
    const largeImageRef = useRef();
    

    
    useEffect(() => {
        getSiteData(setSliders);
    }, [])

    const handleImage = (event, type) => {
        const files = event.target.files;
        if (files) {
            Array.from(files).forEach((file) => {
                previewFile(file, type);
            });
        }
    };

    const previewFile = (file, type) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            if (type === 'SMALL') {
                setSmallImage(file);
                setPreviewSmallImage(reader.result);
            } else if (type === 'LARGE') {
                setLargeImage(file);
                setPreviewLargeImage(reader.result);
            }
        };
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        setError,
    } = useForm();

    useEffect(() => {
        if (data) {
            setValue('title', data.title);
            setValue('description', data.description);

            setSmallImage(data.smallImage);
            setLargeImage(data.largeImage);
            setPreviewSmallImage(data.smallImage);
            setPreviewLargeImage(data.largeImage);
        }
    }, [data, setValue]);

    const removeImage = (type) => {
        if (type === 'SMALL') {
            setSmallImage(null);
            setPreviewSmallImage(null);
        }
        if (type === 'LARGE') {
            setLargeImage(null);
            setPreviewLargeImage(null);
        }
    };

    const onSubmit = async (formData) => {
        if (!smallImage) {
            setError('images', { type: 'manual', message: 'Image is required' });
            return;
        }
        if (!largeImage) {
            setError('images', { type: 'manual', message: 'Image is required' });
            return;
        }
        formData.smallImage = smallImage;
        formData.largeImage = largeImage;
        if (data) {
            formData.id = data._id;
            await updateSiteData(formData, setSliders);
            setData(null);
            setSmallImage(null);
            setLargeImage(null);
            setPreviewSmallImage(null);
            setPreviewLargeImage(null);
            setValue('title', '');
            setValue('description', '');
        } else {
            await addSiteData(formData);
        }
    };

    return (
        <form className={style.productForm} onSubmit={handleSubmit(onSubmit)} >
            <div>

                <div className={style.formGroup}>
                    <label htmlFor="title">Title</label>
                    <input
                        id="title"
                        type="text"
                        placeholder="Enter title"
                        {...register('title', { required: 'Title is required' })}
                    />
                    {errors.title && <p className={style.error}>{errors.title.message}</p>}
                </div>

                <div className={style.formGroup}>
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        rows="3"
                        placeholder="Enter description"
                        {...register('description', { required: 'Description is required' })}
                    />
                    {errors.description && <p className={style.error}>{errors.description.message}</p>}
                </div>

                <div className={style.imageSection}>
                    {previewSmallImage && <div className={style.imageContainer}>
                        <MdClose onClick={() => removeImage('SMALL')} />
                        <img src={previewSmallImage} alt='productImage' />
                    </div>}
                    <input
                        id="smallImage"
                        type="file"
                        accept="image/*"
                        ref={smallImageRef}
                        onChange={(event) => handleImage(event, 'SMALL')}
                    />
                    {!smallImage && <div onClick={() => smallImageRef.current.click()} className={style.tempImage}>
                        <h2>Add Small Image</h2>
                    </div>}
                    {errors.images && <p className={style.error}>{errors.images.message}</p>}
                </div>

                <div className={style.imageSection}>
                    {previewLargeImage && <div className={style.imageContainer}>
                        <MdClose onClick={() => removeImage('LARGE')} />
                        <img src={previewLargeImage} alt='productImage' />
                    </div>}
                    <input
                        id="largeImage"
                        type="file"
                        accept="image/*"
                        ref={largeImageRef}
                        onChange={(event) => handleImage(event, 'LARGE')}
                    />
                    {!largeImage && <div onClick={() => largeImageRef.current.click()} className={style.tempImage}>
                        <h2>Add Large Image</h2>
                    </div>}
                    {errors.images && <p className={style.error}>{errors.images.message}</p>}
                </div>

                <button type="submit" className="border-round-btn">Save Slider</button>

            </div>

            <AllSliders sliders={sliders} setSliders={setSliders} setData={setData} />
        </form>
    );
};


const AllSliders = ({ sliders, setSliders, setData }) => {
    const editOption = (index) => {
        const option = sliders[index];
        setData(option);
    }

    const update = async (id, type) => {
        await updateSiteArrangements({ id, type }, setSliders);
    }

    return (
        <div className={style.productForm}>
            {sliders && sliders.length > 0 &&
                sliders.map((data, index) => (
                    <div key={index} className={style.singleSlide}>

                        <img src={data.smallImage} alt='small' />

                        <img src={data.largeImage} alt='large' />


                        <div style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0px' }} >
                            <h2>{data.title}</h2>
                            <p>{data.description}</p>
                        </div>
                        <div className={style.groupButtons}>
                            <button className='border-round-btn' type='button' onClick={() => update(data._id, 'UP')}><MdArrowUpward /></button>
                            <button className='border-round-btn' type='button' onClick={() => update(data._id, 'DOWN')}><MdArrowDownward /></button>
                            <button className='border-round-btn' type='button' onClick={() => editOption(index)}><MdEdit /></button>
                            <button className='border-round-btn' type='button' onClick={() => update(data._id, 'DELETE')}><MdDelete /></button>
                        </div>
                    </div>
                ))}
        </div>
    )
}

export default HomeSettings