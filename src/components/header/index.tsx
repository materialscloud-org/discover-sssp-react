import { DoiBadge } from "mc-react-library";
import { HeaderProps } from "./models";

import "./index.css";

export default function Header({
  title,
  subtitle,
  doi_ids,
  logo,
}: HeaderProps) {
  return (
    <div className="title-and-logo">
      <div className="title-and-doi">
        <div className="title">{title}</div>
        <div className="subtitle">{subtitle}</div>
        <div className="doi-container">
          {doi_ids.map((doi_id: string) => (
            <DoiBadge doi_id={doi_id} />
          ))}
        </div>
      </div>
      <img src={logo} className="logo" />
    </div>
  );
}
