/*
Post model needs to have the following:
  created_by_name
  created_at(not shown to user/only shown to creator)
  published_at
  title
  content
  comments(stored as array of comment references in db)
  published(boolean/only accessed by creator/if set to true show in client website)
*/