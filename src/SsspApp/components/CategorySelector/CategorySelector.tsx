import { useContext } from "react";
import { FormCheck } from "react-bootstrap";

import { PseudosContext } from "@sssp/context";

import styles from "./CategorySelector.module.scss";

const CategorySelector: React.FC = () => {
  const { categories, activeCategories, setActiveCategories } =
    useContext(PseudosContext);

  const handleCategoryChange = (category: string) => {
    if (activeCategories.includes(category)) {
      setActiveCategories(activeCategories.filter((cat) => cat !== category));
    } else {
      setActiveCategories([...activeCategories, category]);
    }
  };

  return (
    <div className={styles["category-selector"]}>
      {categories.map((category) => (
        <FormCheck
          key={category}
          type="checkbox"
          id={`category-${category}`}
          label={category}
          checked={activeCategories.includes(category)}
          onChange={() => handleCategoryChange(category)}
        />
      ))}
    </div>
  );
};

export default CategorySelector;
