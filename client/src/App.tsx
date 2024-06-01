import Home from "./components/Home";
import { Analytics } from "@vercel/analytics/react";

function App() {
  return (
    <div className="flex flex-col">
      <Analytics />
      <Home />
    </div>
  );
}

export default App;
