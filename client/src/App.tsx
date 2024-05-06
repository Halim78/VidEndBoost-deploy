import HomeNew from "./components/HomeNew";
import { Analytics } from "@vercel/analytics/react"

function App() {
  return (
    <div>
      <HomeNew />
      <Analytics />
    </div>
  );
}

export default App;
