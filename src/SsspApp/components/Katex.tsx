import { useEffect, useRef } from "react";

import katex from "katex";
import "katex/dist/katex.min.css";

import styles from "./Katex.module.scss";

interface KatexProps {
  expression: string;
  inline?: boolean;
  className?: string;
}

const KaTeX: React.FC<KatexProps> = ({ expression, inline, className }) => {
  const containerRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inline) {
      containerRef.current!.innerHTML = katex.renderToString(expression, {
        displayMode: !inline,
      });
    } else {
      katex.render(expression, containerRef.current as HTMLInputElement, {
        displayMode: !inline,
      });
    }
  }, [expression, inline]);

  return inline ? (
    <span ref={containerRef} className={className || styles.katex} />
  ) : (
    <div ref={containerRef} className={className || styles.katex} />
  );
};

export default KaTeX;
