import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { BiSolidUpArrowCircle } from "react-icons/bi";

import styles from "./BackToTop.module.scss";

const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => setIsVisible(window.pageYOffset > 400);

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    isVisible && (
      <Button
        id={styles.backToTop}
        title="Back to top"
        aria-label="Back to top"
        onClick={handleClick}
      >
        <BiSolidUpArrowCircle />
      </Button>
    )
  );
};

export default BackToTop;
