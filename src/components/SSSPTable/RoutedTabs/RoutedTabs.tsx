import { useEffect, useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

import { urlBase } from "common/config";

import "./RoutedTabs.scss";

// TODO generalize and refactor
const RoutedTabs = () => {
  const [active, setActive] = useState("efficiency");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const route = location.pathname.split(urlBase)[1];
    const root = route.split("/")[1];
    setActive(root);
  }, [location]);

  return (
    <Tabs
      defaultActiveKey="efficiency"
      activeKey={active}
      onSelect={(key) => navigate(`${urlBase}/${key}`)}
    >
      <Tab eventKey="efficiency" title="Efficiency" />
      <Tab eventKey="precision" title="Precision" />
      <Tab eventKey="about" title="About" />
    </Tabs>
  );
};

export default RoutedTabs;
