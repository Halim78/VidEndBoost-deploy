import HomeNew from "./components/HomeNew";
import { Analytics } from "@vercel/analytics/react";
import ReactGA from "react-ga";

const GOOGLE_ANALYTICS_ID = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;

ReactGA.initialize(GOOGLE_ANALYTICS_ID);

function App() {
  return (
    <div>
      <Analytics />
      <HomeNew />
    </div>
  );
}

export default App;
