import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

function App() {
  const [hello, setHello] = useState("đang tải...");
  const [db, setDb] = useState(null);
  useEffect(() => {
    fetch("/api/hello").then(r => r.json()).then(d => setHello(d.message)).catch(() => setHello("lỗi gọi API"));
    fetch("/api/db").then(r => r.json()).then(setDb).catch(() => setDb({ error: true }));
  }, []);
  return (
    <main style={{ fontFamily: "sans-serif", padding: 24 }}>
      <h1>Sample: Node.js + React</h1>
      <p>Backend nói: {hello}</p>
      <pre>DB: {JSON.stringify(db)}</pre>
    </main>
  );
}
createRoot(document.getElementById("root")).render(<App />);
