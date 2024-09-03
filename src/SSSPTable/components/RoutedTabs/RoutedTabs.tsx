import { useEffect, useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

import { capitalize } from "@sssp/common/utils";

import RoutedTabsProps from "./RoutedTabs.models";

import "./RoutedTabs.scss";

const RoutedTabs: React.FC<RoutedTabsProps> = ({ tabs, defaultTab }) => {
  const location = useLocation();
  const currentTab = location.pathname.split("/")[1];
  const [activeTab, setActiveTab] = useState(currentTab || defaultTab);
  const navigate = useNavigate();

  const handleNavigation = (value: string | null) => {
    if (!value || value === currentTab) return;
    navigate(value);
  };

  useEffect(() => {
    const currentTab = location.pathname.split("/")[1];
    setActiveTab(currentTab);
  }, [location.pathname]);

  return (
    <Tabs
      defaultActiveKey={defaultTab}
      activeKey={activeTab}
      onSelect={(tab) => handleNavigation(tab)}
    >
      {tabs.map((tab) => (
        <Tab key={tab} eventKey={tab} title={capitalize(tab)} />
      ))}
    </Tabs>
  );
};

export default RoutedTabs;
