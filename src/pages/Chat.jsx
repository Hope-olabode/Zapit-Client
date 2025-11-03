import React from "react";

function polarToCartesian(cx, cy, r, angle) {
  const rad = (Math.PI / 180) * (angle - 90);
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function arcPath(cx, cy, outerR, innerR, startAngle, endAngle) {
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1;

  const startOuter = polarToCartesian(cx, cy, outerR, startAngle);
  const endOuter = polarToCartesian(cx, cy, outerR, endAngle);
  const startInner = polarToCartesian(cx, cy, innerR, endAngle);
  const endInner = polarToCartesian(cx, cy, innerR, startAngle);

  return `
    M ${startOuter.x} ${startOuter.y}
    A ${outerR} ${outerR} 0 ${largeArc} 1 ${endOuter.x} ${endOuter.y}
    L ${startInner.x} ${startInner.y}
    A ${innerR} ${innerR} 0 ${largeArc} 0 ${endInner.x} ${endInner.y}
    Z
  `;
}

export default function VariableInnerDonut() {
  const data = [
    { name: "A", value: 65, color: "#0088FE", inner: 50 },
    { name: "B", value: 15, color: "#00C49F", inner: 80 },
    { name: "C", value: 20, color: "#FFBB28", inner: 60 },
    
  ];

  const total = data.reduce((sum, d) => sum + d.value, 0);
  let startAngle = 0;
  const outerR = 140;
  const cx = 150;
  const cy = 150;

  return (
    <div className="flex justify-center items-center h-[400px]">
      <svg width="300" height="300" viewBox="0 0 300 300">
        {data.map((d, i) => {
          const angle = (d.value / total) * 360;
          const endAngle = startAngle + angle;
          const midAngle = startAngle + angle / 2;

          const path = arcPath(cx, cy, outerR, d.inner, startAngle, endAngle);

          // find midpoint radius between inner and outer
          const midR = (outerR + d.inner) / 2;
          const { x, y } = polarToCartesian(cx, cy, midR, midAngle);

          // compute % value
          const percent = ((d.value / total) * 100).toFixed(0) + "%";

          startAngle = endAngle;

          return (
            <g key={i}>
              <path
                d={path}
                fill={d.color}
                stroke="#fff"
                strokeWidth="2"
                style={{ transition: "0.3s" }}
              />
              <text
                x={x}
                y={y}
                fill="white"
                fontSize="14"
                fontWeight="bold"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {percent}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
