import React from "react";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";

const StarRating = ({ rating }) => {
  const maxStars = 5;

  return (
    <div className="product-detail__star-container">
      {Array.from({ length: maxStars }, (_, index) => {
        const starValue = index + 1;

        return (
          <span key={index} className="product-detail__star-icon">
            {/* Si la calificación es mayor o igual al valor de la estrella, mostramos estrella llena */}
            {rating >= starValue ? (
              <FaStar size={15} color="#ffc107" />
            ) : /* Si la calificación está a media estrella, mostramos media estrella */
            rating >= starValue - 0.5 ? (
              <FaStarHalfAlt size={15} color="#ffc107" />
            ) : (
              /* Si no, mostramos una estrella vacía */
              <FaStar size={15} color="#e4e5e9" />
            )}
          </span>
        );
      })}
    </div>
  );
};

export default StarRating;
