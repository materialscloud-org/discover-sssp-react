import React, { useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { urlBase } from "common/config";
import { capitalize } from "common/utils";

import { RoutedTabsProps } from "./RoutedTabs.models";

import "./RoutedTabs.scss";

const RoutedTabs: React.FC<RoutedTabsProps> = ({ tabs, defaultTab }) => {
  const currentTab = location.pathname.split(urlBase)[1].split("/")[1];
  const [active, setActive] = useState(currentTab || defaultTab);
  const navigate = useNavigate();

  const handleNavigation = (value: string) => {
    setActive(value);
    navigate(value);
  };

  return (
    <Tabs
      defaultActiveKey={defaultTab}
      activeKey={active}
      onSelect={(tab) => tab && handleNavigation(tab)}
    >
      {tabs.map((tab) => (
        <Tab key={tab} eventKey={tab} title={capitalize(tab)} />
      ))}
    </Tabs>
  );
};

export default RoutedTabs;
