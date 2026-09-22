import { useState, useEffect } from 'react';

// Internal SVG coordinate constants (viewBox space — scales automatically)
const CELL    = 16;
const GAP     = 4;
const DL_W    = 28;  // day-label column width
const ML_H    = 20;  // month-label row height
const LEGEND_H = 28; // legend row height below grid

const MONTH_LABELS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAY_LABELS   = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

const getColor = (count, theme) => {
  if (count === 0) return theme === 'light' ? 'rgba(0,0,0,0.07)' : 'rgba(255,255,255,0.06)';
  if (count <= 2)  return theme === 'light' ? 'rgba(0,92,151,0.3)'  : 'rgba(100,255,218,0.22)';
  if (count <= 5)  return theme === 'light' ? 'rgba(0,92,151,0.55)' : 'rgba(100,255,218,0.48)';
  if (count <= 10) return theme === 'light' ? 'rgba(0,92,151,0.78)' : 'rgba(100,255,218,0.72)';
  return theme === 'light' ? '#005c97' : '#64ffda';
};

const getStroke = (count) =>
  count > 0
    ? `rgba(100,255,218,${Math.min(0.55, count * 0.05 + 0.12)})`
    : 'rgba(255,255,255,0.05)';

export default function GitHubHeatmap({ username, theme }) {
  const [weeks,  setWeeks]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,  setError]  = useState(false);
  const [total,  setTotal]  = useState(0);

  useEffect(() => {
    setLoading(true);
    setError(false);
    fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`)
      .then(r => r.json())
      .then(data => {
        const contributions = data.contributions || [];
        setTotal(contributions.reduce((s, d) => s + d.count, 0));

        // Group into weeks (7 days per column)
        const grouped = [];
        let week = [];
        contributions.forEach(day => {
          week.push(day);
          if (week.length === 7) { grouped.push(week); week = []; }
        });
        if (week.length) grouped.push(week);
        setWeeks(grouped);
        setLoading(false);
      })
      .catch(() => { setError(true); setLoading(false); });
  }, [username]);

  // ---------- layout ----------
  const W = weeks.length || 53;
  // SVG viewBox size (internal units — browser scales to fit width: 100%)
  const VW = DL_W + W * (CELL + GAP) - GAP;
  const VH = ML_H + 7 * (CELL + GAP) - GAP + LEGEND_H + 8;

  // Month label x positions
  const monthPositions = [];
  weeks.forEach((week, wi) => {
    if (!week[0]) return;
    const month = new Date(week[0].date).getMonth();
    if (!monthPositions.length || monthPositions[monthPositions.length - 1].month !== month) {
      monthPositions.push({ month, wi });
    }
  });

  // ---------- card wrapper style ----------
  const card = {
    padding: '1.4rem 0.6rem 1rem',
    background: 'var(--glass-card-bg)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderRadius: '12px',
    border: '1px solid rgba(100,255,218,0.1)',
    boxShadow: '0 8px 32px rgba(2,12,27,0.4)',
    width: '100%',
    boxSizing: 'border-box',
  };

  if (loading) return (
    <div style={{ ...card, minHeight: 140, display: 'flex', alignItems: 'center',
      justifyContent: 'center', gap: 10, color: 'var(--text-color)',
      fontFamily: 'Space Grotesk, monospace', fontSize: '0.9rem' }}>
      <span style={{ color: 'var(--accent)', animation: 'pulse 1.5s infinite' }}>●</span>
      Loading contribution data…
    </div>
  );

  if (error) return (
    <div style={{ ...card, textAlign: 'center', color: 'var(--text-color)',
      fontFamily: 'Space Grotesk, monospace', fontSize: '0.9rem' }}>
      <i className="bi bi-github"
        style={{ fontSize: '2rem', color: 'var(--accent)', marginBottom: '1rem', display: 'block' }} />
      Could not load contribution data.{' '}
      <a href={`https://github.com/${username}`} target="_blank" rel="noreferrer"
        style={{ color: 'var(--accent)' }}>View on GitHub →</a>
    </div>
  );

  return (
    <div style={card}>

      {/* ---- Header ---- */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 8, marginBottom: '1rem', padding: '0 0.6rem' }}>
        <div style={{ fontFamily: 'Space Grotesk, monospace', fontSize: '0.9rem',
          color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <i className="bi bi-github" style={{ color: 'var(--accent)', fontSize: '1.1rem' }} />
          <a href={`https://github.com/${username}`} target="_blank" rel="noreferrer"
            style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 700 }}>
            @{username}
          </a>
          <span style={{ opacity: 0.55 }}>— last 12 months</span>
        </div>
        <div style={{
          background: 'rgba(100,255,218,0.1)', border: '1px solid rgba(100,255,218,0.25)',
          borderRadius: 20, padding: '4px 14px', fontFamily: 'Space Grotesk, monospace',
          fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 700,
        }}>
          {total.toLocaleString()} contributions
        </div>
      </div>

      {/* ---- SVG Heatmap — scales to 100% width automatically ---- */}
      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        width="100%"
        height="auto"
        style={{ display: 'block', overflow: 'visible' }}
      >
        {/* Month labels */}
        {monthPositions.map(({ month, wi }, i) => (
          <text key={i}
            x={DL_W + wi * (CELL + GAP)}
            y={ML_H - 4}
            fill="rgba(180,180,200,0.55)"
            fontSize={8.5}
            fontFamily="Space Grotesk, monospace"
          >
            {MONTH_LABELS[month]}
          </text>
        ))}

        {/* Day-of-week labels */}
        {DAY_LABELS.map((label, di) => label && (
          <text key={di}
            x={DL_W - 4}
            y={ML_H + di * (CELL + GAP) + CELL * 0.78}
            fill="rgba(180,180,200,0.5)"
            fontSize={8}
            fontFamily="Space Grotesk, monospace"
            textAnchor="end"
          >
            {label}
          </text>
        ))}

        {/* Contribution cells */}
        {weeks.map((week, wi) =>
          week.map((day, di) => (
            <rect key={`${wi}-${di}`}
              x={DL_W + wi * (CELL + GAP)}
              y={ML_H + di * (CELL + GAP)}
              width={CELL}
              height={CELL}
              rx={2.5}
              fill={getColor(day.count, theme)}
              stroke={getStroke(day.count)}
              strokeWidth={0.5}
            >
              <title>
                {`${day.count} contribution${day.count !== 1 ? 's' : ''} on ${new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
              </title>
            </rect>
          ))
        )}

        {/* Legend */}
        {(() => {
          const ly = ML_H + 7 * (CELL + GAP) + 6;
          const levels = [0, 2, 5, 10, 15];
          const rectWidth = 10;
          const rectGap = 4;
          const stride = rectWidth + rectGap;
          const totalRectsWidth = levels.length * stride - rectGap;
          
          // Leave 28px on the right for the word "More"
          const lx = VW - totalRectsWidth - 28; 

          return (
            <>
              <text x={lx - 6} y={ly + 8.5} fill="rgba(180,180,200,0.5)"
                fontSize={8} fontFamily="Space Grotesk, monospace" textAnchor="end">Less</text>
              
              {levels.map((v, i) => (
                <rect key={i}
                  x={lx + i * stride}
                  y={ly}
                  width={rectWidth} height={rectWidth} rx={2}
                  fill={getColor(v, theme)}
                  stroke={v > 0 ? 'rgba(100,255,218,0.3)' : 'rgba(255,255,255,0.06)'}
                  strokeWidth={0.5}
                />
              ))}
              
              <text x={lx + totalRectsWidth + 6} y={ly + 8.5} fill="rgba(180,180,200,0.5)"
                fontSize={8} fontFamily="Space Grotesk, monospace" textAnchor="start">More</text>
            </>
          );
        })()}
      </svg>

    </div>
  );
}
