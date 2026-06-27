// Conjunto coeso de ícones de linha (stroke), desenhados no mesmo grid 24x24.
// Mantém consistência visual sem depender de biblioteca externa.

type IconProps = {
  className?: string;
};

const base = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
};

export function IconCarreta({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M2 6.5h9v8H2z" />
      <path d="M11 9h4.5l2.5 3v2.5H11z" />
      <circle cx="6.5" cy="17" r="1.8" />
      <circle cx="16.5" cy="17" r="1.8" />
      <path d="M2 14.5h2.7M8.3 14.5h6.4M18 14.5h2" />
    </svg>
  );
}

export function IconPrato({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M5 3v7a2 2 0 0 0 2 2 2 2 0 0 0 2-2V3M7 3v9M7 12v9" />
      <path d="M16 3c-1.6 0-2.8 2-2.8 5.2 0 2 1.1 2.8 2.3 3.1V21" />
    </svg>
  );
}

export function IconBanheiro({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 3.5c2.6 3 4.5 5.4 4.5 8a4.5 4.5 0 0 1-9 0c0-2.6 1.9-5 4.5-8z" />
      <path d="M12 9.5c-1.4 1.6-2.2 2.7-2.2 4" />
    </svg>
  );
}

export function IconEscudo({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 3l7 2.5v5c0 4.2-2.9 7.6-7 9-4.1-1.4-7-4.8-7-9v-5z" />
      <path d="m9 11.8 2 2 4-4.2" />
    </svg>
  );
}

export function IconWifi({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M3.5 8.5a13 13 0 0 1 17 0M6.5 11.8a8.5 8.5 0 0 1 11 0M9.5 15a4 4 0 0 1 5 0" />
      <circle cx="12" cy="18.5" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconCombustivel({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M5 21V5a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v16M4 21h11" />
      <path d="M8 9h5" />
      <path d="M14 8h2.5a2 2 0 0 1 2 2v6a1.6 1.6 0 0 0 3.2 0V9.5L18.5 6" />
    </svg>
  );
}

export function IconRelogio({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.2 1.8" />
    </svg>
  );
}

export function IconPin({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 21c4.5-4.2 7-7.6 7-11a7 7 0 1 0-14 0c0 3.4 2.5 6.8 7 11z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  );
}

export function IconSeta({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function IconWhatsapp({ className }: IconProps) {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      focusable={false}
      className={className}
    >
      <path d="M12.04 2c-5.5 0-9.97 4.46-9.97 9.96 0 1.76.46 3.48 1.34 5L2 22l5.16-1.35a9.96 9.96 0 0 0 4.88 1.25h.01c5.5 0 9.96-4.46 9.96-9.96 0-2.66-1.04-5.16-2.92-7.04A9.9 9.9 0 0 0 12.04 2zm0 1.82c2.18 0 4.23.85 5.77 2.39a8.1 8.1 0 0 1 2.39 5.76c0 4.5-3.66 8.15-8.16 8.15a8.1 8.1 0 0 1-4.15-1.14l-.3-.18-3.06.8.82-2.98-.2-.31a8.07 8.07 0 0 1-1.24-4.34c0-4.5 3.66-8.15 8.15-8.15zm-3.5 4.4c-.16 0-.43.06-.66.31-.22.25-.86.85-.86 2.06 0 1.22.88 2.39 1 2.56.12.16 1.73 2.65 4.21 3.71.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.46-.6 1.67-1.18.2-.58.2-1.07.14-1.18-.06-.1-.22-.16-.46-.28-.25-.12-1.46-.72-1.69-.8-.22-.09-.39-.13-.55.12-.16.25-.63.8-.77.96-.14.17-.28.19-.53.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.23-1.46-1.37-1.71-.14-.25-.01-.38.11-.5.11-.11.25-.28.37-.42.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.55-1.34-.76-1.83-.2-.48-.4-.42-.55-.42z" />
    </svg>
  );
}

export function IconInstagram({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17" cy="7" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconEnvelope({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </svg>
  );
}

export function IconMenu({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function IconFechar({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}
