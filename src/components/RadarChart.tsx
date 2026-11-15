import React from 'react';
import Svg, { Polygon, Line, Text as SvgText, TSpan } from 'react-native-svg';

type RadarDatum = { label: string; level: number };

type RadarChartProps = {
  data: RadarDatum[];
  size?: number;
  maxLevel?: number;
  gridColor: string;
  fillColor: string;
  strokeColor: string;
  labelColor: string;
};

export default function RadarChart({
  data,
  size = 300,
  maxLevel = 4,
  gridColor,
  fillColor,
  strokeColor,
  labelColor,
}: RadarChartProps) {
  const cx = size / 2;
  const cy = size / 2;
  const labelPadding = 46;
  const maxRadius = size / 2 - labelPadding;
  const count = data.length;

  function pointFor(index: number, radius: number): [number, number] {
    const angle = (-90 + index * (360 / count)) * (Math.PI / 180);
    return [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)];
  }

  function ringPoints(radiusRatio: number): string {
    return Array.from({ length: count })
      .map((_, i) => pointFor(i, maxRadius * radiusRatio).join(','))
      .join(' ');
  }

  const dataPoints = data
    .map((d, i) => pointFor(i, (d.level / maxLevel) * maxRadius).join(','))
    .join(' ');

  return (
    <Svg width={size} height={size}>
      {[0.25, 0.5, 0.75, 1].map((ratio) => (
        <Polygon
          key={ratio}
          points={ringPoints(ratio)}
          fill="none"
          stroke={gridColor}
          strokeWidth={1}
        />
      ))}

      {data.map((_, i) => {
        const [x, y] = pointFor(i, maxRadius);
        return (
          <Line
            key={i}
            x1={cx}
            y1={cy}
            x2={x}
            y2={y}
            stroke={gridColor}
            strokeWidth={1}
          />
        );
      })}

      <Polygon
        points={dataPoints}
        fill={fillColor}
        fillOpacity={0.35}
        stroke={strokeColor}
        strokeWidth={2}
      />

      {data.map((d, i) => {
        const [x, y] = pointFor(i, maxRadius + 22);
        const dx = x - cx;
        const dy = y - cy;
        // Only the two genuine side points (where the vertex is more
        // left/right than up/down) get inward anchoring. The top and
        // bottom-ish points stay centered on their own vertex so adjacent
        // bottom labels (Relationships / Private Life) don't converge
        // toward the same central point and collide.
        const isSideLabel = Math.abs(dx) > Math.abs(dy);
        const textAnchor: 'start' | 'middle' | 'end' = !isSideLabel
          ? 'middle'
          : dx > 0
            ? 'end'
            : 'start';

        // Render multi-word labels as controlled, centered stacked lines
        // rather than risking an uncontrolled/uneven wrap.
        const words = d.label.toUpperCase().split(' ');
        const lineHeight = 12;
        const firstLineDy = -((words.length - 1) * lineHeight) / 2;

        return (
          <SvgText
            key={d.label}
            x={x}
            y={y}
            fontSize={10.5}
            fontWeight="600"
            fill={labelColor}
            textAnchor={textAnchor}
          >
            {words.map((word, wi) => (
              <TSpan
                key={word}
                x={x}
                dy={wi === 0 ? firstLineDy : lineHeight}
              >
                {word}
              </TSpan>
            ))}
          </SvgText>
        );
      })}
    </Svg>
  );
}
