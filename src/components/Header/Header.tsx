import React from "react";
import { Card } from "react-bootstrap";

import { DoiBadge } from "mc-react-library";

import HeaderProps from "./Header.models";
import styles from "./Header.module.scss";

const Header: React.FC<HeaderProps> = ({ title, subtitle, doi_ids, logo }) => (
  <Card id={styles["header"]}>
    <Card.Body id={styles["header-card"]}>
      <div id={styles["title-and-logo"]}>
        <div id={styles["title-and-doi"]}>
          <div id={styles["title"]}>{title}</div>
          <div id={styles["subtitle"]}>{subtitle}</div>
          <div id={styles["doi-container"]}>
            {doi_ids.map((doi_id: string) => (
              <DoiBadge doi_id={doi_id} key={doi_id} />
            ))}
          </div>
        </div>
        <img src={logo} id={styles["logo"]} />
      </div>
    </Card.Body>
  </Card>
);

export default Header;
