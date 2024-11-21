import { useEffect, useState } from "react";
import "./styles/Secure.css";
import { LuImagePlus } from "react-icons/lu";
import { MdClose, MdDelete } from "react-icons/md";
import { AiOutlineFullscreen } from "react-icons/ai";
import { FaPercentage, FaDollarSign } from "react-icons/fa";
import { usePopup } from "../../../context/PopupContext";
import { useForm } from "../../../hooks/useForm";
import { IoIosAdd } from "react-icons/io";
import { useBaseUrl } from "../../../context/BaseUrlContext";
import { FaCheck } from "react-icons/fa";
import axios from "axios";

export const Secure = () => {
  const { productsUrl } = useBaseUrl();

  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [imageSrcs, setImageSrcs] = useState([]);
  const [imageNames, setImageNames] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [fieldEmpty, setFieldEmpty] = useState({
    name: false,
    category: false,
    subcategory: false,
    material: false,
    price: false,
  });
  const [isCompleted, setIsCompleted] = useState(false);
  const [images, setImages] = useState([]);
  const [isError, setIsError] = useState("");
  const [error, setError] = useState("");

  const extractCodeFromFilename = (filename) => {
    const match = filename.match(/(\d+)_\d+\.jpg$/);
    return match ? match[1] : null; // Retorna el código o null si no hay coincidencia
  };

  const initialState = {
    name: "",
    description: "",
    category: "",
    subcategory: "",
    material: "",
    images: [],
    price: "",
    discount: "",
    code: "",
  };

  const { formState, setFormState, onInputChange } = useForm(initialState);

  const {
    name,
    description,
    category,
    subcategory,
    material,
    price,
    discount,
  } = formState;

  const handleQuitAll = () => {
    setFormState(initialState);
  };

  const verifyForm = () => {
    const requiredFields = {
      name,
      category,
      subcategory,
      material,
      price,
    };

    // Verificar si algún campo requerido está vacío
    const emptyFields = Object.entries(requiredFields).filter(
      ([key, value]) => value.trim() === ""
    );

    // Resetear los campos vacíos
    const updatedFieldEmpty = {
      name: false,
      category: false,
      subcategory: false,
      material: false,
      price: false,
    };

    if (emptyFields.length > 0) {
      emptyFields.forEach(([key]) => {
        updatedFieldEmpty[key] = true; // Marcar el campo como vacío
      });
      setFieldEmpty(updatedFieldEmpty);
      return false; // Indica que hay campos vacíos
    }

    setFieldEmpty(updatedFieldEmpty); // Todos los campos son válidos
    return true; // Todos los campos obligatorios están completos
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!verifyForm()) {
      setIsCompleted(false);
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
      return; // Detener el envío si hay campos vacíos
    }
    const productCode = extractCodeFromFilename(imageNames[0]);
    imageNames.map((filename) => {
      images.push(`https://aretoaccesorios.com/img/${filename}`);
    });
    axios
      .post(productsUrl, {
        ...formState,
        code: productCode,
        images,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        setIsError(true);
        setError(error.response.data.detail.error);
        setIsCompleted(false);
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
      });
    setImageSrcs([]);
    setImageNames([]);
    setImages([]);
    setFormState(initialState);
    setIsCompleted(true);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  const { setPopup } = usePopup();

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImageSrcs = [];
    const newImageNames = [];

    files.forEach((file) => {
      if (file) {
        newImageNames.push(file.name);

        const reader = new FileReader();
        reader.onloadend = () => {
          newImageSrcs.push(reader.result);
          if (newImageSrcs.length === files.length) {
            setImageSrcs((prevSrcs) => [...prevSrcs, ...newImageSrcs]);
            setImageNames((prevNames) => [...prevNames, ...newImageNames]);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  // Función para eliminar imágenes
  const handleDeleteImage = (index) => {
    setImageSrcs((prevSrcs) => prevSrcs.filter((_, i) => i !== index));
    setImageNames((prevNames) => prevNames.filter((_, i) => i !== index));
  };

  // Función para abrir el modal con la imagen completa
  const handleOpenModal = (src) => {
    setPopup(true);
    setSelectedImage(src);
    setIsModalOpen(true);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setPopup(false);
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  const [categories, setCategories] = useState([]);

  const getCategories = () => {
    axios.get(productsUrl + "/categories").then((response) => {
      setCategories(response.data);
    });
  };

  const [percentage, setPercentage] = useState(0);

  const handleChange = (e) => {
    setPercentage(e.target.value);
  };

  const handleAddPercentageClick = () => {
    setFormState({
      ...formState,
      price: (
        parseInt(price) +
        parseInt(price) * (parseInt(percentage) / 100)
      ).toString(),
    });
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <div className="secure">
      <h2>Añadir producto</h2>
      <form className="secure__main-wrapper" onSubmit={handleSubmit}>
        <div className="secure__container">
          <div>
            <h3>Descripción</h3>
            <div className="secure-info__wrapper">
              <label htmlFor="secure-description-name">
                Nombre del producto
              </label>
              <input
                type="text"
                id="secure-description-name"
                placeholder="Anillo amina"
                onChange={onInputChange}
                name="name"
                value={name}
                className={`${fieldEmpty.name ? "secure-input__empty" : ""} ${
                  name.trim() !== "" ? "secure-input__completed" : ""
                }`}
              />
              <label htmlFor="secure-description-description">
                Descripción del producto (opcional)
              </label>
              <textarea
                type="text"
                id="secure-description-description"
                placeholder="El Anillo Amina es la elección perfecta para quienes buscan un accesorio elegante y versátil. Fabricado con acero quirúrgico de alta calidad. Su diseño abierto proporciona comodidad y adaptabilidad, permitiendo que se ajuste fácilmente al tamaño de tu dedo."
                onChange={onInputChange}
                name="description"
                value={description}
                className={fieldEmpty.description && "secure-input__empty"}
              />
            </div>
          </div>
          <div>
            <h3>Categoría</h3>
            <div className="secure-info__wrapper">
              <label htmlFor="secure-category">Categoría del producto</label>
              <select
                id="secure-category"
                onChange={onInputChange}
                name="category"
                value={category}
                className={`${
                  fieldEmpty.category ? "secure-input__empty" : ""
                } ${category.trim() !== "" ? "secure-input__completed" : ""}`}
              >
                <option value="" disabled>
                  Selecciona una categoría
                </option>
                {categories.map((category, index) => (
                  <option key={index} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>

              <label
                htmlFor="secure-subcategory"
                className="secure-subcategory__label"
              >
                Subcategoría del producto
              </label>
              <select
                id="secure-subcategory"
                onChange={onInputChange}
                name="subcategory"
                value={subcategory}
                className={`${
                  fieldEmpty.subcategory ? "secure-input__empty" : ""
                } ${
                  subcategory.trim() !== "" ? "secure-input__completed" : ""
                }`}
                disabled={!category}
              >
                {categories
                  .find((category_db) => category_db.name === category)
                  ?.subcategories.map((subcategory_db, index) => (
                    <option key={index} value={subcategory_db.name}>
                      {subcategory_db.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div>
            <h3>Material</h3>
            <div className="secure-info__wrapper">
              <label htmlFor="secure-material">Material del producto</label>
              <input
                type="text"
                list="secure-material"
                onChange={onInputChange}
                name="material"
                value={material}
                placeholder="Acero quirurgico"
                className={`${
                  fieldEmpty.material ? "secure-input__empty" : ""
                } ${material.trim() !== "" ? "secure-input__completed" : ""}`}
              />
              <datalist id="secure-material">
                <option value="Acero quirurgico">Acero quirurgico</option>
                <option value="Acero dorado">Acero dorado</option>
                <option value="Acero blanco">Acero blanco</option>
                <option value="Malla de ecocuero">Malla de ecocuero</option>
                <option value="Plata 925">Plata 925</option>
              </datalist>
            </div>
          </div>
        </div>
        <div className="secure__container">
          <div>
            <h3>Imágenes</h3>
            <div className="secure-info__wrapper info-wrapper__image">
              <input
                id="secure-image-input"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                multiple // Permitir múltiples archivos
              />
              <label
                htmlFor="secure-image-input"
                className="secure-image__label"
              >
                <div className="secure-info__upload-button">
                  <LuImagePlus fontSize="1.8rem" />
                  <a>Subir imagenes</a>
                </div>
              </label>
              {imageSrcs.map((src, index) => (
                <div
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  key={index}
                  className="secure-image"
                  style={
                    hoveredIndex === index
                      ? {
                          backgroundImage: `linear-gradient(#0002, #0002), url(${src})`,
                          backgroundPosition: "center",
                          backgroundSize: "cover",
                        }
                      : {
                          backgroundImage: `url(${src})`,
                        }
                  }
                >
                  {hoveredIndex === index && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleOpenModal(src)}
                      >
                        <AiOutlineFullscreen fontSize="1.2rem" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(index)}
                      >
                        <MdDelete fontSize="1.2rem" />
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3>Precio</h3>
            <div className="secure-info__wrapper secure-info--price">
              <div>
                <div className="secure-price__wrapper">
                  <label htmlFor="secure-price">Precio</label>
                  <label
                    htmlFor="secure-price"
                    className={
                      "secure__price-container " +
                      `${fieldEmpty.price ? "secure-input__empty" : ""} ${
                        price.trim() !== "" ? "secure-input__completed" : ""
                      }`
                    }
                  >
                    <div className="secure-price__icon">
                      <FaDollarSign fontSize="1.2rem" />
                    </div>
                    <input
                      type="number"
                      id="secure-price"
                      min={1}
                      placeholder="1280"
                      onChange={onInputChange}
                      name="price"
                      value={price}
                    />
                  </label>
                </div>
                <div className="secure-price__wrapper secure-wrapper--discount">
                  <label htmlFor="secure-discount">Descuento (opcional)</label>
                  <label
                    htmlFor="secure-discount"
                    className="secure__price-container"
                  >
                    <div className="secure-price__icon">
                      <FaDollarSign fontSize="1.2rem" />
                    </div>
                    <input
                      type="number"
                      id="secure-discount"
                      min={1}
                      placeholder="200"
                      onChange={onInputChange}
                      name="discount"
                      value={discount}
                    />
                  </label>
                </div>
              </div>
              <div className="secure-info__add-percentage">
                <div className="secure-price__wrapper secure-wrapper--percentage">
                  <div>
                    <label htmlFor="secure-percentage">Sumar porcentaje</label>
                    <label
                      htmlFor="secure-percentage"
                      className="secure__price-container secure__percentage--container"
                    >
                      <div className="secure-price__icon">
                        <FaPercentage fontSize="1.2rem" />
                      </div>
                      <input
                        type="number"
                        id="secure-percentage"
                        min={1}
                        placeholder="80"
                        name="percentage"
                        onChange={handleChange}
                      />
                    </label>
                  </div>
                  <button
                    type="button"
                    className="secure-percentage__button"
                    onClick={handleAddPercentageClick}
                  >
                    <IoIosAdd fontSize="1.3rem" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="secure__product-buttons">
            <button type="button" onClick={handleQuitAll}>
              Descartar
            </button>
            <button type="submit">Añadir producto</button>
          </div>
        </div>
      </form>
      {isModalOpen && (
        <div className="secure-popup">
          <div
            className="secure-popup__img"
            style={{ backgroundImage: `url(${selectedImage})` }}
          ></div>
          <div
            className="secure-popup__close-button"
            onClick={handleCloseModal}
          >
            <MdClose fontSize="3rem" />
          </div>
        </div>
      )}
      <div
        className={
          "secure-alert__product-added " +
          `${showAlert ? "product-added--appear" : "product-added--disappear"}`
        }
      >
        {isCompleted ? (
          <div className="flex-center gap-4">
            Producto añadido con éxito
            <FaCheck color="#0f0" />
          </div>
        ) : (
          isError === true && error
        )}
      </div>
    </div>
  );
};
