"use client";

import { useEffect, useState } from "react";

export default function MouseAura() {
  const [position, setPosition] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      setPosition({ x: event.clientX, y: event.clientY });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <>
      <div
        className="mouseAura mouseAuraPrimary"
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
      />
      <div
        className="mouseAura mouseAuraSecondary"
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
      />
    </>
  );
}
