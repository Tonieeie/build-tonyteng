"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

/** Fades/rises its children in the first time they scroll into view. */
export function Reveal({
  children,
  as: Tag = "div",
  index = 0,
  className = "",
}: {
  children: ReactNode;
  as?: ElementType;
  index?: number;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref} data-visible={visible} className={`reveal ${className}`} style={{ "--i": index } as React.CSSProperties}>
      {children}
    </Tag>
  );
}
