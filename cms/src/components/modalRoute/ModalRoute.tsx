import { FC, ReactNode, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ModalRoute.module.css';

type ModalRouteProps = {
	shouldOpen?: boolean;
	children: ReactNode;
};

const ModalRoute: FC<ModalRouteProps> = ({ shouldOpen = true, children }) => {
	const [isOpen, setIsOpen] = useState<boolean>(shouldOpen);
	const modalRef = useRef<HTMLDialogElement | null>(null);
	const navigate = useNavigate();
	useEffect(() => {
		setIsOpen(shouldOpen);
	}, [shouldOpen]);
	useEffect(() => {
		const modal = modalRef.current;
		if (modal) {
			isOpen ? modal.showModal() : modal.close();
		}
	}, [isOpen]);
	const closeModal = () => {
		setIsOpen(false);
		navigate(-1);
	};
	const handleEscapeBtnPress = (
		event: React.KeyboardEvent<HTMLDialogElement>,
	) => {
		if (event.key === 'Escape') {
			closeModal();
		}
	};
	return (
		<dialog
			ref={modalRef}
			onKeyDown={handleEscapeBtnPress}
			className={styles.modal}
		>
			{children}
		</dialog>
	);
};

export default ModalRoute;
