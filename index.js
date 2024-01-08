import dotenv from "dotenv";
import mongoose from "mongoose";
import cities from "./helpers/cities.js";
import { descriptors, places } from "./helpers/seedHelpers.js";
import Campground from "./models/campgrounds.js";
import { createApi } from "unsplash-js";

main().catch((err) => console.log(err));

async function main() {
  dotenv.config();
  const { MONGO_URL, MONGO_DB_NAME, UNSPLASH_API_KEY } = process.env;
  await mongoose.connect(MONGO_URL, { dbName: MONGO_DB_NAME });
  console.log(`Mongoose connected to ${MONGO_DB_NAME} database.`);

  // * GET 30 RANDOM PHOTOS FROM UNSPLASH API
  const unsplashAPI = createApi({ accessKey: UNSPLASH_API_KEY });

  const response = await unsplashAPI.search.getPhotos({
    query: "campgrounds",
    orientation: "landscape",
    perPage: 30,
    page: 1,
  });

  const photos = response.response.results;
  await seedDB(photos);
  mongoose.connection.close();
}

const sample = (array) => array[Math.floor(Math.random() * array.length)];

async function seedDB(photos) {
  await Campground.deleteMany();
  for (let i = 0; i < 30; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const camp = new Campground({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: photos[i].urls.regular,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!",
      price: "USD 100.00",
    });
    await camp.save();
  }
}
