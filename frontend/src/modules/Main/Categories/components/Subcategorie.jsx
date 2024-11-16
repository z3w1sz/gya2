import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBaseUrl } from "../../../../context/BaseUrlContext";
import "./styles/Subcategorie.css";
import { FaArrowRightLong } from "react-icons/fa6";

export const Subcategorie = () => {
  const { category } = useParams();
  const [subcategories, setSubcategories] = useState([]);
  const { productsUrl } = useBaseUrl();
  useEffect(() => {
    axios.get(productsUrl + `/category/${category}`).then((response) => {
      setSubcategories(response.data.subcategories);
    });
  }, []);

  const navigate = useNavigate();

  const handleSubcategoryClick = (subcategory) => {
    navigate(`/store/${subcategory}`);
  };
  return (
    <div className="subcategories">
      <div className="subcategories__title">
        <h2>{category}</h2>
      </div>
      <div className="subcategories__container">
        {subcategories.map((subcategory, index) => {
          return (
            <div className="subcategorie" key={index}>
              <div
                className="subcategorie__img"
                style={{
                  background: `linear-gradient(#0002, #0002), url("${subcategory.img}")`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }}
              >
                <div className="subcategorie__img-container">
                  <div className="subcategorie__title">
                    <h5>{subcategory.name}</h5>
                  </div>
                  <div className="subcategorie__subtitle">
                    <div
                      className="subcategorie__subtitle-container"
                      onClick={() => handleSubcategoryClick(subcategory.name)}
                    >
                      Ver más
                      <FaArrowRightLong />
                    </div>
                    <div className="subcategorie-subtitle__underline"></div>
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
