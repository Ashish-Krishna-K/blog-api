import { NextFunction, Request, Response } from 'express';
import type { TAllPosts, TPost } from '../types';
import { getDateFormatted, getUnescapedHtml } from '../helpers';

export const getHomePage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const queryString = req.query.cursor
      ? req.query.direction
        ? `?f=${req.query.cursor}&d=${req.query.direction}`
        : `?f=${req.query.cursor}`
      : '';
    const url = `${process.env.API_URI}/posts${queryString}`;
    const response = await fetch(url, { mode: 'cors' });
    const data = (await response.json()) as TAllPosts;
    if (!response.ok) throw new Error(response.statusText);
    const { posts } = data;
    const previous = data.previousCount > 0 ? new Date(posts[0].createdAt).getTime() : undefined;
    const next = data.nextCount > 0 ? new Date(posts[posts.length - 1].createdAt).getTime() : undefined;
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

export const getSinglePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const postId = req.params.postId;
    const url = `${process.env.API_URI}/posts/${postId}`;
    const response = await fetch(url, { mode: 'cors' });
    const post = (await response.json()) as TPost;
    if (!response.ok) throw new Error(response.statusText);
    const modifiedPost = {
      ...post,
      text: getUnescapedHtml(post.text),
      comments: post.comments.map((comment) => {
        if (typeof comment === 'object') {
          return {
            ...comment,
            text: getUnescapedHtml(comment.text),
            createdOn: getDateFormatted(new Date(comment.createdOn)),
          };
        } else {
          return comment;
        }
      }),
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
        const fetchUrl = `${process.env.API_URI}/posts/${postId}`;
        const fetchResponse = await fetch(fetchUrl, { mode: 'cors' });
        const post = (await fetchResponse.json()) as TPost;
        if (!fetchResponse.ok) throw new Error(fetchResponse.statusText);
        const modifiedPost = {
          ...post,
          text: getUnescapedHtml(post.text),
          comments: post.comments.map((comment) => {
            if (typeof comment === 'object') {
              return {
                ...comment,
                text: getUnescapedHtml(comment.text),
                createdOn: getDateFormatted(new Date(comment.createdOn)),
              };
            } else {
              return comment;
            }
          }),
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
