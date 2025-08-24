// src/components/ChatEmbed.tsx
import React, { useEffect } from "react";

export default function ChatEmbed() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://iframe.chat/scripts/main.min.js";
    script.async = true;
    script.onload = () => {
      if ((window as any).chattable) {
        (window as any).chattable.initialize({
          theme: "Retrowave Red",
          stylesheet: "/chattable.css",
        });
      }
    };
    document.body.appendChild(script);
  }, []);

  return (
    <iframe
      src="https://iframe.chat/embed?chat=ToxicFMChat"
      id="chattable"
      style={{ width: "100%", minHeight: 400, border: "none" }}
    />
  );
}
