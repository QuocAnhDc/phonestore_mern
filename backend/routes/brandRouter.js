import express from "express";
import expressAsyncHandler from "express-async-handler";
import Brand from "../models/brandModel.js";
import { isAuth, isAdmin } from "../utils.js";

const brandRouter = express.Router();

brandRouter.get(
  '/',
  async (req,res)=>{
    const brands = await Brand.find();
    res.send({
      brands
    });
  }
);

brandRouter.post(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req,res) => {
    const newBrand = new Brand({
      brand: 'brand-name' + Date.now(),
      description: 'something description',
    });
    const brand = await newBrand.save();
    res.send({
      message: 'Brand Created',
      brand,
    });
  })
);

brandRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const brandId = req.params.id;
    const brand = await Brand.findById(brandId);
    if (brand) {
      brand.brand = req.body.brand;
      brand.description = req.body.description;
      await brand.save();
      res.send({ message: 'Brand Updated' });
    } else {
      res.status(404).send({ message: 'Brand Not Found' });
    }
  })
);

const PAGE_SIZE = 3;

brandRouter.get(
  '/admin',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;

    const brands = await Brand.find()
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const countBrands = await Brand.countDocuments();
    res.send({
      brands,
      countBrands,
      page,
      pages: Math.ceil(countBrands / pageSize),
    });
  })
);

brandRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const brand = await Brand.findById(req.params.id);
    if (brand) {
      await brand.remove();
      res.send({ message: 'Brand Deleted' });
    } else {
      res.status(404).send({ message: 'Brand Not Found' });
    }
  })
);

brandRouter.get('/:id', async (req, res) => {
  const brand = await Brand.findById(req.params.id);
  if (brand) {
    res.send(brand);
  } else {
    res.status(404).send({ message: 'Brand Not Found' });
  }
});

export default brandRouter;