import ReactMarkdown from "react-markdown";

import styles from "./Citation.module.scss";

type CitationProps = {
  label?: string;
  website?: string;
  citation?: string;
  license?: string;
  comment?: string;
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
  comment,
  versions,
}) => (
  <div className={styles.citation}>
    {label && (
      <b>
        {website ? (
          <a href={website} target="_blank" rel="noopener noreferrer">
            {label}
          </a>
        ) : (
          label
        )}
        {citation ? ": " : ""}
      </b>
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
    <br />
    {license && (
      <small>
        <em>License: {license}</em>
      </small>
    )}
    {comment && (
      <div className={styles.comment}>
        <strong>Comment:</strong> {comment}
      </div>
    )}
    {versions && (
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
    )}
  </div>
);

export default Citation;
