const FiligreeCorner = ({ className = "", width = "100", height = "100", position = "top-left" }) => {
  let transform = "";
  if (position === "top-right") transform = "scaleX(-1)";
  if (position === "bottom-left") transform = "scaleY(-1)";
  if (position === "bottom-right") transform = "scale(-1, -1)";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={width}
      height={height}
      className={className}
      style={{ transform }}
    >
      <defs>
        <linearGradient id="filigreeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#F3E5AB" />
        </linearGradient>
      </defs>
      <path
        d="M 0 0 L 100 0 C 100 0, 80 20, 80 50 C 80 80, 50 80, 50 100 L 0 100 Z"
        fill="none"
        stroke="url(#filigreeGrad)"
        strokeWidth="2"
      />
      <path
        d="M 10 10 L 80 10 C 80 10, 60 25, 60 50 C 60 75, 25 75, 10 80 Z"
        fill="none"
        stroke="url(#filigreeGrad)"
        strokeWidth="1"
        opacity="0.7"
      />
      <circle cx="20" cy="20" r="3" fill="url(#filigreeGrad)" />
      <circle cx="40" cy="15" r="2" fill="url(#filigreeGrad)" />
      <circle cx="15" cy="40" r="2" fill="url(#filigreeGrad)" />
    </svg>
  );
};

export default FiligreeCorner;
