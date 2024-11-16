import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

export const SampleNextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className}`}
      style={{
        ...style,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      onClick={onClick}
    >
      <IoIosArrowForward
        size={30}
        color="#d4af37"
        className="search-next__arrow"
      />
    </div>
  );
};

export const SamplePrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className}`}
      style={{
        ...style,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      onClick={onClick}
    >
      <IoIosArrowBack
        size={30}
        color="#d4af37"
        className="search-prev__arrow"
      />
    </div>
  );
};
