import { useRef } from 'react';
import {
	Form,
	useActionData,
	useNavigation,
	useNavigate,
} from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import { Editor as TinyMCEEditor } from 'tinymce';
import { TPostActionData } from '../../types';
import OutletSkeleton from '../skeletons/OutletSkeleton';
import styles from './CreatePost.module.css';

const CreatePost = () => {
	const navigate = useNavigate();
	const { state } = useNavigation();
	const editorRef = useRef<TinyMCEEditor | null>(null);
	const actionData = useActionData() as TPostActionData | Error | undefined;
	const errors =
		actionData && !(actionData instanceof Error) ? actionData.errors : null;
	const titleErrors = errors?.filter((error) => error.path === 'title');
	const textErrors = errors?.filter((error) => error.path === 'text');
	const handleCancel = () => {
		navigate(-1);
	};
	if (state !== 'idle') return <OutletSkeleton />;
	return (
		<>
			<h2>Add Post</h2>
			<Form
				method="post"
				className={styles.form}
			>
				<div className={styles.title}>
					<input
						type="text"
						name="title"
						id="title"
						placeholder="Post Title"
						required
						className={styles.titleInput}
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

export default CreatePost;
