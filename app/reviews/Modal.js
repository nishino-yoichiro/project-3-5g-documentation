import React from 'react';
import styles from './Modal.module.css';

/**
 * Modal component that displays a modal dialog.
 * 
 * @param {Object} props - The props object.
 * @param {boolean} props.isOpen - Indicates whether the modal is open.
 * @param {Function} props.onClose - The function to call when the modal is closed.
 * @param {React.ReactNode} props.children - The content to display inside the modal.
 * @returns {JSX.Element|null} - The rendered Modal component or null if the modal is not open.
 */
const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <button className={styles.closeButton} onClick={onClose}>X</button>
                {children}
            </div>
        </div>
    );
};

export default Modal;