type CitationProps = {
  label: string;
  link?: string;
  content: React.ReactNode;
  license?: string;
  versions?: {
    name: string;
    content?: React.ReactNode;
  }[];
};

const Citation: React.FC<CitationProps> = ({
  label,
  link,
  content,
  license,
  versions,
}) => (
  <div>
    {link ? (
      <a href={link} target="_blank">
        {label}
      </a>
    ) : (
      label
    )}
    : {content}
    <br />
    {license && (
      <small>
        <em>License: {license}</em>
      </small>
    )}
    {versions && (
      <>
        <div>
          Versions
          <ul>
            {versions.map((version) => (
              <li key={version.name}>
                <b>{version.name}</b>
                {version.content ? (
                  <span>
                    <b>:</b> {version.content}
                  </span>
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
