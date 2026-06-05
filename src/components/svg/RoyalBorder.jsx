const RoyalBorder = ({ className = "", width = "100%", height = "100%" }) => {
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`} style={{ width, height, padding: '1rem' }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFC300" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#FFC300" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#FFC300" stopOpacity="0.45" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="none" stroke="url(#borderGrad)" strokeWidth="2" />
        <rect x="8" y="8" width="calc(100% - 16px)" height="calc(100% - 16px)" fill="none" stroke="url(#borderGrad)" strokeWidth="1" strokeOpacity="0.5" />
      </svg>
    </div>
  );
};

export default RoyalBorder;
