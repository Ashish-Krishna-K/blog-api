import OutletSkeleton from './OutletSkeleton';
import './skeletons.css';

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
