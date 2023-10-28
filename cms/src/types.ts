export type TTokens = {
	accessToken: string;
	refreshToken: string;
};

export type TAuthor = {
	_id: string;
	firstName: string;
	lastName: string;
	id: string;
};

export type TPost = {
	_id: string;
	title: string;
	text: string;
	author: TAuthor;
	isPublished: boolean;
	comments: TComment[] | string[];
	createdAt: string;
	updatedAt: string;
	id: string;
};

export type TComment = {
	_id: string;
	text: string;
	author: string;
	createdOn: string;
	id: string;
};

export type PostsData = {
	previousCount: number;
	nextCount: number;
	posts: TPost[];
};

export type HomeLoaderPromise = {
	posts: Promise<PostsData>;
};

export type PostLoaderPromise = {
	post: Promise<TPost>;
};

export type TPostActionData = {
	formData: {
		title: string;
		text: string;
	};
	errors: Record<string, string>[];
};
