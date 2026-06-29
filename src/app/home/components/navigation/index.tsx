'use client';

import { useEffect, useState } from 'react';

type Section = 'about' | 'experience' | 'contact';

interface NavProps {
  activePanel: Section | null;
  onSelect: (section: Section | null) => void;
}

const navItems: { label: string; id: Section; index: string }[] = [
  { label: 'About',      id: 'about',      index: '01' },
  { label: 'Experience', id: 'experience', index: '02' },
  { label: 'Contact',    id: 'contact',    index: '03' },
];

export default function Nav({ activePanel, onSelect }: NavProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Staggered mount animation
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  const handleClick = (id: Section) => {
    onSelect(activePanel === id ? null : id);
  };

  return (
    <>
      {/* ── Desktop: vertical nav pinned to the left ─────────────────── */}
      <nav
        aria-label="Main navigation"
        className="hidden md:flex"
        style={{
          position:       'fixed',
          left:           0,
          top:            0,
          height:         '100vh',
          width:          '72px',
          zIndex:         50,
          flexDirection:  'column',
          alignItems:     'center',
          justifyContent: 'space-between',
          paddingTop:     '2.5rem',
          paddingBottom:  '2.5rem',
          pointerEvents:  'auto',
          // Subtle frosted glass strip
          background:     'rgba(255,255,255,0.6)',
          backdropFilter: 'blur(12px)',
          borderRight:    '1px solid rgba(0,0,0,0.06)',
        }}
      >
        {/* Wordmark — rotated vertical */}
        <div
          style={{
            transform:   'rotate(-90deg)',
            whiteSpace:  'nowrap',
            fontSize:    '10px',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color:       '#999',
            opacity:     mounted ? 1 : 0,
            transition:  'opacity 0.6s ease 0.1s',
          }}
        >
          Nicole Shoko
        </div>

        {/* Nav items */}
        <ul
          style={{
            listStyle:     'none',
            margin:        0,
            padding:       0,
            display:       'flex',
            flexDirection: 'column',
            gap:           '2rem',
            alignItems:    'center',
          }}
        >
          {navItems.map((item, i) => {
            const isActive = activePanel === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleClick(item.id)}
                  aria-pressed={isActive}
                  style={{
                    background:    'none',
                    border:        'none',
                    cursor:        'pointer',
                    display:       'flex',
                    flexDirection: 'column',
                    alignItems:    'center',
                    gap:           '6px',
                    padding:       '4px',
                    opacity:       mounted ? 1 : 0,
                    transition:    `opacity 0.5s ease ${0.2 + i * 0.1}s`,
                  }}
                >
                  {/* Index number */}
                  <span
                    style={{
                      fontSize:      '9px',
                      letterSpacing: '0.15em',
                      color:         isActive ? '#141414' : '#bbb',
                      transition:    'color 0.3s ease',
                    }}
                  >
                    {item.index}
                  </span>

                  {/* Rotating label */}
                  <span
                    style={{
                      fontSize:      '10px',
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      color:         isActive ? '#141414' : '#888',
                      writingMode:   'vertical-rl',
                      transform:     'rotate(180deg)',
                      transition:    'color 0.3s ease',
                    }}
                  >
                    {item.label}
                  </span>

                  {/* Active indicator dot */}
                  <span
                    style={{
                      width:         '4px',
                      height:        '4px',
                      borderRadius:  '50%',
                      background:    isActive ? '#141414' : 'transparent',
                      border:        '1px solid #ccc',
                      transition:    'background 0.3s ease',
                    }}
                  />
                </button>
              </li>
            );
          })}
        </ul>

        {/* Bottom decorative line */}
        <div
          style={{
            width:      '1px',
            height:     '48px',
            background: 'linear-gradient(to bottom, #ccc, transparent)',
            opacity:    mounted ? 1 : 0,
            transition: 'opacity 0.6s ease 0.5s',
          }}
        />
      </nav>

      {/* ── Mobile: bottom bar ───────────────────────────────────────── */}
      <nav
        aria-label="Main navigation"
        className="flex md:hidden"
        style={{
          position:       'fixed',
          bottom:         0,
          left:           0,
          right:          0,
          height:         '64px',
          zIndex:         50,
          flexDirection:  'row',
          alignItems:     'center',
          justifyContent: 'space-around',
          background:     'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(16px)',
          borderTop:      '1px solid rgba(0,0,0,0.06)',
          pointerEvents:  'auto',
          opacity:        mounted ? 1 : 0,
          transition:     'opacity 0.5s ease 0.3s',
        }}
      >
        {navItems.map((item) => {
          const isActive = activePanel === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleClick(item.id)}
              aria-pressed={isActive}
              style={{
                background:    'none',
                border:        'none',
                cursor:        'pointer',
                display:       'flex',
                flexDirection: 'column',
                alignItems:    'center',
                gap:           '4px',
                padding:       '8px 16px',
                pointerEvents: 'auto',
              }}
            >
              <span
                style={{
                  fontSize:      '9px',
                  letterSpacing: '0.15em',
                  color:         isActive ? '#141414' : '#bbb',
                  transition:    'color 0.3s ease',
                }}
              >
                {item.index}
              </span>
              <span
                style={{
                  fontSize:      '11px',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color:         isActive ? '#141414' : '#888',
                  transition:    'color 0.3s ease',
                }}
              >
                {item.label}
              </span>
              {/* Active underline */}
              <span
                style={{
                  width:      isActive ? '100%' : '0%',
                  height:     '1px',
                  background: '#141414',
                  transition: 'width 0.3s ease',
                  display:    'block',
                }}
              />
            </button>
          );
        })}
      </nav>
    </>
  );
}