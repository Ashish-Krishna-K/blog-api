import './skeletons.css';

// Skeleton loader for any page with potential posts list
const OutletSkeleton = () => {
	const dummy = [1, 2, 3, 4, 5];
	return (
		<div className="skeleton-container">
			<ul className="skeleton-list">
				{dummy.map((item) => (
					<li
						key={item}
						className="skeleton skeleton-listItem"
					>
						<div></div>
					</li>
				))}
			</ul>
		</div>
	);
};

export default OutletSkeleton;
