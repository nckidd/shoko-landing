'use client';

import { useEffect, useRef } from 'react';

interface InfoPanelProps {
  isOpen:   boolean;
  onClose:  () => void;
  children: React.ReactNode;
}

export default function InfoPanel({ isOpen, onClose, children }: InfoPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  // Trap scroll inside panel when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      {/* ── Backdrop — click to close ─────────────────────────────────── */}
      <div
        aria-hidden="true"
        onClick={onClose}
        style={{
          position:   'fixed',
          inset:      0,
          zIndex:     39,
          background: 'rgba(0,0,0,0.15)',
          backdropFilter: 'blur(2px)',
          opacity:    isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 0.4s ease',
        }}
      />

      {/* ── Panel ─────────────────────────────────────────────────────── */}
      <aside
        ref={panelRef}
        aria-modal="true"
        role="dialog"
        style={{
          position:   'fixed',
          top:        0,
          right:      0,
          height:     '100dvh', // dvh instead of vh — accounts for mobile browser chrome
          maxHeight:  '100dvh',
          overflowY:  'scroll', // scroll instead of auto — forces scrollbar track to exist
          // Full width on mobile, capped on desktop
          width:      'min(680px, 100vw)',
          zIndex:     40,
          //overflowY:  'auto',
          overflowX:  'hidden',
          background: '#fafaf8',
          borderLeft: '1px solid rgba(0,0,0,0.06)',
          pointerEvents: 'auto',
          // Slide in from right
          transform:  isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          // Leave room for the desktop nav on the left
          paddingBottom: '80px', // clears mobile bottom bar
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close panel"
          style={{
            position:   'sticky',
            top:        '1.5rem',
            left:       'calc(100% - 3.5rem)',
            zIndex:     10,
            display:    'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width:      '36px',
            height:     '36px',
            background: 'none',
            border:     '1px solid rgba(0,0,0,0.12)',
            borderRadius: '50%',
            cursor:     'pointer',
            color:      '#666',
            fontSize:   '16px',
            lineHeight: 1,
            transition: 'background 0.2s ease, color 0.2s ease',
            marginLeft: 'auto',
            marginRight: '1.5rem',
            marginTop:  '1.5rem',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = '#141414';
            (e.currentTarget as HTMLButtonElement).style.color      = '#fff';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'none';
            (e.currentTarget as HTMLButtonElement).style.color      = '#666';
          }}
        >
          ×
        </button>

        {/* Decorative top rule */}
        <div
          style={{
            height:     '1px',
            background: 'linear-gradient(to right, transparent, #ccc 30%, transparent)',
            margin:     '0 2rem 2rem',
            opacity:    isOpen ? 1 : 0,
            transition: 'opacity 0.6s ease 0.3s',
          }}
        />

        {/* Content — your existing section components drop in here */}
        <div
          style={{
            opacity:    isOpen ? 1 : 0,
            transform:  isOpen ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s',
            // Give the content padding so it doesn't press against the edges
            padding:    '0 2.5rem 3rem',
          }}
        >
          {children}
        </div>

        {/* Decorative bottom index */}
        <div
          style={{
            position:      'sticky',
            bottom:        '1.5rem',
            right:         '2rem',
            textAlign:     'right',
            paddingRight:  '2rem',
            fontSize:      '10px',
            letterSpacing: '0.2em',
            color:         '#ccc',
            fontFamily:    '"Cormorant Garamond", serif',
            pointerEvents: 'none',
            opacity:       isOpen ? 1 : 0,
            transition:    'opacity 0.4s ease 0.4s',
          }}
        >
          NS — PORTFOLIO
        </div>
      </aside>
    </>
  );
}