import ReactMarkdown from "react-markdown";

import styles from "./Citation.module.scss";

type CitationProps = {
  label?: string;
  website?: string;
  citation?: string;
  license?: string;
  versions?: {
    name: string;
    content?: string;
  }[];
};

const Citation: React.FC<CitationProps> = ({
  label,
  website,
  citation,
  license,
  versions,
}) => (
  <div className={styles.citation}>
    {label && (
      <span className={styles.citationLabel}>
        {website ? (
          <a href={website} target="_blank">
            {label}
          </a>
        ) : (
          label
        )}
        {citation ? ": " : ""}
      </span>
    )}
    {citation && (
      <ReactMarkdown
        components={{
          p: (props) => <span>{props.children}</span>,
        }}
      >
        {citation}
      </ReactMarkdown>
    )}
    {license && (
      <small>
        <em>License: {license}</em>
      </small>
    )}
    {versions && (
      <>
        <div>
          Versions:
          <ul>
            {versions.map((version) => (
              <li key={version.name}>
                <b>{version.name}</b>
                {version.content ? (
                  <ReactMarkdown
                    components={{
                      p: (props) => <span>: {props.children}</span>,
                    }}
                  >
                    {version.content}
                  </ReactMarkdown>
                ) : (
                  ""
                )}
              </li>
            ))}
          </ul>
        </div>
      </>
    )}
  </div>
);

export default Citation;
