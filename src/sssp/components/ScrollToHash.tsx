import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToHash: React.FC = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;

    const id = decodeURIComponent(hash.slice(1));
    const el = document.getElementById(id);

    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [hash]);

  return null;
};

export default ScrollToHash;
