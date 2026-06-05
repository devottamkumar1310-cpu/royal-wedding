import React from 'react';

const GaneshaArt = ({ className, style }) => (
  <svg
    viewBox="0 0 1024 1024"
    className={className}
    style={style}
    aria-label="Gold Ganesha Line Art Silhouette"
  >
    {/* ─── LUXURY BACKGROUND HALO (AURA) ─── */}
    <circle cx="512" cy="380" r="230" stroke="currentColor" strokeWidth="1.2" fill="none" strokeDasharray="3 6" opacity="0.35" />
    <circle cx="512" cy="380" r="245" stroke="currentColor" strokeWidth="1.8" fill="none" opacity="0.25" />
    <circle cx="512" cy="380" r="260" stroke="currentColor" strokeWidth="1.2" fill="none" strokeDasharray="12 6" opacity="0.2" />

    {/* Symmetrical Halo Rays */}
    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
      const rad = (deg * Math.PI) / 180;
      const x1 = 512 + Math.cos(rad) * 270;
      const y1 = 380 + Math.sin(rad) * 270;
      const x2 = 512 + Math.cos(rad) * 285;
      const y2 = 380 + Math.sin(rad) * 285;
      return (
        <line
          key={deg}
          x1={x1.toFixed(1)}
          y1={y1.toFixed(1)}
          x2={x2.toFixed(1)}
          y2={y2.toFixed(1)}
          stroke="currentColor"
          strokeWidth="1.2"
          fill="none"
          opacity="0.25"
        />
      );
    })}

    {/* ─── GANESHA LINE ART ─── */}
    <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      {/* Crown (Mukut) */}
      <path d="M 450 280 C 470 290, 554 290, 574 280" strokeWidth="10" fill="none" />
      <path d="M 465 255 Q 512 270 559 255" strokeWidth="10" fill="none" />
      <path d="M 480 230 Q 512 245 544 230" strokeWidth="10" fill="none" />
      <path d="M 495 205 L 512 160 L 529 205 Z" strokeWidth="10" fill="none" />
      <circle cx="512" cy="140" r="6" stroke="currentColor" strokeWidth="6" fill="none" />
      
      {/* Tilak */}
      <path d="M 512 235 L 512 268" strokeWidth="8" fill="none" />
      <path d="M 503 258 Q 512 264 521 258" strokeWidth="6" fill="none" />
      
      {/* Left Ear */}
      <path d="M 465 285 C 380 265, 330 330, 345 390 C 360 440, 420 460, 460 440" strokeWidth="12" fill="none" />
      <path d="M 445 310 C 390 300, 360 345, 375 390 C 385 420, 425 430, 450 415" strokeWidth="8" fill="none" opacity="0.7" />

      {/* Right Ear */}
      <path d="M 559 285 C 644 265, 694 330, 679 390 C 664 440, 604 460, 564 440" strokeWidth="12" fill="none" />
      <path d="M 579 310 C 634 300, 664 345, 649 390 C 639 420, 599 430, 574 415" strokeWidth="8" fill="none" opacity="0.7" />

      {/* Eyes and Eyebrows */}
      {/* Left Eyebrow */}
      <path d="M 455 340 Q 480 340 490 350" strokeWidth="10" fill="none" />
      {/* Left Eye */}
      <path d="M 460 355 Q 475 358 485 362" strokeWidth="8" fill="none" />
      
      {/* Right Eyebrow */}
      <path d="M 569 340 Q 544 340 534 350" strokeWidth="10" fill="none" />
      {/* Right Eye */}
      <path d="M 564 355 Q 549 358 539 362" strokeWidth="8" fill="none" />

      {/* Head contours & cheeks */}
      <path d="M 460 440 C 455 460, 465 485, 480 495" strokeWidth="10" fill="none" />
      <path d="M 564 440 C 569 460, 559 485, 544 495" strokeWidth="10" fill="none" />

      {/* Main Trunk (Edampuri - curling to the left) */}
      <path 
        d="M 512 285 C 500 350, 480 415, 480 475 C 480 540, 520 575, 550 575 C 575 575, 595 550, 595 525 C 595 500, 570 490, 550 505 C 538 515, 542 535, 560 535" 
        strokeWidth="16" 
        fill="none"
      />

      {/* Tusks */}
      {/* Left Tusk (Broken) */}
      <path d="M 476 490 L 460 495" strokeWidth="8" fill="none" />
      {/* Right Tusk (Full) */}
      <path d="M 548 490 L 575 500 L 548 506" strokeWidth="8" fill="none" />
    </g>
  </svg>
);

export default GaneshaArt;
