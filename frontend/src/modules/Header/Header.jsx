import useScroll from "../../hooks/useScroll";
import { Navbar } from "./Navbar/Navbar";
import "./styles/Header.css";

export const Header = ({ secure }) => {
  const scrollDirection = useScroll();
  return (
    <header
      className={
        "header " + `${scrollDirection == "up" ? "" : "header--hidden"}`
      }
    >
      <Navbar secure={secure} />
    </header>
  );
};
