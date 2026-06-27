import type { ElementType, ReactNode } from "react";
import { useReveal } from "../lib/useReveal";

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  id?: string;
};

// Envolve um bloco e aplica a entrada sutil (fade + leve subida) quando visível.
export function Reveal({
  children,
  as: Tag = "div",
  className = "",
  delay = 0,
  id,
}: RevealProps) {
  const { ref, visible } = useReveal<HTMLElement>();
  return (
    <Tag
      ref={ref}
      id={id}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`.trim()}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
