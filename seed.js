import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cities from './helpers/cities.js';
import { descriptors, places } from './helpers/seedHelpers.js';
import Campground from './models/Campground.js';
import User from './models/User.js';
import { createApi } from 'unsplash-js';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import fallbackConfig from './helpers/fallbackConfig.js';

main().catch((err) => console.log(err));

async function main() {
  dotenv.config();
  const config = Object.assign(
    {},
    {
      MONGO_URL:                    process.env.MONGO_URL             || fallbackConfig.MONGO_URL,
      MONGO_DB_NAME:                process.env.MONGO_DB_NAME         || fallbackConfig.MONGO_DB_NAME,
      UNSPLASH_API_KEY:             process.env.UNSPLASH_API_KEY      || fallbackConfig.UNSPLASH_API_KEY,
      LOCAL_DB_URL:                 process.env.LOCAL_DB_URL          || fallbackConfig.LOCAL_DB_URL,
      SESSION_CONFIG_SECRET:        process.env.SESSION_CONFIG_SECRET || fallbackConfig.SESSION_CONFIG_SECRET,
    }
  );
  if (Object.values(config).some((n) => n === undefined || n === "")) {
    console.log({
      Error:
        'Environmental variables are missing. Please provide them on a .env file or in the /helpers/fallbackConfig.js file',
    });
    // Missing environmental variables cause early return
    return;
  }

  const args = process.argv;
  config.CONNECTION = args[2];
  config.CAMPGROUNDS_NUMBER = args[3] || 50;

  const conditions =
    args.length >= 3 &&
    args.length <= 4 &&
    (args[2] === 'local' || args[2] === 'remote') &&
    (args[3] === undefined ||
      (typeof Number(args[3]) === 'number' && Number(args[3]) <= 200));

  if (!conditions) {
    console.log(`
    For local database run:

      node seed.js local

    For remote database run:

      node seed.js remote
    
    To specify the number of campgrounds, pass a second argument.
    Default is 50, maximum is 200 (should be an int).

      node seed.js local 100

    `);
    // Invalid arguments causes early return
    return;
  }

  console.log({ config });

  // I need the app to use 'passport'
  const app = express();

  const sessionConfig = {
    secret: config.SESSION_CONFIG_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  };
  app.use(session(sessionConfig));

  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(new LocalStrategy(User.authenticate()));
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());

  /**
   * Seeding steps:
   * - Connect to database (local or remote)
   * - Seed Users
   * - Get photos from Unsplash
   * - Seed Campgrounds (need photos and users)
   * - Close connection and console.log results!
   */

  await dbConnection(config);
  const users = await seedUsers(['alice', 'bob', 'charlie']);
  const photos = await getPhotos(config);
  const campgrounds = await seedCampgrounds(photos, users);

  mongoose.connection.close();
  console.log({
    seeded: { users: users.length, campgrounds: campgrounds.length },
  });
  console.log('Closed database connection');
}

const sample = (array) => array[Math.floor(Math.random() * array.length)];

async function getPhotos(
  config,
  query = 'campgrounds',
  orientation = 'landscape',
  perPage = 30
) {
  const unsplashAPI = createApi({ accessKey: config.UNSPLASH_API_KEY });
  const pages = Math.floor(config.CAMPGROUNDS_NUMBER / perPage);
  const lastPage = config.CAMPGROUNDS_NUMBER % perPage;
  const promises = [];

  // Request 30 photos per page
  if (pages >= 1) {
    for (let i = 0; i < pages; i++) {
      promises.push(
        unsplashAPI.search.getPhotos({
          query: query,
          orientation: orientation,
          perPage: perPage, // 30 === Unsplah API limit?
          page: i + 1,
        })
      );
    }
  }

  // Request photos from lastPage
  if (lastPage >= 1) {
    promises.push(
      unsplashAPI.search.getPhotos({
        query: query,
        orientation: orientation,
        perPage: lastPage,
        page: 1,
      })
    );
  }

  const response = await Promise.all(promises);
  const photos = response.map((r) => r.response.results); // This nesting is confusing
  return photos.flat(); // 'photos' is an array of arrays
}

// Creates as many campgrounds as we have photos from unsplash
async function seedCampgrounds(photos, users) {
  console.log({ deletedCampgrounds: await Campground.deleteMany() });
  const campgroundsArray = photos.map((photo) => {
    const random1000 = Math.floor(Math.random() * 1000);
    const randomUser = Math.floor(Math.random() * users.length);
    const campground = {
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      geometry: {
        type: 'Point',
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
      price: Math.round((Math.random() * 100 + 20) * 100) / 100,
      author: users[randomUser]._id,
      image: photo.urls.regular,
      images: [
        {
          origin: 'unsplash',
          url: photo.urls.regular,
          filename: photo.slug,
          unsplashThumbnail: photo.urls.thumb,
        },
      ],
    };
    console.debug(campground);
    return campground;
  });
  return await Campground.insertMany(campgroundsArray);
}

async function seedUsers(names = ['alice', 'bob', 'charlie']) {
  console.log({ deletedUsers: await User.deleteMany() });
  return await Promise.all(
    names.map(async (name) => {
      const email = `${name}@${name}.${name.slice(0, 2)}`;
      const username = name;
      const password = name;
      const user = new User({ email, username });
      return User.register(user, password);
    })
  );
}

async function dbConnection(config) {
  const dbOrigin = config.CONNECTION;
  console.log(`Connecting to ${dbOrigin} database`);

  switch (dbOrigin) {
    case 'remote':
      await mongoose.connect(config.MONGO_URL, {
        dbName: config.MONGO_DB_NAME,
      });
      console.log(`Mongoose connected to ${config.MONGO_DB_NAME} database.`);
      break;
    case 'local':
      await mongoose.connect(config.LOCAL_DB_URL);
      console.log('Mongoose connected to local database.');
      break;
    default:
      console.log('Something went wrong with the connection!');
  }
}
