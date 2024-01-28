// You can edit this file to provide the needed variables for the script to run.
const fallbackConfig = {
  MONGO_URL: 'fakeUrl',                   // optional unless seeding cluod db
  MONGO_DB_NAME: 'fakeDbName',            // optional unless seeding cloud db
  UNSPLASH_API_KEY: '',                   // NEEDED, get one at https://unsplash.com/developers
  LOCAL_DB_URL: 'mongodb://localhost:27017/yelp-camp-2024',   // you may leave this
  SESSION_CONFIG_SECRET: 'youWillNeverGuess',                 // you may leave this
};

export default fallbackConfig;
