export function TenancyLogo({ className = 'w-9 h-9', rounded = 'rounded-xl' }: { className?: string; rounded?: string }) {
  return (
    <div
      className={`relative flex items-center justify-center bg-[#090d16] text-white shadow-inner overflow-hidden flex-shrink-0 ${rounded} ${className}`}
      style={{
        boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.15), 0 2px 4px rgba(0,0,0,0.3)',
      }}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-[72%] h-[72%]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* House contour (bright royal blue) */}
        <path
          d="M50 16 L84 43 V80 C84 83 81.5 85.5 78.5 85.5 H21.5 C18.5 85.5 16 83 16 80 V43 L50 16 Z"
          stroke="#3b82f6"
          strokeWidth="8.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Person head (cyan/sky blue circle) */}
        <circle cx="50" cy="38" r="6" fill="#60a5fa" />
        {/* Person body / inner arch (vibrant emerald green) */}
        <path
          d="M39 84 V54 C39 47.5 61 47.5 61 54 V84"
          stroke="#10b981"
          strokeWidth="7.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
