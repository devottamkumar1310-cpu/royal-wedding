import React from 'react';

// Reusable watercolor leaf template with soft organic gradient
const Leaf = ({ d, fill = '#9DB893', opacity = 0.75, rotate = 0, scale = 1, cx = 0, cy = 0 }) => (
  <path
    d={d}
    fill={fill}
    opacity={opacity}
    style={{
      transformOrigin: `${cx}px ${cy}px`,
      transform: `rotate(${rotate}deg) scale(${scale})`,
    }}
  />
);

// Reusable watercolor blossom with overlapping soft-pink petals
const Blossom = ({ cx, cy, size = 12 }) => (
  <g className="blossom">
    {/* Soft inner glow */}
    <circle cx={cx} cy={cy} r={size * 1.2} fill="#F4A9C0" opacity="0.25" filter="blur(2px)" />
    {/* Petal 1 */}
    <path d={`M ${cx} ${cy} Q ${cx - size} ${cy - size * 1.5} ${cx} ${cy - size * 2} Q ${cx + size} ${cy - size * 1.5} ${cx} ${cy} Z`} fill="#F4A9C0" opacity="0.75" />
    {/* Petal 2 */}
    <path d={`M ${cx} ${cy} Q ${cx + size * 1.5} ${cy - size} ${cx + size * 2} ${cy} Q ${cx + size * 1.5} ${cy + size} ${cx} ${cy} Z`} fill="#F4A9C0" opacity="0.65" style={{ transformOrigin: `${cx}px ${cy}px`, transform: 'rotate(72deg)' }} />
    {/* Petal 3 */}
    <path d={`M ${cx} ${cy} Q ${cx + size} ${cy + size * 1.5} ${cx} ${cy + size * 2} Q ${cx - size} ${cy + size * 1.5} ${cx} ${cy} Z`} fill="#F4A9C0" opacity="0.70" style={{ transformOrigin: `${cx}px ${cy}px`, transform: 'rotate(144deg)' }} />
    {/* Petal 4 */}
    <path d={`M ${cx} ${cy} Q ${cx - size * 1.5} ${cy + size} ${cx - size * 2} ${cy} Q ${cx - size * 1.5} ${cy - size} ${cx} ${cy} Z`} fill="#F4A9C0" opacity="0.60" style={{ transformOrigin: `${cx}px ${cy}px`, transform: 'rotate(216deg)' }} />
    {/* Petal 5 */}
    <path d={`M ${cx} ${cy} Q ${cx - size} ${cy - size * 1.5} ${cx} ${cy - size * 2} Q ${cx + size} ${cy - size * 1.5} ${cx} ${cy} Z`} fill="#F4A9C0" opacity="0.70" style={{ transformOrigin: `${cx}px ${cy}px`, transform: 'rotate(288deg)' }} />
    {/* Flower center */}
    <circle cx={cx} cy={cy} r={size * 0.35} fill="#D4922A" opacity="0.9" />
  </g>
);

export const FloralClusterTopLeft = ({ className = '', style = {} }) => (
  <svg 
    viewBox="0 0 200 200" 
    className={`w-40 md:w-56 h-auto pointer-events-none select-none ${className}`} 
    style={style}
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Branches */}
    <path d="M 0,0 Q 40,40 110,60" stroke="#3D7A30" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
    <path d="M 0,0 Q 60,20 140,25" stroke="#3D7A30" strokeWidth="1.2" strokeLinecap="round" opacity="0.3" />
    <path d="M 0,0 Q 20,60 45,130" stroke="#3D7A30" strokeWidth="1.2" strokeLinecap="round" opacity="0.3" />

    {/* Eucalyptus leaves - Top branch */}
    <Leaf d="M 50,42 Q 62,30 80,32 Q 88,44 72,50 Q 56,52 50,42 Z" fill="#9DB893" opacity="0.75" />
    <Leaf d="M 85,52 Q 102,40 115,48 Q 120,62 102,68 Q 90,68 85,52 Z" fill="#9DB893" opacity="0.6" />
    <Leaf d="M 110,60 Q 125,52 135,58 Q 138,70 122,74 Z" fill="#3D7A30" opacity="0.45" scale={0.8} cx={110} cy={60} />

    {/* Leaves - Middle branch */}
    <Leaf d="M 60,18 Q 80,8 92,16 Q 95,30 80,32 Z" fill="#3D7A30" opacity="0.5" />
    <Leaf d="M 100,22 Q 118,12 130,20 Q 132,32 118,36 Z" fill="#9DB893" opacity="0.7" />

    {/* Leaves - Bottom branch */}
    <Leaf d="M 15,45 Q 5,65 10,78 Q 22,82 28,68 Z" fill="#3D7A30" opacity="0.55" />
    <Leaf d="M 30,85 Q 22,108 28,120 Q 42,118 42,100 Z" fill="#9DB893" opacity="0.75" />

    {/* Flowers */}
    <Blossom cx={45} cy={45} size={7} />
    <Blossom cx={85} cy={30} size={6} />
    <Blossom cx={25} cy={75} size={7} />
    
    {/* Watercolor Rose Petal Accents */}
    <circle cx="120" cy="95" r="4" fill="#F4A9C0" opacity="0.5" />
    <circle cx="65" cy="115" r="3.5" fill="#F4A9C0" opacity="0.4" />
  </svg>
);

