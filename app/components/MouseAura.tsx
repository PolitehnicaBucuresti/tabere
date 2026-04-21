"use client";

import { useEffect, useRef } from "react";

type MouseAuraProps = {
  targetId: string;
};

export default function MouseAura({ targetId }: MouseAuraProps) {
  const primaryRef = useRef<HTMLDivElement | null>(null);
  const secondaryRef = useRef<HTMLDivElement | null>(null);
  const layerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const target = document.getElementById(targetId);
    const primary = primaryRef.current;
    const secondary = secondaryRef.current;
    const layer = layerRef.current;

    if (!target || !primary || !secondary || !layer) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let rafId = 0;
    let visible = false;

    const updateVisibility = (isVisible: boolean) => {
      const opacity = isVisible ? "1" : "0";
      primary.style.opacity = opacity;
      secondary.style.opacity = opacity;
    };

    const onPointerEnter = () => {
      visible = true;
      updateVisibility(true);
    };

    const onPointerLeave = () => {
      visible = false;
      updateVisibility(false);
    };

    const onPointerMove = (event: MouseEvent) => {
      const rect = target.getBoundingClientRect();
      targetX = event.clientX - rect.left;
      targetY = event.clientY - rect.top;
    };

    const animate = () => {
      // Smoothly interpolate for a more natural, fluid cursor aura.
      currentX += (targetX - currentX) * 0.16;
      currentY += (targetY - currentY) * 0.16;

      primary.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`;
      secondary.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`;

      if (visible) {
        layer.style.opacity = "1";
      }

      rafId = window.requestAnimationFrame(animate);
    };

    updateVisibility(false);
    animate();

    target.addEventListener("mouseenter", onPointerEnter);
    target.addEventListener("mouseleave", onPointerLeave);
    target.addEventListener("mousemove", onPointerMove);

    return () => {
      window.cancelAnimationFrame(rafId);
      target.removeEventListener("mouseenter", onPointerEnter);
      target.removeEventListener("mouseleave", onPointerLeave);
      target.removeEventListener("mousemove", onPointerMove);
    };
  }, [targetId]);

  return (
    <div ref={layerRef} className="heroBlobLayer" aria-hidden="true">
      <div ref={primaryRef} className="heroBlob heroBlobPrimary" />
      <div ref={secondaryRef} className="heroBlob heroBlobSecondary" />
    </div>
  );
}
