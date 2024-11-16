import { useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import "./SimpleSlider.css";

const SimpleSlider = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
  };

  return (
    <div className="slider">
      <div
        className="slider-image"
        style={{ backgroundImage: `url(${images[currentIndex]})` }}
      >
        <button onClick={goToPrevious} className="slider-button prev">
          <IoIosArrowBack fontSize="1.5rem" />
        </button>
        <button onClick={goToNext} className="slider-button next">
          <IoIosArrowForward fontSize="1.5rem" />
        </button>
      </div>

      <div className="slider-dots">
        {images.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentIndex ? "active" : ""}`}
            onClick={() => setCurrentIndex(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default SimpleSlider;