export const FloralClusterTopRight = ({ className = '', style = {} }) => (
  <svg 
    viewBox="0 0 200 200" 
    className={`w-40 md:w-56 h-auto pointer-events-none select-none ${className}`} 
    style={style}
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <g transform="translate(200, 0) scale(-1, 1)">
      {/* Branches */}
      <path d="M 0,0 Q 40,40 110,60" stroke="#3D7A30" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      <path d="M 0,0 Q 60,20 140,25" stroke="#3D7A30" strokeWidth="1.2" strokeLinecap="round" opacity="0.3" />
      <path d="M 0,0 Q 20,60 45,130" stroke="#3D7A30" strokeWidth="1.2" strokeLinecap="round" opacity="0.3" />

      {/* Leaves */}
      <Leaf d="M 50,42 Q 62,30 80,32 Q 88,44 72,50 Q 56,52 50,42 Z" fill="#9DB893" opacity="0.75" />
      <Leaf d="M 85,52 Q 102,40 115,48 Q 120,62 102,68 Q 90,68 85,52 Z" fill="#9DB893" opacity="0.6" />
      <Leaf d="M 60,18 Q 80,8 92,16 Q 95,30 80,32 Z" fill="#3D7A30" opacity="0.55" />
      <Leaf d="M 100,22 Q 118,12 130,20 Q 132,32 118,36 Z" fill="#9DB893" opacity="0.7" />
      <Leaf d="M 30,85 Q 22,108 28,120 Q 42,118 42,100 Z" fill="#3D7A30" opacity="0.5" />

      {/* Flowers */}
      <Blossom cx={45} cy={45} size={7} />
      <Blossom cx={85} cy={30} size={6} />
      <Blossom cx={25} cy={75} size={7} />
    </g>
  </svg>
);

export const FloralClusterBottomLeft = ({ className = '', style = {} }) => (
  <svg 
    viewBox="0 0 200 200" 
    className={`w-40 md:w-56 h-auto pointer-events-none select-none ${className}`} 
    style={style}
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <g transform="translate(0, 200) scale(1, -1)">
      {/* Branches */}
      <path d="M 0,0 Q 40,40 110,60" stroke="#3D7A30" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      <path d="M 0,0 Q 60,20 140,25" stroke="#3D7A30" strokeWidth="1.2" strokeLinecap="round" opacity="0.3" />
      <path d="M 0,0 Q 20,60 45,130" stroke="#3D7A30" strokeWidth="1.2" strokeLinecap="round" opacity="0.3" />

      {/* Leaves */}
      <Leaf d="M 50,42 Q 62,30 80,32 Q 88,44 72,50 Q 56,52 50,42 Z" fill="#9DB893" opacity="0.75" />
      <Leaf d="M 85,52 Q 102,40 115,48 Q 120,62 102,68 Q 90,68 85,52 Z" fill="#9DB893" opacity="0.6" />
      <Leaf d="M 60,18 Q 80,8 92,16 Q 95,30 80,32 Z" fill="#3D7A30" opacity="0.55" />
      <Leaf d="M 100,22 Q 118,12 130,20 Q 132,32 118,36 Z" fill="#9DB893" opacity="0.7" />
      <Leaf d="M 30,85 Q 22,108 28,120 Q 42,118 42,100 Z" fill="#3D7A30" opacity="0.5" />

      {/* Flowers */}
      <Blossom cx={45} cy={45} size={7} />
      <Blossom cx={85} cy={30} size={6} />
      <Blossom cx={25} cy={75} size={7} />
    </g>
  </svg>
);

