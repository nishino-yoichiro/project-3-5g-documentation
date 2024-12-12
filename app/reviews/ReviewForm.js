import React, { useState, useEffect } from 'react';
import styles from './ReviewForm.module.css';

/**
 * ReviewForm component that allows users to rate and comment on a menu item.
 * 
 * @param {Object} props - The props object.
 * @param {string} props.menuItemName - The name of the menu item being reviewed.
 * @param {Function} props.onRatingChange - The function to call when the rating changes.
 * @param {Function} props.onCommentChange - The function to call when the comment changes.
 * @returns {JSX.Element} - The rendered ReviewForm component.
 */
const ReviewForm = ({ menuItemName, onRatingChange, onCommentChange }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

    /**
   * Handles the change event for the rating input.
   * 
   * @param {number} star - The rating value.
   */
  const handleRatingChange = (star) => {
    setRating(star);
    onRatingChange(menuItemName, star);
  };

    /**
   * Handles the change event for the comment input.
   * 
   * @param {React.ChangeEvent<HTMLTextAreaElement>} e - The change event object.
   */
  const handleCommentChange = (e) => {
    const newComment = e.target.value;
    setComment(newComment);
    onCommentChange(menuItemName, newComment);
  };

  return (
    <div className={styles.reviewForm}>
      <h3>Rate {menuItemName}</h3>
      <div className={styles.rating}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={rating >= star ? styles.filled : ''}
            onClick={() => handleRatingChange(star)}
          >
            ★
          </button>
        ))}
      </div>
      <textarea
        className={styles.comment}
        value={comment}
        onChange={handleCommentChange}
        placeholder="Leave a comment"
      />
    </div>
  );
};

export default ReviewForm;