'use client';

import { useState, useEffect, useMemo } from 'react';

interface CelestialBody {
  id: string;
  name: string;
  color: string;
  size: number;
  orbitRadius: number;
  orbitSpeed: number; // degrees per frame
  startAngle: number;
  frozen?: boolean;
}

export function EldenOrrery() {
  const [radahnFallen, setRadahnFallen] = useState(false);
  const [time, setTime] = useState(0);
  const [paused, setPaused] = useState(false);

  // Animation loop
  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      setTime((t) => t + 1);
    }, 50);
    return () => clearInterval(interval);
  }, [paused]);

  // THE MOON AS DRIVESHAFT
  // In the TYCHOS model, the Moon is the mechanical driver of the entire system
  // Its orbit period sets the fundamental rhythm that all other bodies follow
  const moonOrbitRadius = 55;
  const moonSpeed = 1.2; // Fastest orbit - it drives everything else
  const moonAngle = time * moonSpeed * (Math.PI / 180);
  const moonX = Math.cos(moonAngle) * moonOrbitRadius;
  const moonY = Math.sin(moonAngle) * moonOrbitRadius;

  // Binary orbit parameters (Marika/Radagon)
  // RADAGON IS MARS - In TYCHOS, Mars has a 2:1 orbital resonance with the Moon
  // The Moon's driveshaft directly drives Mars (Radagon) at half its angular velocity
  // This mechanical coupling means the Moon literally powers Radagon's motion
  const binaryOrbitRadius = 25;
  const binarySpeed = moonSpeed * 0.5; // 2:1 ratio - TYCHOS Moon-Mars resonance

  // Calculate binary positions (they orbit each other around the center)
  // Radagon (Mars) is driven by the Moon; Marika orbits opposite to him
  const binaryAngle = time * binarySpeed * (Math.PI / 180);
  const radagonX = Math.cos(binaryAngle) * binaryOrbitRadius; // Radagon leads - driven by Moon
  const radagonY = Math.sin(binaryAngle) * binaryOrbitRadius;
  const marikaX = Math.cos(binaryAngle + Math.PI) * binaryOrbitRadius; // Marika opposite
  const marikaY = Math.sin(binaryAngle + Math.PI) * binaryOrbitRadius;

  // Generate gear teeth for the moon's driveshaft visualization
  const gearTeeth = useMemo(() => {
    const teeth = [];
    const numTeeth = 24;
    for (let i = 0; i < numTeeth; i++) {
      const angle = (i / numTeeth) * Math.PI * 2;
      teeth.push({
        angle,
        innerRadius: moonOrbitRadius - 3,
        outerRadius: moonOrbitRadius + 3,
      });
    }
    return teeth;
  }, []);

  // Stars (frozen until Radahn falls)
  const stars: CelestialBody[] = [
    {
      id: 'star1',
      name: 'Star of Ruin',
      color: '#ff6b6b',
      size: 4,
      orbitRadius: 180,
      orbitSpeed: 0.3,
      startAngle: 0,
    },
    {
      id: 'star2',
      name: 'Star of Darkness',
      color: '#9b59b6',
      size: 3,
      orbitRadius: 200,
      orbitSpeed: 0.25,
      startAngle: 72,
    },
    {
      id: 'star3',
      name: 'Star of Ill Omen',
      color: '#3498db',
      size: 3.5,
      orbitRadius: 165,
      orbitSpeed: 0.35,
      startAngle: 144,
    },
    {
      id: 'star4',
      name: 'Amber Star',
      color: '#f39c12',
      size: 3,
      orbitRadius: 190,
      orbitSpeed: 0.28,
      startAngle: 216,
    },
    {
      id: 'star5',
      name: 'Glintstone Star',
      color: '#1abc9c',
      size: 2.5,
      orbitRadius: 175,
      orbitSpeed: 0.32,
      startAngle: 288,
    },
  ];

  const getPosition = (body: CelestialBody, frozen: boolean = false) => {
    const effectiveSpeed = frozen ? 0 : body.orbitSpeed;
    const angle = (body.startAngle + time * effectiveSpeed) * (Math.PI / 180);
    return {
      x: Math.cos(angle) * body.orbitRadius,
      y: Math.sin(angle) * body.orbitRadius,
    };
  };

  const centerX = 250;
  const centerY = 250;

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center">
        <button
          onClick={() => setRadahnFallen(!radahnFallen)}
          className={`px-4 py-2 rounded font-medium transition-all ${
            radahnFallen
              ? 'bg-red-600 text-white'
              : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
          }`}
        >
          {radahnFallen ? 'Stars Released' : 'Radahn Holds the Stars'}
        </button>
        <button
          onClick={() => setPaused(!paused)}
          className="px-4 py-2 rounded bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]"
        >
          {paused ? 'Resume' : 'Pause'}
        </button>
        <button
          onClick={() => setTime(0)}
          className="px-4 py-2 rounded bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]"
        >
          Reset
        </button>
      </div>

      {/* Orrery */}
      <div className="relative bg-[rgb(5,5,15)] rounded-lg border border-[var(--border-subtle)] overflow-hidden">
        <svg viewBox="0 0 500 500" className="w-full max-w-[600px] mx-auto">
          {/* Orbit paths */}

          {/* Moon driveshaft gear ring */}
          <g transform={`translate(${centerX}, ${centerY})`}>
            {/* Gear teeth - rotating with the moon */}
            {gearTeeth.map((tooth, i) => {
              const rotatedAngle = tooth.angle + moonAngle;
              const x1 = Math.cos(rotatedAngle) * tooth.innerRadius;
              const y1 = Math.sin(rotatedAngle) * tooth.innerRadius;
              const x2 = Math.cos(rotatedAngle) * tooth.outerRadius;
              const y2 = Math.sin(rotatedAngle) * tooth.outerRadius;
              return (
                <line
                  key={`tooth-${i}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="rgba(200,200,220,0.4)"
                  strokeWidth="2"
                />
              );
            })}
            {/* Moon orbit path */}
            <circle
              r={moonOrbitRadius}
              fill="none"
              stroke="rgba(200,200,220,0.3)"
              strokeWidth="2"
            />
          </g>

          {/* Binary orbit path */}
          <circle
            cx={centerX}
            cy={centerY}
            r={binaryOrbitRadius}
            fill="none"
            stroke="rgba(212,175,55,0.3)"
            strokeWidth="1"
            strokeDasharray="4,4"
          />

          {/* Star orbit paths */}
          {stars.map((s) => (
            <circle
              key={`orbit-${s.id}`}
              cx={centerX}
              cy={centerY}
              r={s.orbitRadius}
              fill="none"
              stroke={radahnFallen ? 'rgba(255,255,255,0.1)' : 'rgba(255,0,0,0.2)'}
              strokeWidth="1"
              strokeDasharray={radahnFallen ? '0' : '2,6'}
            />
          ))}

          {/* Erdtree at center */}
          <g transform={`translate(${centerX}, ${centerY})`}>
            {/* Erdtree glow */}
            <circle r="40" fill="url(#erdtreeGlow)" />
            {/* Erdtree trunk */}
            <path
              d="M0,15 L-3,0 L-2,-10 L-5,-15 L0,-30 L5,-15 L2,-10 L3,0 Z"
              fill="#d4af37"
              opacity="0.9"
            />
            {/* Erdtree canopy */}
            <ellipse cx="0" cy="-25" rx="15" ry="20" fill="rgba(212,175,55,0.6)" />
            <ellipse cx="0" cy="-28" rx="10" ry="14" fill="rgba(212,175,55,0.8)" />
          </g>

          {/* Marika */}
          <g transform={`translate(${centerX + marikaX}, ${centerY + marikaY})`}>
            <circle r="12" fill="url(#marikaGlow)" />
            <circle r="8" fill="#f1c40f" />
            <text y="20" textAnchor="middle" fill="white" fontSize="8" fontFamily="serif">
              Marika
            </text>
          </g>

          {/* Radagon (Mars) */}
          <g transform={`translate(${centerX + radagonX}, ${centerY + radagonY})`}>
            <circle r="12" fill="url(#radagonGlow)" />
            <circle r="8" fill="#e74c3c" />
            <text y="20" textAnchor="middle" fill="white" fontSize="8" fontFamily="serif">
              Radagon
            </text>
            <text
              y="28"
              textAnchor="middle"
              fill="rgba(231,76,60,0.7)"
              fontSize="5"
              fontFamily="serif"
            >
              (Mars)
            </text>
          </g>

          {/* Connection line between Marika and Radagon */}
          <line
            x1={centerX + marikaX}
            y1={centerY + marikaY}
            x2={centerX + radagonX}
            y2={centerY + radagonY}
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="1"
            strokeDasharray="4,4"
          />

          {/* THE MOON - The Driveshaft (Same moon, two faces: Full Moon / Dark Moon) */}
          <g transform={`translate(${centerX + moonX}, ${centerY + moonY})`}>
            {/* Mechanical connection lines to center - showing it drives the system */}
            <line
              x1={0}
              y1={0}
              x2={-moonX * 0.7}
              y2={-moonY * 0.7}
              stroke="rgba(200,200,220,0.2)"
              strokeWidth="1"
              strokeDasharray="3,3"
            />
            {/* Moon glow - changes based on which side faces us */}
            <circle r="18" fill={radahnFallen ? 'url(#darkMoonGlow)' : 'url(#moonGlow)'} />

            {/* Moon body - rotating to show different face */}
            {radahnFallen ? (
              <>
                {/* Dark side of the moon (Ranni's Dark Moon) */}
                <circle r="10" fill="#2d3748" />
                {/* Dark side surface - cold and star-touched */}
                <circle cx="-2" cy="-1" r="3" fill="rgba(20,20,40,0.8)" />
                <circle cx="3" cy="2" r="2" fill="rgba(30,30,50,0.7)" />
                {/* Cold stars embedded in dark surface */}
                <circle cx="-3" cy="-3" r="1" fill="#a0aec0" />
                <circle cx="2" cy="-1" r="0.7" fill="#a0aec0" />
                <circle cx="-1" cy="3" r="0.5" fill="#a0aec0" />
                <circle cx="4" cy="3" r="0.6" fill="#a0aec0" />
                {/* Cold rim glow */}
                <circle r="10" fill="none" stroke="rgba(100,130,180,0.4)" strokeWidth="1" />
              </>
            ) : (
              <>
                {/* Bright side of the moon (Rennala's Full Moon) */}
                <circle r="10" fill="#e8e8f0" />
                {/* Crater details */}
                <circle cx="-3" cy="-2" r="2" fill="rgba(180,180,190,0.6)" />
                <circle cx="2" cy="3" r="1.5" fill="rgba(180,180,190,0.5)" />
                <circle cx="4" cy="-1" r="1" fill="rgba(180,180,190,0.4)" />
                <circle cx="-1" cy="4" r="0.8" fill="rgba(180,180,190,0.3)" />
              </>
            )}

            {/* Moon label - changes based on which side faces us */}
            <text
              y="22"
              textAnchor="middle"
              fill={radahnFallen ? '#a0aec0' : 'white'}
              fontSize="7"
              fontFamily="serif"
            >
              {radahnFallen ? 'Dark Moon' : 'Full Moon'}
            </text>
            <text
              y="30"
              textAnchor="middle"
              fill={radahnFallen ? 'rgba(100,100,180,0.7)' : 'rgba(200,200,220,0.7)'}
              fontSize="5"
              fontFamily="serif"
            >
              {radahnFallen ? '(Ranni)' : '(Rennala)'}
            </text>
            <text
              y="38"
              textAnchor="middle"
              fill="rgba(200,200,220,0.5)"
              fontSize="4"
              fontFamily="serif"
            >
              Driveshaft
            </text>
          </g>

          {/* TYCHOS Moon-Mars Mechanical Linkage */}
          {/* The Moon drives Radagon (Mars) - showing the driveshaft connection */}
          <line
            x1={centerX + moonX}
            y1={centerY + moonY}
            x2={centerX + radagonX}
            y2={centerY + radagonY}
            stroke="rgba(231,76,60,0.3)"
            strokeWidth="2"
            strokeDasharray="6,4"
          />
          {/* Gear tooth at the connection point on Moon's side */}
          <circle
            cx={centerX + moonX * 1.15}
            cy={centerY + moonY * 1.15}
            r="3"
            fill="rgba(200,200,220,0.5)"
          />
          {/* Gear tooth at Radagon's side */}
          <circle
            cx={centerX + radagonX * 0.85}
            cy={centerY + radagonY * 0.85}
            r="3"
            fill="rgba(231,76,60,0.5)"
          />

          {/* Stars */}
          {stars.map((s) => {
            const pos = getPosition(s, !radahnFallen);
            return (
              <g key={s.id} transform={`translate(${centerX + pos.x}, ${centerY + pos.y})`}>
                {/* Star glow */}
                <circle r={s.size * 2} fill={`${s.color}33`} />
                <circle r={s.size} fill={s.color} />
                {/* Frozen indicator */}
                {!radahnFallen && (
                  <circle r={s.size + 4} fill="none" stroke="rgba(231,76,60,0.5)" strokeWidth="1" />
                )}
              </g>
            );
          })}

          {/* Gradient definitions */}
          <defs>
            <radialGradient id="erdtreeGlow">
              <stop offset="0%" stopColor="rgba(212,175,55,0.4)" />
              <stop offset="100%" stopColor="rgba(212,175,55,0)" />
            </radialGradient>
            <radialGradient id="marikaGlow">
              <stop offset="0%" stopColor="rgba(241,196,15,0.6)" />
              <stop offset="100%" stopColor="rgba(241,196,15,0)" />
            </radialGradient>
            <radialGradient id="radagonGlow">
              <stop offset="0%" stopColor="rgba(231,76,60,0.6)" />
              <stop offset="100%" stopColor="rgba(231,76,60,0)" />
            </radialGradient>
            <radialGradient id="moonGlow">
              <stop offset="0%" stopColor="rgba(232,232,240,0.5)" />
              <stop offset="100%" stopColor="rgba(232,232,240,0)" />
            </radialGradient>
            <radialGradient id="darkMoonGlow">
              <stop offset="0%" stopColor="rgba(100,100,180,0.4)" />
              <stop offset="100%" stopColor="rgba(100,100,180,0)" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full relative overflow-hidden">
            <div
              className="absolute inset-0 bg-[#e8e8f0]"
              style={{ clipPath: 'inset(0 50% 0 0)' }}
            />
            <div
              className="absolute inset-0 bg-[#2d3748]"
              style={{ clipPath: 'inset(0 0 0 50%)' }}
            />
          </div>
          <span className="text-[var(--text-secondary)]">The Moon (Full/Dark)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#f1c40f]" />
          <span className="text-[var(--text-secondary)]">Marika</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#e74c3c]" />
          <span className="text-[var(--text-secondary)]">Radagon (Mars)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#d4af37]" />
          <span className="text-[var(--text-secondary)]">Erdtree</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-0.5 bg-[rgba(231,76,60,0.5)]" style={{ borderStyle: 'dashed' }} />
          <span className="text-[var(--text-secondary)]">Moon-Mars Linkage</span>
        </div>
      </div>

      {/* Explanation */}
      <div className="text-sm text-[var(--text-tertiary)] space-y-2">
        <p>
          <strong className="text-[var(--text-secondary)]">The Moon as Driveshaft:</strong> In the
          TYCHOS model, the Moon acts as the mechanical driver of the entire solar system&mdash;a
          driveshaft that keeps all other bodies in synchronized motion. The rotating gear teeth
          show how its orbit powers the entire celestial mechanism.
        </p>
        <p>
          <strong className="text-[var(--text-secondary)]">Radagon is Mars:</strong> The Moon-Mars
          relationship in TYCHOS shows Mars orbiting at exactly half the Moon&apos;s angular
          velocity&mdash;a 2:1 resonance. In the Lands Between, Radagon (the red-haired warrior god){' '}
          <em>is</em> Mars. The dashed line shows the mechanical linkage: the Moon literally drives
          Radagon&apos;s motion. Mars does not move independently; it is coupled to the lunar
          driveshaft.
        </p>
        <p>
          <strong className="text-[var(--text-secondary)]">One Moon, Two Faces:</strong>{' '}
          Rennala&apos;s Full Moon and Ranni&apos;s Dark Moon are the <em>same celestial body</em>
          &mdash;just different sides. While Radahn holds the stars, we see the bright side
          (Rennala&apos;s domain, the Academy, order). When Radahn falls, the Moon turns to show its
          dark side (Ranni&apos;s domain, enabling the Age of Stars). Mother and daughter share the
          same celestial inheritance.
        </p>
        <p>
          <strong className="text-[var(--text-secondary)]">The Binary System:</strong> Marika and
          Radagon orbit each other as a true syzygy&mdash;two gods sharing one vessel but retaining
          distinct wills. The Erdtree sits at their barycenter, the axis around which all else
          revolves.
        </p>
        <p>
          <strong className="text-[var(--text-secondary)]">Radahn&apos;s Gravity:</strong> While
          Radahn lives, his mastery of gravity magic holds the stars frozen in place. Toggle
          &quot;Stars Released&quot; to see what happens when he falls&mdash;the stars resume their
          motion, the Moon turns to its dark side, and Ranni&apos;s ending becomes possible.
        </p>
      </div>
    </div>
  );
}
