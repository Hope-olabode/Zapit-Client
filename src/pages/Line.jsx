import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const MultiLineChart = () => {
  const [hoveredLine, setHoveredLine] = useState(null);

  // Generate data for 12 months
  const data = [
    { month: 'Jan', line1: 30, line2: 45, line3: 25 },
    { month: 'Feb', line1: 45, line2: 52, line3: 35 },
    { month: 'Mar', line1: 38, line2: 48, line3: 42 },
    { month: 'Apr', line1: 55, line2: 61, line3: 38 },
    { month: 'May', line1: 48, line2: 55, line3: 50 },
    { month: 'Jun', line1: 62, line2: 68, line3: 55 },
    { month: 'Jul', line1: 58, line2: 65, line3: 62 },
    { month: 'Aug', line1: 70, line2: 75, line3: 58 },
    { month: 'Sep', line1: 65, line2: 70, line3: 68 },
    { month: 'Oct', line1: 75, line2: 80, line3: 72 },
    { month: 'Nov', line1: 82, line2: 85, line3: 78 },
    { month: 'Dec', line1: 90, line2: 92, line3: 85 }
  ];

  const lines = [
    { dataKey: 'line1', color: '#3b82f6', name: 'Product A' },
    { dataKey: 'line2', color: '#10b981', name: 'Product B' },
    { dataKey: 'line3', color: '#f59e0b', name: 'Product C' }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length > 0 && hoveredLine) {
      const data = payload.find(p => p.dataKey === hoveredLine);
      if (data) {
        return (
          <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-3">
            <p className="font-semibold text-gray-800">{label}</p>
            <p style={{ color: data.color }} className="font-medium">
              {data.name}: {data.value}
            </p>
          </div>
        );
      }
    }
    return null;
  };

  const handleMouseEnter = (lineKey) => {
    setHoveredLine(lineKey);
  };

  const handleMouseLeave = () => {
    setHoveredLine(null);
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8 flex flex-col items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-6xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Sales Performance</h2>
        <p className="text-gray-600 mb-6">Monthly comparison across product lines</p>
        
        <ResponsiveContainer width="100%" height={500}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <XAxis 
              dataKey="month" 
              stroke="#6b7280"
              style={{ fontSize: '14px', fontWeight: '500' }}
            />
            <YAxis 
              stroke="#6b7280"
              style={{ fontSize: '14px', fontWeight: '500' }}
            />
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{ 
                stroke: hoveredLine ? lines.find(l => l.dataKey === hoveredLine).color : 'transparent',
                strokeWidth: 2
              }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="line"
            />
            
            {lines.map((line) => (
              <Line
                key={line.dataKey}
                type="monotone"
                dataKey={line.dataKey}
                stroke={line.color}
                strokeWidth={hoveredLine === line.dataKey ? 4 : 2}
                name={line.name}
                dot={false}
                activeDot={{ 
                  r: 8,
                  fill: line.color,
                  stroke: '#fff',
                  strokeWidth: 3,
                  onMouseEnter: () => handleMouseEnter(line.dataKey),
                  onMouseLeave: handleMouseLeave
                }}
                onMouseEnter={() => handleMouseEnter(line.dataKey)}
                onMouseLeave={handleMouseLeave}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MultiLineChart;