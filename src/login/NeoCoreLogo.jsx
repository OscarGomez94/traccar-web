const NeoCoreLogo = ({
  variant = 'dark',
  showText = true,
  compact = false,
  width,
}) => {
  const isLight = variant === 'light';

  const logoColor = isLight ? '#FFFFFF' : '#0F2742';

  const iconSize = compact ? 40 : 52;
  const fontSize = compact ? 21 : 28;

  return (
    <div
      role="img"
      aria-label="NeoCore Tracker"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: compact ? '8px' : '10px',
        width: width || 'auto',
        maxWidth: '100%',
        flexShrink: 0,
      }}
    >
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 60 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{
          display: 'block',
          flexShrink: 0,
        }}
      >
        <path
          d="M30 3L53.4 16.5V43.5L30 57L6.6 43.5V16.5L30 3Z"
          fill="none"
          stroke={logoColor}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        <path
          d="M19 42V18H24L36 33.5V18H41V42H36L24 26.5V42H19Z"
          fill={logoColor}
        />
      </svg>

      {showText && (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'baseline',
            whiteSpace: 'nowrap',
            color: logoColor,
            fontFamily:
              '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            fontSize: `${fontSize}px`,
            fontWeight: 600,
            letterSpacing: '-0.4px',
            lineHeight: 1,
          }}
        >
          NeoCore&nbsp;Tracker
        </span>
      )}
    </div>
  );
};

export default NeoCoreLogo;