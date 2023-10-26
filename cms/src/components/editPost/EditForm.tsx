import { useEffect, useRef } from 'react';
import {
	Form,
	useActionData,
	useAsyncValue,
	useNavigate,
} from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import { Editor as TinyMCEEditor } from 'tinymce';
import { TPost, TPostActionData } from '../../types';
import parse from 'html-react-parser';
import styles from './EditPost.module.css';

const EditForm = () => {
	const navigate = useNavigate();
	const titleRef = useRef<HTMLInputElement | null>(null);
	const editorRef = useRef<TinyMCEEditor | null>(null);
	const post = useAsyncValue() as TPost | undefined;
	const actionData = useActionData() as TPostActionData | Error | undefined;
	const errors =
		actionData && !(actionData instanceof Error) ? actionData.errors : null;
	const titleErrors = errors?.filter((error) => error.path === 'title');
	const textErrors = errors?.filter((error) => error.path === 'text');
	useEffect(() => {
		if (titleRef.current) {
			titleRef.current.value = post?.title ?? '';
		}
	}, [titleRef, post?.title]);
	const handleCancel = () => {
		navigate(`/post/${post?.id}`);
	};
	if (typeof post === 'undefined') return <p>Post not found.</p>;
	return (
		<>
			<h2>Add Post</h2>
			<Form
				method="post"
				className={styles.form}
			>
				<div className={styles.title}>
					<input
						ref={titleRef}
						className={styles.titleInput}
						type="text"
						name="title"
						id="title"
						placeholder="title"
					/>
					{titleErrors && (
						<ul>
							{titleErrors.map((err, ind) => (
								<li key={ind}>{err.msg}</li>
							))}
						</ul>
					)}
				</div>
				<div className={styles.text}>
					<Editor
						tinymceScriptSrc={
							import.meta.env.BASE_URL + 'tinymce/tinymce.min.js'
						}
						onInit={(_evt, editor) => (editorRef.current = editor)}
						initialValue={parse(post.text) as string}
						textareaName="text"
						init={{
							height: 500,
							menubar: false,
							plugins: [
								'advlist',
								'autolink',
								'lists',
								'link',
								'image',
								'charmap',
								'anchor',
								'searchreplace',
								'visualblocks',
								'code',
								'fullscreen',
								'insertdatetime',
								'media',
								'table',
								'preview',
								'help',
								'wordcount',
							],
							toolbar:
								'undo redo | blocks | ' +
								'bold italic forecolor | alignleft aligncenter ' +
								'alignright alignjustify | bullist numlist outdent indent | ' +
								'removeformat | help',
							content_style:
								'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
							placeholder: 'Your text',
							content_css: 'dark',
						}}
					/>
					{textErrors && (
						<ul>
							{textErrors.map((err, ind) => (
								<li key={ind}>{err.msg}</li>
							))}
						</ul>
					)}
				</div>
				<button type="submit">Submit</button>
				<button
					type="button"
					onClick={handleCancel}
				>
					Cancel
				</button>
			</Form>
		</>
	);
};

export default EditForm;
