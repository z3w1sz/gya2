import { useEffect, useState } from "react";
import "./styles/Categories.css";
import { FaArrowRightLong } from "react-icons/fa6";
import { useBaseUrl } from "../../../context/BaseUrlContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Categories = () => {
  const { productsUrl } = useBaseUrl();
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    axios.get(productsUrl + "/categories").then((response) => {
      setCategories(response.data);
    });
  }, []);
  const navigate = useNavigate();
  const handleCategoryClick = (category) => {
    navigate(`/category/${category}`);
  };
  return (
    <div className="categories">
      <div className="categories__title">
        <h2>Categorías</h2>
      </div>
      <div className="categories__container">
        {categories.map((category, index) => {
          const indexList = [1, 3];
          const classNames = [
            "categorie",
            indexList.includes(index) ? "categorie--2" : "categorie--1",
          ].join(" ");
          return (
            <div className={classNames} key={index}>
              <div
                className="categorie__img"
                style={{
                  background: `linear-gradient(#0002, #0002), url("${category.subcategories[0].img}")`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }}
              >
                <div className="categorie__img-container">
                  <div
                    className="categorie__title"
                    onClick={() => {
                      handleCategoryClick(category.name);
                    }}
                  >
                    <h5>{category.name}</h5>
                  </div>
                  <div className="categorie__subtitle">
                    <div
                      className="categorie__subtitle-container"
                      onClick={() => {
                        handleCategoryClick(category.name);
                      }}
                    >
                      Ver más
                      <FaArrowRightLong />
                    </div>
                    <div className="categorie-subtitle__underline"></div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