export const FloralClusterBottomRight = ({ className = '', style = {} }) => (
  <svg 
    viewBox="0 0 200 200" 
    className={`w-40 md:w-56 h-auto pointer-events-none select-none ${className}`} 
    style={style}
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <g transform="translate(200, 200) scale(-1, -1)">
      {/* Branches */}
      <path d="M 0,0 Q 40,40 110,60" stroke="#3D7A30" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      <path d="M 0,0 Q 60,20 140,25" stroke="#3D7A30" strokeWidth="1.2" strokeLinecap="round" opacity="0.3" />
      <path d="M 0,0 Q 20,60 45,130" stroke="#3D7A30" strokeWidth="1.2" strokeLinecap="round" opacity="0.3" />

      {/* Leaves */}
      <Leaf d="M 50,42 Q 62,30 80,32 Q 88,44 72,50 Q 56,52 50,42 Z" fill="#9DB893" opacity="0.75" />
      <Leaf d="M 85,52 Q 102,40 115,48 Q 120,62 102,68 Q 90,68 85,52 Z" fill="#9DB893" opacity="0.6" />
      <Leaf d="M 60,18 Q 80,8 92,16 Q 95,30 80,32 Z" fill="#3D7A30" opacity="0.55" />
      <Leaf d="M 100,22 Q 118,12 130,20 Q 132,32 118,36 Z" fill="#9DB893" opacity="0.7" />
      <Leaf d="M 30,85 Q 22,108 28,120 Q 42,118 42,100 Z" fill="#3D7A30" opacity="0.5" />

      {/* Flowers */}
      <Blossom cx={45} cy={45} size={7} />
      <Blossom cx={85} cy={30} size={6} />
      <Blossom cx={25} cy={75} size={7} />
    </g>
  </svg>
);

export const FloralBranchEdgeLeft = ({ className = '', style = {} }) => (
  <svg 
    viewBox="0 0 100 300" 
    className={`w-16 md:w-24 h-auto pointer-events-none select-none ${className}`} 
    style={style}
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Main curving branch entering from left */}
    <path d="M -10,150 Q 50,140 80,100 Q 50,80 -10,90" stroke="#3D7A30" strokeWidth="1.2" strokeLinecap="round" opacity="0.35" />
    <path d="M -10,180 Q 60,200 45,240" stroke="#3D7A30" strokeWidth="1" strokeLinecap="round" opacity="0.25" />

    {/* Eucalyptus leaves */}
    <Leaf d="M 35,142 Q 52,130 65,138 Q 62,150 48,154 Z" fill="#9DB893" opacity="0.7" />
    <Leaf d="M 70,110 Q 90,102 92,115 Q 82,125 72,118 Z" fill="#3D7A30" opacity="0.5" />
    <Leaf d="M 45,95 Q 60,82 72,92 Q 68,105 52,105 Z" fill="#9DB893" opacity="0.65" />
    <Leaf d="M 32,200 Q 50,205 52,220 Q 38,228 32,215 Z" fill="#3D7A30" opacity="0.45" />

    {/* Flowers */}
    <Blossom cx={55} cy={130} size={5.5} />
    <Blossom cx={38} cy={205} size={5} />
  </svg>
);

