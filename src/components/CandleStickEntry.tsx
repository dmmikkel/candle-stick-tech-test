export type CandleStickEntryProps = {
  width: number;
  high: number;
  low: number;
  open: number;
  close: number;
  yScale: number;
  dimmed?: boolean;
};

const CandleStickEntry = ({
  width,
  high,
  low,
  open,
  close,
  yScale,
  dimmed,
}: CandleStickEntryProps) => {
  const isPositive = open < close;
  const totalHeight = high - low;
  const bodyTop = Math.max(open, close);
  const bodyBottom = Math.min(open, close);
  const bodyHeight = bodyTop - bodyBottom;
  const bodyYOffset = high - bodyTop;

  const getRectFillColor = () => {
    if (dimmed) {
      return isPositive ? '#4ade80' : '#f87171';
    }
    return isPositive ? '#22c55e' : '#ef4444';
  };

  return (
    <g>
      <rect
        x="-1"
        y="0"
        width={width + 1}
        height={totalHeight * yScale}
        fill="transparent"
      />
      <line
        x1={width / 2}
        y1="0"
        x2={width / 2}
        y2={totalHeight * yScale}
        strokeWidth={2}
        stroke={dimmed ? 'rgb(100, 100, 100)' : 'black'}
      />
      <rect
        x="0"
        y={bodyYOffset * yScale}
        width={width}
        height={bodyHeight * yScale}
        fill={getRectFillColor()}
      />
    </g>
  );
};

export default CandleStickEntry;
