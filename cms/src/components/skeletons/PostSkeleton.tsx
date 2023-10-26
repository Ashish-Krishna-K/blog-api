import './skeletons.css';

const PostSkeleton = () => {
	const dummy = [1, 2, 3, 4, 5];
	return (
		<>
			<div className="skeleton skeleton-title"></div>
			<div className="skeleton skeleton-article"></div>
			<ul className="skeleton-list">
				{dummy.map((item) => (
					<li key={item}>
						<div className="skeleton skeleton-listItem"></div>
					</li>
				))}
			</ul>
		</>
	);
};

export default PostSkeleton;
