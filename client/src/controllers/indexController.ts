import type { NextFunction, Request, Response } from 'express';
import type { TAllPosts, TComment, TPost } from '../types';
import { getDateFormatted, getUnescapedHtml } from '../helpers';

// GET home page.
export const getHomePage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // create a queryString to query the API based on incoming query
    let queryString;
    if (req.query.cursor) {
      queryString = req.query.direction ? `?f=${req.query.cursor}&d=${req.query.direction}` : `?f=${req.query.cursor}`;
    } else {
      queryString = '';
    }
    const url = `${process.env.API_URI}/posts${queryString}`;
    const response = await fetch(url, { mode: 'cors' });
    const data = (await response.json()) as TAllPosts;
    if (!response.ok) throw new Error(response.statusText);
    const { posts } = data;
    // get the date values for previous and next cursors to be used for querying further.
    const previous = data.previousCount > 0 ? new Date(posts[0].createdAt).getTime() : undefined;
    const next = data.nextCount > 0 ? new Date(posts[posts.length - 1].createdAt).getTime() : undefined;
    // modify the raw data so that it's fit to be displayed to the user
    const modifiedPosts = posts.map((post) => ({
      ...post,
      text: getUnescapedHtml(post.text),
      createdAt: getDateFormatted(new Date(post.createdAt)),
      updatedAt: getDateFormatted(new Date(post.updatedAt)),
    }));
    return res.render('home', {
      title: 'Recent Posts',
      previous,
      next,
      posts: modifiedPosts,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

// Helper function to modify the comments so that it's fit to be displayed to the user.
const convertComments = (comment: TComment) => {
  if (typeof comment === 'object') {
    return {
      ...comment,
      text: getUnescapedHtml(comment.text),
      createdOn: getDateFormatted(new Date(comment.createdOn)),
    };
  } else {
    // in the case where the comment is only a string of the comment ID.
    return comment;
  }
};

// GET Single post page.
export const getSinglePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const postId = req.params.postId;
    const url = `${process.env.API_URI}/posts/${postId}`;
    const response = await fetch(url, { mode: 'cors' });
    const post = (await response.json()) as TPost;
    if (!response.ok) throw new Error(response.statusText);
    // modify the raw data so that it's fit to be displayed to the user
    const modifiedPost = {
      ...post,
      text: getUnescapedHtml(post.text),
      comments: post.comments.map(convertComments),
      createdAt: getDateFormatted(new Date(post.createdAt)),
      updatedAt: getDateFormatted(new Date(post.updatedAt)),
    };
    return res.render('singlePost', {
      title: modifiedPost.title,
      post: modifiedPost,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

// POST Add comment.
export const postAddCommentForm = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const postId = req.params.postId;
    const formData = { text: req.body.text, author: req.body.author };
    const submitUrl = `${process.env.API_URI}/posts/${postId}/comments`;
    const response = await fetch(submitUrl, {
      method: 'post',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    if (!response.ok) {
      if (response.status === 406) {
        // There is validation erros, show the same form again to the
        // user along with the error messages
        const fetchUrl = `${process.env.API_URI}/posts/${postId}`;
        const fetchResponse = await fetch(fetchUrl, { mode: 'cors' });
        const post = (await fetchResponse.json()) as TPost;
        if (!fetchResponse.ok) throw new Error(fetchResponse.statusText);
        const modifiedPost = {
          ...post,
          text: getUnescapedHtml(post.text),
          comments: post.comments.map(convertComments),
          createdAt: getDateFormatted(new Date(post.createdAt)),
          updatedAt: getDateFormatted(new Date(post.updatedAt)),
        };
        return res.render('singlePost', {
          title: modifiedPost.title,
          post: modifiedPost,
          ...data,
        });
      }
      if (response.status === 404) {
        // Post was not found, it was probably deleted redirect user back
        // to home page.
        return res.redirect('/');
      }
      throw new Error(response.statusText);
    } else {
      return res.redirect(`/post/${postId}`);
    }
  } catch (error) {
    console.error(error);
    return next(error);
  }
};
