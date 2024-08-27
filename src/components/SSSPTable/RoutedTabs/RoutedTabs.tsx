import React, { useEffect, useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

import { capitalize } from "common/utils";

import { RoutedTabsProps } from "./RoutedTabs.models";

import "./RoutedTabs.scss";

const RoutedTabs: React.FC<RoutedTabsProps> = ({ tabs, defaultTab }) => {
  const [active, setActive] = useState(defaultTab);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const route = location.pathname.split("/")[1];
    setActive(route);
  }, [location]);

  return (
    <Tabs
      defaultActiveKey={defaultTab}
      activeKey={active}
      onSelect={(key) => navigate(key || "")}
    >
      {tabs.map((tab) => (
        <Tab eventKey={tab} title={tab} key={capitalize(tab)} />
      ))}
    </Tabs>
  );
};

export default RoutedTabs;
