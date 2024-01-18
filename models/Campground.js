import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
  title: String,
  images: [
    {
      url: String,
      filename: String,
    }
  ],
  price: Number,
  description: String,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

export default mongoose.model('Campground', CampgroundSchema);
