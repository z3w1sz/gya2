import { useForm } from "../../../hooks/useForm";
import "./styles/Write.css";
import axios from "axios";

const BASE_URL = "http://localhost:8000/posts/";

export const Write = () => {
  const initialState = {
    title: "",
    body: "",
  };

  const {
    formState: { title, body },
    onInputChange,
    setFormState,
  } = useForm(initialState);

  const handlePost = async () => {
    axios.post(
      BASE_URL,
      { title: title, body: body },
      { withCredentials: true }
    );
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
    handlePost();
    setFormState(initialState);
  };

  return (
    <div className="write">
      <h2>Write a post</h2>
      <form className="write__form" onSubmit={onFormSubmit}>
        <div className="write-form__wrapper">
          <label htmlFor="title">Title</label>
          <div className="write-form__input">
            <input
              type="text"
              name="title"
              id="title"
              onChange={onInputChange}
              value={title}
            />
          </div>
        </div>
        <div className="write-form__wrapper">
          <label htmlFor="body">Body</label>
          <div className="write-form__input">
            <textarea
              name="body"
              id="body"
              onChange={onInputChange}
              value={body}
            />
          </div>
        </div>
        <button className="write-form__submit" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};
