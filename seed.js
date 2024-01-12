import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cities from './helpers/cities.js';
import { descriptors, places } from './helpers/seedHelpers.js';
import Campground from './models/campgrounds.js';
import { createApi } from 'unsplash-js';

main().catch((err) => console.log(err));

async function main() {
  dotenv.config();

  // Local or remote database?
  const args = process.argv;
  if (args.length < 3 || (args[2] !== 'local' && args[2] !== 'remote')) {
    console.log(`Usage:
      For local database connection run
        node seed.js local
      For remote database connection run
        node seed.js remote
    `);
    return;
  }
  const { MONGO_URL, MONGO_DB_NAME, UNSPLASH_API_KEY, LOCAL_DB_URL } =
    process.env;

  const dbOrigin = process.argv[2];
  console.log(`Connecting to ${dbOrigin} database`);

  if (process.argv[2] === 'remote') {
    await mongoose.connect(MONGO_URL, { dbName: MONGO_DB_NAME });
    console.log(`Mongoose connected to ${MONGO_DB_NAME} database.`);
  } else {
    await mongoose.connect(LOCAL_DB_URL);
    console.log('Mongoose connected to local database.');
  }

  // * GET 30 RANDOM PHOTOS FROM UNSPLASH API
  const unsplashAPI = createApi({ accessKey: UNSPLASH_API_KEY });

  const response = await unsplashAPI.search.getPhotos({
    query: 'campgrounds',
    orientation: 'landscape',
    perPage: 30,
    page: 1,
  });

  const photos = response.response.results;
  await seedDB(photos);
  mongoose.connection.close();
  console.log('Closed database connection');
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
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
      price: 'USD 100.00',
    });
    await camp.save();
  }
}
