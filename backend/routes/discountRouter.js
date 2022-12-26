import express from "express";
import expressAsyncHandler from "express-async-handler";
import Discount from "../models/discountModel.js";
import { isAuth, isAdmin } from "../utils.js";

const discountRouter = express.Router();

discountRouter.get(
  '/',
  async (req,res) =>{
    const discounts = await Discount.find();
    res.send({
      discounts
    });
  }
);

discountRouter.post(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req,res) => {
    const newDiscount = new Discount({
      type: 'ma-giam-gia' + Date.now(),
    });
    console.log(newDiscount);
    const discount = await newDiscount.save();
    res.send({
      message: 'Discount Created',
      discount,
    });
  })
);

discountRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const discountId = req.params.id;
    const discount = await Discount.findById(discountId);
    if (discount) {
      discount.type = req.body.type;
      discount.percent_discount = req.body.percent_discount;
      discount.date_start = req.body.date_start;
      discount.date_end = req.body.date_end;
      await discount.save();
      res.send({ message: 'Discount Updated' });
    } else {
      res.status(404).send({ message: 'Discount Not Found' });
    }
  })
);

const PAGE_SIZE = 8;

discountRouter.get(
  '/admin',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;

    const discounts = await Discount.find()
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const countDiscounts = await Discount.countDocuments();
    res.send({
      discounts,
      countDiscounts,
      page,
      pages: Math.ceil(countDiscounts / pageSize),
    });
  })
);

discountRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const discount = await Discount.findById(req.params.id);
    if (discount) {
      await discount.remove();
      res.send({ message: 'Discount Deleted' });
    } else {
      res.status(404).send({ message: 'Discount Not Found' });
    }
  })
);

discountRouter.get('/:id', async (req, res) => {
  const discount = await Discount.findById(req.params.id);
  if (discount) {
    res.send(discount);
  } else {
    res.status(404).send({ message: 'Discount Not Found' });
  }
});

export default discountRouter;