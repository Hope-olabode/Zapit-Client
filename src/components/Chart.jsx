import React from "react";

function polarToCartesian(cx, cy, r, angle) {
  const rad = (Math.PI / 180) * (angle - 90);
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function arcPath(cx, cy, outerR, innerR, startAngle, endAngle) {
  const angleSpan = endAngle - startAngle;
  
  // Handle full circle case
  if (angleSpan >= 360) {
    return `
      M ${cx + outerR} ${cy}
      A ${outerR} ${outerR} 0 1 1 ${cx + outerR} ${cy - 0.001}
      L ${cx + innerR} ${cy - 0.001}
      A ${innerR} ${innerR} 0 1 0 ${cx + innerR} ${cy}
      Z
    `;
  }
  
  const largeArc = angleSpan <= 180 ? 0 : 1;
  
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



export default function VariableInnerDonut({value1, value2, value3}) {
  const data = [
    { name: "A", value: value1, color: "#FFC529", inner: 50, textColor: "#1B1D22" },
    { name: "B", value: value2, color: "#1513EC", inner: 70, textColor: "#F6F7F9" },
    { name: "C", value: value3, color: "#48BB78", inner: 60, textColor: "#1B1D22" },
    
  ];

  const activeData = data.filter(d => d.value > 0);
  const total = activeData.reduce((sum, d) => sum + d.value, 0);
  let startAngle = 45;
  const outerR = 140;
  const cx = 150;
  const cy = 150;

  return (
  <div className="flex items-center justify-center h-full w-full">
    <svg width="208" height="208" viewBox="0 0 300 300">
      {activeData.map((d, i) => {
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
              stroke="#000"
              strokeWidth="2"
              style={{ transition: "0.3s" }}
            />
            <text
              x={x}
              y={y}
              fill={d.textColor}
              fontSize="24"
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
