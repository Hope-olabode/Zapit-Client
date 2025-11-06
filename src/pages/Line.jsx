import { useState } from "react";

export default function SmoothLineChart() {
  const values = [40, 70, 20, 90, 50];
  const width = 300;
  const height = 150;
  const gap = width / (values.length + 1);

  const [hover, setHover] = useState(null);

  const points = values.map((v, i) => ({
    x: gap * (i + 1),
    y: height - v,
    value: v,
  }));

  const catmullRom2Bezier = (pts) => {
    let d = "";
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      if (i === 0) d += `M ${p1.x},${p1.y}`;
      d += ` C ${cp1x},${cp1y}, ${cp2x},${cp2y}, ${p2.x},${p2.y}`;
    }
    return d;
  };

  const path = catmullRom2Bezier(points);

  return (
    <div style={{ position: "relative", width }}>
      {hover && (
        <div
          style={{
            position: "absolute",
            left: hover.x - 10,
            top: hover.y - 35,
            background: "black",
            color: "white",
            padding: "4px 6px",
            borderRadius: "4px",
            fontSize: "12px",
            pointerEvents: "none",
          }}
        >
          {hover.value}
        </div>
      )}

      <svg width={width} height={height} style={{ background: "#fafafa" }}>
        {/* Main smooth curve */}
        <path
          d={path}
          fill="none"
          stroke="red"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {points.map((p, i) => (
          <g key={i}>
            {/* Show vertical line only on hover */}
            <line
              x1={p.x}
              y1={height}
              x2={p.x}
              y2={p.y}
              stroke="red"
              strokeWidth="1.5"
              opacity={hover?.x === p.x ? 1 : 0}
            />

            {/* Visible circle only on hover */}
            <circle
              cx={p.x}
              cy={p.y}
              r={6}
              fill="white"
              stroke="red"
              strokeWidth="2"
              opacity={hover?.x === p.x ? 1 : 0}
            />

            {/* 🔥 Invisible small hover-target just around the point */}
            <circle
              cx={p.x}
              cy={p.y}
              r={10} /* this controls hover sensitivity */
              fill="transparent"
              onMouseEnter={() => setHover(p)}
              onMouseLeave={() => setHover(null)}
              style={{ cursor: "pointer" }}
            />
          </g>
        ))}
      </svg>
    </div>
  );
}
