import bcrypt from 'bcryptjs';

const data = {
  users: [
    {
      name: 'Admin',
      email: 'admin@eadmin.com',
      password: bcrypt.hashSync('123456'),
      isAdmin: true,
    },
    {
      name: 'User',
      email: 'user@user.com',
      password: bcrypt.hashSync('123456'),
      isAdmin: false,
    },
  ],
  products: [
    {
      // _id: '1',
      name: 'Iphone 11',
      slug: 'iphone11',
      category: 'SmartPhone',
      image: '/images/p1.jpg', // 679px × 829px
      price: 120,
      countInStock: 10,
      brand: 'Apple',
      rating: 4.5,
      numReviews: 10,
      description: 'high quality phone',
    },
    {
      // _id: '2',
      name: 'Iphone 12',
      slug: 'iphone12',
      category: 'SmartPhone',
      image: '/images/p2.png', // 679px × 829px
      price: 120,
      countInStock: 10,
      brand: 'Apple',
      rating: 4.5,
      numReviews: 10,
      description: 'high quality phone',
    },
    {
      // _id: '3',
      name: 'Iphone 14',
      slug: 'iphone14',
      category: 'SmartPhone',
      image: '/images/p3.jpg', // 679px × 829px
      price: 120,
      countInStock: 10,
      brand: 'Apple',
      rating: 4.5,
      numReviews: 10,
      description: 'high quality phone',
    },
    {
      // _id: '4',
      name: 'SamSung G20',
      slug: 'samsung20',
      category: 'SmartPhone',
      image: '/images/p4.jpg', // 679px × 829px
      price: 120,
      countInStock: 10,
      brand: 'SamSung',
      rating: 4.5,
      numReviews: 10,
      description: 'high quality phone',
    },
  ],
};
export default data;
