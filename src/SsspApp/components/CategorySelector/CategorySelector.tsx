import { Form } from "react-bootstrap";

import styles from "./CategorySelector.module.scss";

const PseudoCategoryMap: Record<string, string> = {
  nc: "Norm-conserving",
  us: "Ultrasoft",
  paw: "PAW",
};

interface CategorySelectorProps {
  categories: string[];
  activeCategories: string[];
  onCategorySelect: (categories: string[]) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  activeCategories,
  onCategorySelect: setActiveCategories,
}) => {
  return (
    <div className={styles["category-selector"]}>
      {categories.map((category) => (
        <Form.Check
          key={category}
          type="checkbox"
          id={`category-${category}`}
          label={PseudoCategoryMap[category] || category}
          checked={activeCategories.includes(category)}
          onChange={(event) =>
            event.target.checked
              ? setActiveCategories([...activeCategories, category])
              : setActiveCategories(
                  activeCategories.filter((c) => c !== category)
                )
          }
        />
      ))}
    </div>
  );
};

export default CategorySelector;
