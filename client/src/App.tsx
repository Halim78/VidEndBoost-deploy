import HomeNew from "./components/HomeNew";
import { Analytics } from "@vercel/analytics/react";

function App() {
  return (
    <div>
      <Analytics />
      <HomeNew />
    </div>
  );
}

export default App;
