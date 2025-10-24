import { useEffect, useState } from "react";

export default function BackendHealth() {
  const [msg, setMsg] = useState("Checking…");

  useEffect(() => {
    const base = "http://localhost:8000";

    console.log("API base:", base);
    setMsg(`Calling: ${base}/api/mentors/`);

    fetch(`${base}/api/mentors/`)
      .then(async (r) => {
        const text = await r.text();
        setMsg(`HTTP ${r.status} • Django OK`);
      })
      .catch((e) => setMsg(`FAILED: ${String(e)}`));
  }, []);

  return (
    <div style={{position:"fixed",bottom:8,right:8,background:"#fff",border:"1px solid #ddd",padding:"8px 10px",borderRadius:8,fontSize:12,zIndex:9999}}>
      Backend: {msg}
    </div>
  );
}