import mongoose from 'mongoose';

const discountSchema = new mongoose.Schema(
  {
    type: { type: String},
    percent_discount:{type: Number},
    date_start: { type: Date},
    date_end: {type: Date}

  },
  {
    timestamps: true,
  }
);

const Discount = mongoose.model('Discount', discountSchema);
export default Discount; 