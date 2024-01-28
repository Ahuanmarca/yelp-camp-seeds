# YelpCamp Seed Database Script

To be used with with Colt Steele's YelpCamp project, from the 'Web Developer Bootcamp' course.
https://www.udemy.com/course/the-web-developer-bootcamp/

Attempts to improve the 'seed database' script used by Colt.

- Instead of using one random image that repeats in every campground, requests a different image for every campground.

- Creates 3 toy users: 'alice', 'bob' and 'charlie', with passwords equal to their names.

- Creates up to 200 campgrounds (50 by default). Each campground is created by one of the users, so we can test authentication and authorization.

## Configuration

You need to provide some environmental variables. You can do so by creating an `.env` file at the root of this directory, or by editing `/helpers/fallbackConfig.js`.

At the very least you will need to provide the `UNSPLASH_API_KEY`. Set up an Unsplash Developer API to get it: https://unsplash.com/developers

You can leave `LOCAL_DB_URL` and `SESSION_CONFIG_SECRET` as they are.

You don't need to provide `MONGO_URL` and `MONGO_DB_NAME` if you are not using a cloud database (i.e. you are following the bootcamp from the beginning), but you will get an error if you run the script with the 'remote' option.

The script will try to use .env first, then fallbackConfig.js.

`.env` example
```
MONGO_URL=""
MONGO_DB_NAME=""
UNSPLASH_API_KEY=""
LOCAL_DB_URL="mongodb://localhost:27017/yelp-camp-2024"
SESSION_CONFIG_SECRET="youWillNeverGuess"
```

`fallbackConfig.js` example
``` js
const fallbackConfig = {
  MONGO_URL: 'fakeUrl',                   // optional unless seeding cluod db
  MONGO_DB_NAME: 'fakeDbName',            // optional unless seeding cloud db
  UNSPLASH_API_KEY: '',                   // NEEDED, get one at https://unsplash.com/developers
  LOCAL_DB_URL: 'mongodb://localhost:27017/yelp-camp-2024',   // you may leave this
  SESSION_CONFIG_SECRET: 'youWillNeverGuess',                 // you may leave this
};
```

## Usage

Once configuration is done, you may run:

```
npm install
```

Then...

To seed local database:

```
node seed.js local
```

To seed cloud database (Atlas):

```
node seed.js remote
```

Pass a second argument to specify the number of campgrounds
Default is 50, maximum is 200 (should be an int).
To create 100 campgrounds run:

```
node seed.js local 100
```

## Known issues:

- On "Section 54: Image Upload - Lecture 557: Adding a Thumbnail Virtual Property" you will create a virtual property on the Campground model to display thumbnails of your uploaded images. This virtual property uses a Cloudinary URL, which is different from Unsplash thumbnail URLs. Because of this, thumbnails seeded with this script won't display correctly.

## Etc

Object returned from Unsplash API (for reference)

```
{
    id: 'T3VJj26CIKk',
    slug: 'silhouette-of-tree-during-golden-hour-T3VJj26CIKk',
    created_at: '2018-10-15T23:02:06Z',
    updated_at: '2024-01-18T02:10:30Z',
    promoted_at: null,
    width: 5893,
    height: 3929,
    color: '#260c0c',
    blur_hash: 'LXEorbayRij@~qj[Rja|9zofRka}',
    description: 'Sunset in Sam’s Throne',
    alt_description: 'silhouette of tree during golden hour',
    breadcrumbs: [],
    urls: {
      raw: 'https://images.unsplash.com/photo-1539644394832-360dec67528f?ixid=M3w1NDk4OTd8MHwxfHNlYXJjaHwzMHx8Y2FtcGdyb3VuZHN8ZW58MHwwfHx8MTcwNTYwNTQyN3ww&ixlib=rb-4.0.3',
      full: 'https://images.unsplash.com/photo-1539644394832-360dec67528f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w1NDk4OTd8MHwxfHNlYXJjaHwzMHx8Y2FtcGdyb3VuZHN8ZW58MHwwfHx8MTcwNTYwNTQyN3ww&ixlib=rb-4.0.3&q=85',
      regular: 'https://images.unsplash.com/photo-1539644394832-360dec67528f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NDk4OTd8MHwxfHNlYXJjaHwzMHx8Y2FtcGdyb3VuZHN8ZW58MHwwfHx8MTcwNTYwNTQyN3ww&ixlib=rb-4.0.3&q=80&w=1080',
      small: 'https://images.unsplash.com/photo-1539644394832-360dec67528f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NDk4OTd8MHwxfHNlYXJjaHwzMHx8Y2FtcGdyb3VuZHN8ZW58MHwwfHx8MTcwNTYwNTQyN3ww&ixlib=rb-4.0.3&q=80&w=400',
      thumb: 'https://images.unsplash.com/photo-1539644394832-360dec67528f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NDk4OTd8MHwxfHNlYXJjaHwzMHx8Y2FtcGdyb3VuZHN8ZW58MHwwfHx8MTcwNTYwNTQyN3ww&ixlib=rb-4.0.3&q=80&w=200',
      small_s3: 'https://s3.us-west-2.amazonaws.com/images.unsplash.com/small/photo-1539644394832-360dec67528f'
    },
    links: {
      self: 'https://api.unsplash.com/photos/silhouette-of-tree-during-golden-hour-T3VJj26CIKk',
      html: 'https://unsplash.com/photos/silhouette-of-tree-during-golden-hour-T3VJj26CIKk',
      download: 'https://unsplash.com/photos/T3VJj26CIKk/download?ixid=M3w1NDk4OTd8MHwxfHNlYXJjaHwzMHx8Y2FtcGdyb3VuZHN8ZW58MHwwfHx8MTcwNTYwNTQyN3ww',
      download_location: 'https://api.unsplash.com/photos/T3VJj26CIKk/download?ixid=M3w1NDk4OTd8MHwxfHNlYXJjaHwzMHx8Y2FtcGdyb3VuZHN8ZW58MHwwfHx8MTcwNTYwNTQyN3ww'
    },
    likes: 12,
    liked_by_user: false,
    current_user_collections: [],
    sponsorship: null,
    topic_submissions: {},
    user: {
      id: 'zNUVcXzP6Bk',
      updated_at: '2023-09-13T04:26:21Z',
      username: 'phodskins',
      name: 'Patrick Hodskins',
      first_name: 'Patrick',
      last_name: 'Hodskins',
      twitter_username: null,
      portfolio_url: null,
      bio: 'just having fun with it\r\n instagram: patrickhodskins ',
      location: 'Fayetteville, Arkansas',
      links: [Object],
      profile_image: [Object],
      instagram_username: 'patrickhodskins',
      total_collections: 1,
      total_likes: 73,
      total_photos: 216,
      total_promoted_photos: 21,
      accepted_tos: true,
      for_hire: true,
      social: [Object]
    },
    tags: [ [Object], [Object], [Object] ]
  }
```