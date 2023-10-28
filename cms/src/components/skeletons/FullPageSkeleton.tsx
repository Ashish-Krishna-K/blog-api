import OutletSkeleton from './OutletSkeleton';
import './skeletons.css';

// Skeleton loader for inital page load.
const FullPageSkeleton = () => {
	return (
		<>
			<div className="skeleton skeleton-header"></div>
			<div>
				<OutletSkeleton />
			</div>
		</>
	);
};

export default FullPageSkeleton;
