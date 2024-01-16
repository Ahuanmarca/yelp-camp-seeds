import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cities from './helpers/cities.js';
import { descriptors, places } from './helpers/seedHelpers.js';
import Campground from './models/campgrounds.js';
import User from './models/user.js';
import { createApi } from 'unsplash-js';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import LocalStrategy from 'passport-local';

main().catch((err) => console.log(err));

async function main() {
  dotenv.config();
  const { MONGO_URL, MONGO_DB_NAME, UNSPLASH_API_KEY, LOCAL_DB_URL, SESSION_CONFIG_SECRET } =
    process.env;
  const args = process.argv;

  // I need the app to use 'passport'
  const app = express();

  const sessionConfig = {
    secret: SESSION_CONFIG_SECRET,
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

  // Connect to database
  await dbConnection(args, MONGO_URL, MONGO_DB_NAME, LOCAL_DB_URL);

  // First must create users
  await seedUsers();

  // Get photos from unsplash
  const photos = await getPhotos(UNSPLASH_API_KEY);

  // Get user id's from database (just created them) to use as foreign keys in the campgrounds
  const users = await User.find({}, { _id: 1 });
  // console.log(users);

  // When creating campgrounds, we need the photos array to fill the campgrounds images,
  // and we need the users _id's to use as foreing keys in the campgrounds
  await seedCampgrounds(photos, users);

  // Close mongoose connection
  mongoose.connection.close();
  console.log('Closed database connection');
}

const sample = (array) => array[Math.floor(Math.random() * array.length)];

async function getPhotos(UNSPLASH_API_KEY) {
  const unsplashAPI = createApi({ accessKey: UNSPLASH_API_KEY });
  const response = await unsplashAPI.search.getPhotos({
    query: 'campgrounds',
    orientation: 'landscape',
    perPage: 30,
    page: 1,
  });
  const photos = response.response.results;
  return photos;
}

async function seedCampgrounds(photos, users) {
  await Campground.deleteMany();
  for (let i = 0; i < 30; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const randomUser = Math.floor(Math.random() * 4);
    const camp = new Campground({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: photos[i].urls.regular,
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
      price: 'USD 100.00',
      author: users[randomUser]._id,
    });
    await camp.save();
  }
}

async function seedUsers() {
  await User.deleteMany();
  const usersArr = [
    {
      email: 'jane@jane.ja',
      username: 'jane',
      password: 'jane',
    },
    {
      email: 'alice@alice.al',
      username: 'alice',
      password: 'alice',
    },
    {
      email: 'bob@bob.bo',
      username: 'bob',
      password: 'bob',
    },
    {
      email: 'charlie@charlie.ch',
      username: 'charlie',
      password: 'charlie',
    },
  ];

  for (const userInfo of usersArr) {
    const { email, username, password } = userInfo;
    if (username) {
      const user = new User({ email, username });
      const newUser = await User.register(user, password);
      // console.log(newUser);
    }
  }
}

async function dbConnection(args, MONGO_URL, MONGO_DB_NAME, LOCAL_DB_URL) {
  // Check usage for 'local' or 'remote' argument
  if (args.length < 3 || (args[2] !== 'local' && args[2] !== 'remote')) {
    console.log(`Usage:
      For local database connection run
        node seed.js local
      For remote database connection run
        node seed.js remote
    `);
    return;
  }

  const dbOrigin = args[2];
  console.log(`Connecting to ${dbOrigin} database`);

  if (args[2] === 'remote') {
    await mongoose.connect(MONGO_URL, { dbName: MONGO_DB_NAME });
    console.log(`Mongoose connected to ${MONGO_DB_NAME} database.`);
  } else {
    await mongoose.connect(LOCAL_DB_URL);
    console.log('Mongoose connected to local database.');
  }
}
