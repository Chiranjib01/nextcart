import * as yup from 'yup';

const loginSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(6).max(16).required(),
});
const registerSchema = yup.object().shape({
  name: yup.string().min(2).max(20).required(),
  email: yup.string().email().required(),
  password: yup.string().min(6).max(16).required('password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'passwords must match'),
});
const profileSchema = yup.object().shape({
  name: yup.string().min(2).max(20).required(),
  email: yup.string().email().required(),
  password: yup.string(),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'passwords must match'),
});
const editUserSchema = yup.object().shape({
  name: yup.string().min(2).max(20).required(),
});

const shippingSchema = yup.object().shape({
  fullName: yup.string().min(2).max(30).required(),
  // mobileNumber: yup.number().positive().integer().min(10).required(),
  address: yup.string().required(),
  city: yup.string().required(),
  postalCode: yup.number().positive().integer().required(),
  country: yup.string().required(),
});
const productSchema = yup.object().shape({
  name: yup.string().max(50).required(),
  category: yup.string().required(),
  image: yup.string().required('Image is required'),
  isFeatured: yup.bool(),
  featuredImage: yup.string(),
  price: yup
    .number('Price should be number')
    .required('Price is required')
    .positive('Price should be positive'),
  brand: yup.string().required(),
  countInStock: yup
    .number('Count In Stock should be Number')
    .positive('Count In Stock should be Positive')
    .integer('Count In Stock should be Integer'),
  description: yup.string().required(),
});
export {
  loginSchema,
  registerSchema,
  profileSchema,
  editUserSchema,
  shippingSchema,
  productSchema,
};
