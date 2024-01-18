# YelpCamp Seed Database Script

This script fills my YelpCamp database with 30 randomly generated campgrounds.

Unsplash and unsplash-js package are used to get the images.

Unsplash API Key is needed. An error will occurr if none is provided.

.env.example

```
MONGO_URL=""
MONGO_DB_NAME=""
UNSPLASH_API_KEY=""
```

To seed local database:

```
node seed.js local
```

To seed cloud database:
```
node seed.js remote
```

Object returned from Unsplash API

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