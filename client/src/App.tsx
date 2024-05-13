import HomeNew from "./components/HomeNew";
import { Analytics } from "@vercel/analytics/react";
import { useEffect } from "react";
import ReactGA from "react-ga";

const GOOGLE_ANALYTICS_ID = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;

function App() {
  useEffect(() => {
    ReactGA.initialize(GOOGLE_ANALYTICS_ID);
    ReactGA.send({ hitType: "pageview", page: window.location.pathname });
  }, []);

  return (
    <div>
      <Analytics />
      <HomeNew />
    </div>
  );
}

export default App;
