export type TAllPosts = {
  previousCount: number;
  nextCount: number;
  posts: TPost[];
};

export type TPost = {
  _id: string;
  title: string;
  text: string;
  author: TAuthor;
  comments: TComment[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
};

export type TAuthor = {
  _id: string;
  firstName: string;
  lastName: string;
  id: string;
};

export type TComment =
  | {
      _id: string;
      text: string;
      author: string;
      createdOn: string;
      __v: number;
      id: string;
    }
  | string;
