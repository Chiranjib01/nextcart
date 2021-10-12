import Layout from '../../../components-admin/Layout';
import styles from './style.module.scss';
import { useRouter } from 'next/router';
import axios from 'axios';
import actions from '../../../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import { getError } from '../../../utils/helpers';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { productSchema } from '../../../utils/yupSchema';
import { useEffect, useState } from 'react';
import Modal from '../../../components/Modal';
import Button from '../../../components/Button';
import CircularLoading from '../../../components/CircularLoading';

const CreateProduct = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [isFeaturedUploading, setIsFeaturedUploading] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const router = useRouter();
  const { adminInfo } = useSelector((state) => state.adminReducer);
  const dispatch = useDispatch();
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(productSchema),
  });
  const imageUploadHandler = async (file, fieldName) => {
    try {
      if (fieldName === 'image') {
        setIsImageUploading(true);
      }
      if (fieldName === 'featuredImage') {
        setIsFeaturedUploading(true);
      }
      let formData = new FormData();
      formData.append('file', file);
      const { data } = await axios.post(
        '/api/admin/products/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            authorization: `Bearer ${adminInfo.token}`,
            admin: adminInfo.email,
          },
        }
      );
      setValue(fieldName, data.secure_url);
      setIsImageUploading(false);
      setIsFeaturedUploading(false);
    } catch (err) {
      setIsImageUploading(false);
      setIsFeaturedUploading(false);
      dispatch(actions.showAlert(getError(err), 'error'));
    }
  };
  const submitHandler = async (body) => {
    try {
      setIsProcessing(true);
      const { data } = await axios.post(
        `/api/admin/products`,
        {
          name: body.name,
          category: body.category,
          image: body.image,
          isFeatured: body.isFeatured,
          featuredImage: body.featuredImage || null,
          price: body.price,
          brand: body.brand,
          countInStock: body.countInStock,
          description: body.description,
        },
        {
          headers: {
            authorization: `Bearer ${adminInfo.token}`,
            admin: adminInfo.email,
          },
        }
      );
      setIsProcessing(false);
      setValue('name', '');
      setValue('category', '');
      setValue('image', '');
      setValue('featuredImage', false);
      setValue('price', '');
      setValue('brand', '');
      setValue('countInStock', '');
      dispatch(actions.showAlert(data.message, 'success'));
    } catch (err) {
      setIsProcessing(false);
      dispatch(actions.showAlert(getError(err), 'error'));
    }
  };
  useEffect(() => {
    if (!adminInfo) {
      router.push('/');
    }
  }, []);
  useEffect(() => {
    if (
      errors.name ||
      errors.category ||
      errors.image ||
      errors.isFeatured ||
      errors.featuredImage ||
      errors.price ||
      errors.brand ||
      errors.countInStock ||
      errors.description
    ) {
      dispatch(
        actions.showAlert(
          errors.name?.message ||
            errors.category?.message ||
            errors.image?.message ||
            errors.isFeatured?.message ||
            errors.featuredImage?.message ||
            errors.price?.message ||
            errors.brand?.message ||
            errors.countInStock?.message ||
            errors.description?.message,
          'error'
        )
      );
    }
  }, [errors]);

  return (
    <Layout title="Create Product">
      <div className={styles.container}>
        {isProcessing && <div className={styles.processing} />}
        <Modal />
        <div className={styles.titleContainer}>
          <h1>Create Product</h1>
        </div>
        <form onSubmit={handleSubmit((data) => submitHandler(data))}>
          <div className={styles.formControl}>
            <label htmlFor="name">Name</label>
            <input
              placeholder="Enter Name"
              type="text"
              name="name"
              id="name"
              {...register('name')}
            />
          </div>
          <div className={styles.formControl}>
            <label htmlFor="category">Category</label>
            <input
              placeholder="Enter Category"
              type="text"
              name="category"
              id="category"
              {...register('category')}
            />
          </div>
          {/*  */}
          <div className={styles.formControl}>
            <label htmlFor="image">Image</label>
            <input
              type="text"
              placeholder="Image Url"
              name="image"
              id="image"
              {...register('image')}
            />
          </div>
          <div className={styles.formControl}>
            <label className={styles.uploadBtn} htmlFor="imageUpload">
              Upload Image
              <input
                type="file"
                id="imageUpload"
                onChange={(e) => imageUploadHandler(e.target.files[0], 'image')}
              />
            </label>
            {isImageUploading ? <CircularLoading /> : null}
          </div>
          <div className={styles.formControl}>
            <input
              name="isFeatured"
              id="isFeatured"
              type="checkbox"
              defaultChecked={isFeatured}
              onClick={() => setIsFeatured(!isFeatured)}
              // onChange={() => setIsFeatured(!isFeatured)}
              {...register('isFeatured')}
            />
            <label className={styles.inlineBlock} htmlFor="isFeatured">
              IsFeatured
            </label>
          </div>
          {isFeatured && (
            <>
              <div className={styles.formControl}>
                <label htmlFor="featuredImage">Featured Image</label>
                <input
                  placeholder="Featured Image Url"
                  id="featuredImage"
                  name="featuredImage"
                  type="text"
                  {...register('featuredImage')}
                />
              </div>
              <div className={styles.formControl}>
                <label
                  className={styles.uploadBtn}
                  htmlFor="featuredImageUpload"
                >
                  Featured Image
                  <input
                    type="file"
                    id="featuredImageUpload"
                    onChange={(e) =>
                      imageUploadHandler(e.target.files[0], 'featuredImage')
                    }
                  />
                </label>
                {isFeaturedUploading && <CircularLoading />}
              </div>
            </>
          )}
          {/*  */}
          <div className={styles.formControl}>
            <label htmlFor="price">Price</label>
            <input
              placeholder="Enter Price"
              type="number"
              name="price"
              id="price"
              {...register('price')}
            />
          </div>
          <div className={styles.formControl}>
            <label htmlFor="brand">Brand</label>
            <input
              placeholder="Enter Brand"
              type="text"
              name="brand"
              id="brand"
              {...register('brand')}
            />
          </div>
          <div className={styles.formControl}>
            <label htmlFor="countInStock">Count In Stock</label>
            <input
              placeholder="Count In Stock"
              type="number"
              name="countInStock"
              id="countInStock"
              {...register('countInStock')}
            />
          </div>
          <div className={styles.formControl}>
            <label htmlFor="description">Description</label>
            <input
              placeholder="Description"
              type="text"
              name="description"
              id="description"
              {...register('description')}
            />
          </div>
          <Button type="submit">Submit</Button>
        </form>
      </div>
    </Layout>
  );
};

export default CreateProduct;
