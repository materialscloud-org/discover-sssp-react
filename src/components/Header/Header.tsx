import React from "react";
import { Card } from "react-bootstrap";

import { DoiBadge } from "mc-react-library";

import { HeaderProps } from "./Header.models";

import styles from "./Header.module.scss";

const Header: React.FC<HeaderProps> = ({ title, subtitle, doi_ids, logo }) => {
  return (
    <Card className={styles["header"]}>
      <Card.Body>
        <div className={styles["title-and-logo"]}>
          <div className={styles["title-and-doi"]}>
            <div className={styles["title"]}>{title}</div>
            <div className={styles["subtitle"]}>{subtitle}</div>
            <div className={styles["doi-container"]}>
              {doi_ids.map((doi_id: string) => (
                <DoiBadge doi_id={doi_id} key={doi_id} />
              ))}
            </div>
          </div>
          <img src={logo} className={styles["logo"]} />
        </div>
      </Card.Body>
    </Card>
  );
};

export default Header;