export const FloralBranchEdgeRight = ({ className = '', style = {} }) => (
  <svg 
    viewBox="0 0 100 300" 
    className={`w-16 md:w-24 h-auto pointer-events-none select-none ${className}`} 
    style={style}
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <g transform="translate(100, 0) scale(-1, 1)">
      {/* Main curving branch entering from left (now right due to scale) */}
      <path d="M -10,150 Q 50,140 80,100 Q 50,80 -10,90" stroke="#3D7A30" strokeWidth="1.2" strokeLinecap="round" opacity="0.35" />
      <path d="M -10,180 Q 60,200 45,240" stroke="#3D7A30" strokeWidth="1" strokeLinecap="round" opacity="0.25" />

      {/* Leaves */}
      <Leaf d="M 35,142 Q 52,130 65,138 Q 62,150 48,154 Z" fill="#9DB893" opacity="0.7" />
      <Leaf d="M 70,110 Q 90,102 92,115 Q 82,125 72,118 Z" fill="#3D7A30" opacity="0.5" />
      <Leaf d="M 45,95 Q 60,82 72,92 Q 68,105 52,105 Z" fill="#9DB893" opacity="0.65" />
      <Leaf d="M 32,200 Q 50,205 52,220 Q 38,228 32,215 Z" fill="#3D7A30" opacity="0.45" />

      {/* Flowers */}
      <Blossom cx={55} cy={130} size={5.5} />
      <Blossom cx={38} cy={205} size={5} />
    </g>
  </svg>
);

export const LargePeonyBackground = ({ className = '', style = {} }) => (
  <svg 
    viewBox="0 0 300 300" 
    className={`pointer-events-none select-none ${className}`} 
    style={{ ...style, filter: 'blur(3px)' }}
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Soft watercolor layers of petals */}
    <circle cx="150" cy="150" r="80" fill="#F4A9C0" opacity="0.15" />
    <circle cx="120" cy="130" r="50" fill="#FFE8EF" opacity="0.25" />
    <circle cx="180" cy="170" r="65" fill="#FFE8EF" opacity="0.2" />
    <circle cx="170" cy="120" r="55" fill="#F4A9C0" opacity="0.18" />
    
    {/* Outlines of petals */}
    <path d="M 150,70 Q 130,120 100,100 Q 120,150 150,150 Z" stroke="#C45B7A" strokeWidth="0.8" opacity="0.14" fill="#FFE8EF" />
    <path d="M 150,70 Q 170,120 200,100 Q 180,150 150,150 Z" stroke="#C45B7A" strokeWidth="0.8" opacity="0.14" fill="#FFE8EF" />
    <path d="M 230,150 Q 180,130 200,100 Q 150,120 150,150 Z" stroke="#C45B7A" strokeWidth="0.8" opacity="0.12" fill="#FFE8EF" />
    <path d="M 70,150 Q 120,130 100,100 Q 150,120 150,150 Z" stroke="#C45B7A" strokeWidth="0.8" opacity="0.12" fill="#FFE8EF" />
    <path d="M 150,230 Q 130,180 100,200 Q 120,150 150,150 Z" stroke="#C45B7A" strokeWidth="0.8" opacity="0.14" fill="#FFE8EF" />
    <path d="M 150,230 Q 170,180 200,200 Q 180,150 150,150 Z" stroke="#C45B7A" strokeWidth="0.8" opacity="0.14" fill="#FFE8EF" />
    
    {/* Center details */}
    <circle cx="150" cy="150" r="18" fill="#D4922A" opacity="0.25" />
    <circle cx="150" cy="150" r="8" fill="#C45B7A" opacity="0.2" />
  </svg>
);

export const LargeEucalyptusBackground = ({ className = '', style = {} }) => (
  <svg 
    viewBox="0 0 300 400" 
    className={`pointer-events-none select-none ${className}`} 
    style={{ ...style, filter: 'blur(2px)' }}
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Twig */}
    <path d="M 150,400 Q 120,250 160,50" stroke="#3D7A30" strokeWidth="2.5" opacity="0.15" strokeLinecap="round" />
    
    {/* Eucalyptus leaves in pairs */}
    <path d="M 145,320 Q 90,280 110,240 Q 150,260 145,320 Z" fill="#9DB893" opacity="0.15" />
    <path d="M 145,320 Q 200,280 180,240 Q 140,260 145,320 Z" fill="#9DB893" opacity="0.15" />

    <path d="M 138,220 Q 80,180 100,140 Q 140,160 138,220 Z" fill="#3D7A30" opacity="0.12" />
    <path d="M 138,220 Q 190,180 170,140 Q 130,160 138,220 Z" fill="#9DB893" opacity="0.15" />

    <path d="M 148,110 Q 100,80 120,40 Q 150,60 148,110 Z" fill="#9DB893" opacity="0.16" />
    <path d="M 148,110 Q 200,80 180,40 Q 150,60 148,110 Z" fill="#3D7A30" opacity="0.12" />
  </svg>
);
