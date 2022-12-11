import mongoose from 'mongoose';

const discountSchema = new mongoose.Schema(
  {
    type: { type: String, required: true, unique: true },
    list_id_item_type:{
      id_item: { type: String, required: true ,unique:true}
    },
    percent_discount:{type: Number, required: true},
    date_start: { type: Date},
    date_end: {type: Date}

  },
  {
    timestamps: true,
  }
);

const Discount = mongoose.model('Discount', discountSchema);
export default Discount;