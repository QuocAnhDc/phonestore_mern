import express from "express";
import expressAsyncHandler from "express-async-handler";
import Category from "../models/categoryModel.js";
import { isAuth, isAdmin } from "../utils.js";

const categoryRouter = express.Router();

categoryRouter.get(
  '/',
  async (req,res)=>{
    const categories = await Category.find();
    res.send({
      categories:categories,
    });
  }
);

categoryRouter.post(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req,res) => {
    const newCategory = new Category({
      category: 'category-name' + Date.now(),
      description: 'something description',
    });
    const category = await newCategory.save();
    res.send({
      message: 'Category Created',
      category,
    });
  })
);

categoryRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const categoryId = req.params.id;
    const category = await Category.findById(categoryId);
    if (category) {
      category.category = req.body.category;
      category.description = req.body.description;
      await category.save();
      res.send({ message: 'Category Updated' });
    } else {
      res.status(404).send({ message: 'Category Not Found' });
    }
  })
);

const PAGE_SIZE = 8;

categoryRouter.get(
  '/admin',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;

    const categories = await Category.find()
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const countCategories = await Category.countDocuments();
    res.send({
      categories,
      countCategories,
      page,
      pages: Math.ceil(countCategories / pageSize),
    });
  })
);

categoryRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (category) {
      await category.remove();
      res.send({ message: 'Category Deleted' });
    } else {
      res.status(404).send({ message: 'Category Not Found' });
    }
  })
);

categoryRouter.get('/:id', async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (category) {
    res.send(category);
  } else {
    res.status(404).send({ message: 'Category Not Found' });
  }
});

export default categoryRouter;