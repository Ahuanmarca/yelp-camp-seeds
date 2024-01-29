/**
 * We use Unsplash to seed the database, and then...
 * we use Cloudinary for the users to upload their images
 * 
 * Problem: The URLs for the thumbnails have different patterns
 * I think the solution is to just store the thumbnail URLs in the database
 * 
 * Example of Cloudinary thumbnail
 * https://res.cloudinary.com/douqbebwk/image/upload/w_300/v1600113904/YelpCamp/gxgle1ovzd2f3dgcpass.png
 * 
 * Example of Unsplash thumbnail
 * https://images.unsplash.com/photo-1539644394832-360dec67528f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NDk4OTd8MHwxfHNlYXJjaHwzMHx8Y2FtcGdyb3VuZHN8ZW58MHwwfHx8MTcwNTYwNTQyN3ww&ixlib=rb-4.0.3&q=80&w=200
 * 
 * ALSO BE AWARE that we wont be able to delete the Unsplash images because they don't exist on our databse.
 * We can delete the references to them from the databse.
*/

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  origin: String,
  url: String,
  filename: String,
  unsplashThumbnail: String,
});

const CampgroundSchema = new Schema({
  title: String,
  // We need to follow geo-json pattern for location geometry
  geometry: {
    type: {
      type: String,
      enum: ['Point'],  // 'geometry.type' must be 'Point'
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    }
  },
  image: String,
  images: [ImageSchema],
  price: Number,
  description: String,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

export default mongoose.model('Campground', CampgroundSchema);
