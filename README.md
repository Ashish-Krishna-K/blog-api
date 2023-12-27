# blog-api

[Live Demo](https://blog-client-os1y.onrender.com)

A backend focused full-stack project for a blog built as part of [The Odin Project's](https://www.theodinproject.com) NodeJS course.

_This project was initially built during my first run of The Odin Project and can be viewed in this [old](https://github.com/Ashish-Krishna-K/blog-api/tree/old) branch. During my second run, I'm revisiting old projects and have chose to use TypsScript as a practice._

---

This project is split into 3 parts:

1. **The Backend API** - A REST API using Express.
2. **The Frontend CMS** - A React SPA with React-Router
3. **The Frontend Client website** - A dynamic Server rendered website using Express.

## The Backend API

The Backend is a simple REST API built using **Express** and **MongoDB** as the database. The project uses **Mongoose** Library as the ODM wrapper.

### API Endpoints

1. **api/signup(POST):** This is used for a user to signup as an admin, although currently there's only one admin as such there's no point of a signup feature it was implmented nevertheless for completion sake.

2. **api/login(POST):** The login route, The application uses a simple username/password login feature to authenticate the admin and returns a _JSON Web Token_ to the user, which the user needs to attach to all subsequent queries.
   In addition, the login action also saves the issued Refresh token as a valid token in the database to implement invalidation for logouts. The authentication is handled using **_PassportJS_** library.

3. **api/token(GET):** When the access token is no longer valid(as it's set to expire in 1 hour), the caller can then send a request to this endpoint with the refresh token attached. The route will vaildate the refresh token against the database and if it's valid sends back a new access Token to the user.

4. **api/logout(DELETE):** The logout route, this route will simply remove the refresh token saved in the database so if there is subsequent requests for a new access token it will be invalidated and the user will need to login again.

5. **api/posts:** The endpoint related to multiple post related actions, the behaviour of this endpoint is determined by the request method:

   1. **GET:** Returns a list of all posts 5 at a time, sorted in descending order(most recent post at first). This route further takes query params:
      - **f:** The _from_ cursor, this is supposed to be the last item of the current results so the next 5 results will be starting from this point.
      - **d:** An optional _direction_ query, this is included when the user wants to go back to the previous page and only the **_prev_** is accepted as value
   2. **POST:** This method is used when creating a new post, the body of the request must contain JSON encoded formData and the form data should include a **_title_** and **_text_** field. The **_text_** can be either HTML string or regular string.

6. **api/posts/:postId:** This endpoint pertains to single post items, once again the exact behaviour is determined by the request method.

    1. **GET:** Returns the single post that matches the _postId_ param. Used for viewing the entire post with comments.
    2. **PUT:** This method is used for editing the post itself, the request body must include the post data as JSON encoded.
    3. **DELETE:** Used for deleting the post and all associated comments, there will be no confirmation as it's expected to be handled by the client.

7. **api/posts/:postId/publish(PUT):** This endpoint has only one purpose that is to publish unpublished posts and conversely unpublish published posts.

8. **api/posts/:postId/comments(POST):** This endpoint is used for creating a new comment for the provided postId. The request body must include the JSON encoded formData and the formData must include a **_text_** field which pertains to the actual contents of the comment and a **_author_** field.

9. **api/posts/:postId/comments/:commentId(DELETE):** The endpoint to delete a comment, similar to post delete endpoint there is no confirmation.

## The Frontend CMS

This is a simple [**React**](https://react.dev/) SPA where [_react-router_](https://reactrouter.com/en/main) is used for client side navigation. Since the CMS is supposed to be used only by the admin, it is protected by login functionality. On intial page load, the admin is prompted to login. On successfull login, the admin can view a list of all posts, with the unpublished posts with lower opacity and under each post is a link to edit, publish/publish or delete the post. Clicking on the post title, the admin can view the whole post including the comments and against each comment there is an option to delete a comment. At the top of all pages is a nav bar with two links one to create a new post and another to logout. The create post and edit post uses [_TinyMce_](https://tiny.cloud) a WYSIWYG editor.

## The Frontend Client website

A very basic Server rendered dynamic website using Express, it has same layout as the CMS but since it's to viewed by the general public, there is no system of authentication and the readers cannot edit/delete posts. However the readers can choose to leave a comment against individual posts, which uses the previously mentioned [_TinyMce_](https://tiny.cloud) editor.

## Future plans

- The authentication system needs improvement as currently there is no way the admin can recover their account in the case they forgot their password.

- The CMS currently doesn't allow sign-ups as this is intended for only one admin blog, so it can be expanded by adding an additional sign-up page to let more than 1 admins for the blog.

- There is a plan to expand the CMS+API system as a seperate project in the form of a headless CMS which anyone can use to start their own blog by hooking up their own client websites.
