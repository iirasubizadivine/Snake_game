'use client';
import Link from "next/link";

const levels = [];
for (let i = 1; i <= 9; i++) {
  levels.push(i);
}

export default function LevelsPage() {
  return (
    <div style={{
      position: 'absolute',
      top: '50px',
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#09090b',
      color: '#ffffff',
      fontFamily: 'sans-serif',
      padding: '16px',
      boxSizing: 'border-box',
      overflow: 'hidden' 
    }}>
      <header style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          letterSpacing: '-0.025em',
          margin: 0
        }}>
          SELECT A LEVEL
        </h1>
        <p style={{
          fontSize: '0.9rem',
          color: '#71717a',
          marginTop: '6px',
          marginBottom: 0
        }}>
          Choose your stage to begin the breakout game
        </p>
      </header>
    
      <div style={{
        display: 'grid',
        width: '100%',
        maxWidth: '380px',
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
        gap: '12px'
      }}>
        {levels.map((levelNum) => (
          <div key={levelNum}>
            <Link 
              href={`/games/breakout/levels/${levelNum}`}
              style={{ textDecoration: 'none', display: 'block' }}
            >
              <button
                style={{
                  height: '76px',
                  width: '100%',
                  backgroundColor: 'rgba(33, 3, 67, 0.05)',
                  border: '2px solid rgba(99, 7, 73, 0.4)',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#ffffff', 
                  cursor: 'pointer',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxSizing: 'border-box',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.borderColor = 'rgb(147, 51, 234)';
                  e.currentTarget.style.boxShadow = '0 0 15px rgba(147, 51, 234, 0.4)';
                  e.currentTarget.style.backgroundColor = 'rgba(147, 51, 234, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.borderColor = 'rgba(99, 7, 73, 0.4)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.backgroundColor = 'rgba(33, 3, 67, 0.05)';
                }}
              >
                {levelNum}
              </button>
            </Link>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '24px' }}>
        <Link href="/games/breakout" style={{ textDecoration: 'none' }}>
          <button 
            style={{ 
              cursor: 'pointer',
              color: '#a1a1aa',
              backgroundColor: 'transparent',
              border: 'none',
              fontSize: '0.875rem',
              fontFamily: 'sans-serif',
              transition: 'color 0.2s' 
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#a1a1aa'}
          >
            ← Back to Start Screen
          </button>
        </Link>
      </div>
    </div>
  );
}
