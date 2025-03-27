import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Header from "components/Headers/Header.js";
import { handleAuth } from "../auth";

const Index = (props) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [activeNav, setActiveNav] = useState(1);
  const [chartExample1Data, setChartExample1Data] = useState("data1");

  const toggleNavs = (e, index) => {
    e.preventDefault();
    setActiveNav(index);
    setChartExample1Data("data" + index);
  };

  useEffect(() => {
    (async () => {
      const authResponse = await handleAuth(navigate, location);
      if (authResponse) {
        // getData(); // Fetch data only if authentication succeeds
      }
    })();
  }, []);

  return (
    <>
      <Header />
    </>
  );
};

export default Index;
