import { useEffect, useRef, useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

import { capitalize } from "@sssp/common/utils";

import RoutedTabsProps from "./RoutedTabs.models";

import "./RoutedTabs.scss";

const RoutedTabs: React.FC<RoutedTabsProps> = ({ tabs, defaultTab }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const currentTab = location.pathname.split("/")[1] || defaultTab;
  const [activeTab, setActiveTab] = useState(currentTab);

  const lastPaths = useRef<Record<string, string>>({});

  useEffect(() => {
    const tab = location.pathname.split("/")[1];
    if (tab) {
      const currentPath = location.pathname + location.search + location.hash;
      lastPaths.current[tab] = currentPath;
      setActiveTab(tab);
    }
  }, [location]);

  const handleNavigation = (tab: string | null) => {
    if (!tab || tab === activeTab) return;
    const target = lastPaths.current[tab] || `/${tab}`;
    navigate(target);
  };

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
