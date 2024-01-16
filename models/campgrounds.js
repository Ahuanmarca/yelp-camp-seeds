import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
  title: String,
  price: String,
  description: String,
  location: String,
  image: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

export default mongoose.model('Campground', CampgroundSchema);
