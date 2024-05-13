import HomeNew from "./components/HomeNew";
import { Analytics } from "@vercel/analytics/react";
import ReactGA from "react-ga";

ReactGA.initialize("YOUR_GOOGLE_ANALYTICS_TRACKING_ID");

function App() {
  return (
    <div>
      <Analytics />
      <HomeNew />
    </div>
  );
}

export default App;
