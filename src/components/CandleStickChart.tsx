import { useEffect, useMemo, useRef, useState } from 'react';
import CandleStickEntry from './CandleStickEntry';
import styles from './CandleStickChart.module.css';
import { format } from 'date-fns';

export type TickerDay = {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
};

function calculateRange(data: TickerDay[]): [number, number] {
  let min = data[0].low;
  let max = data[0].high;
  for (const day of data) {
    if (day.low < min) {
      min = day.low;
    }
    if (day.high > max) {
      max = day.high;
    }
  }
  return [min, max];
}

export type CandleStickProps = {
  days: TickerDay[];
};

const CandleStickChart = ({ days }: CandleStickProps) => {
  const chartRef = useRef<SVGSVGElement>(null);
  const totalHeight = 160;
  const totalWidth = 600;
  const barGap = 2;
  const barWidth = (totalWidth - (days.length - 1) * barGap) / days.length;

  const minMax = useMemo(() => {
    return calculateRange(days);
  }, [days]);
  const yScale = totalHeight / (minMax[1] - minMax[0]);

  const [isHovering, setIsHovering] = useState(false);
  const [relativeMouseX, setRelativeMouseX] = useState(0);

  const focusedIndex = Math.floor(relativeMouseX / (barWidth + barGap));

  const updateXPosition = (clientX: number, chartX: number) => {
    if (!chartRef.current) {
      return;
    }

    const x = clientX - chartX;
    setRelativeMouseX(x);
  };

  useEffect(() => {
    if (!chartRef.current) {
      return;
    }

    // Mouse move with throttling
    let timeout: number;
    let lastRun = 0;
    const onMouseMove = (e: MouseEvent) => {
      const update = () => {
        if (!chartRef.current) {
          return;
        }
        const rect = chartRef.current.getBoundingClientRect();
        lastRun = Date.now();
        updateXPosition(e.clientX, rect.left);
      };

      clearTimeout(timeout);

      if (Date.now() - lastRun > 50) {
        update();
        return;
      }

      timeout = setTimeout(update, 50);
    };
    chartRef.current.addEventListener('mousemove', onMouseMove);

    return () => {
      clearTimeout(timeout);
      chartRef.current?.removeEventListener('mousemove', onMouseMove);
    };
  }, [chartRef]);

  const focusedDay = days[focusedIndex];

  return (
    <div className={styles.root}>
      <svg
        ref={chartRef}
        className={styles.chart}
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        viewBox={`0 0 ${totalWidth} ${totalHeight}`}
        style={{
          width: `100%`,
          height: 'auto',
        }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {days.map((day, i) => (
          <g
            transform={`translate(${i * (barWidth + barGap)}, ${
              (minMax[1] - day.high) * yScale
            })`}
            key={day.date.getTime()}
          >
            <CandleStickEntry
              high={day.high}
              low={day.low}
              open={day.open}
              close={day.close}
              yScale={yScale}
              width={barWidth}
              dimmed={isHovering && i !== focusedIndex}
            />
          </g>
        ))}
      </svg>
      <div>
        <div className={styles.focusedDay}>
          {focusedDay && (
            <>
              <h2>{format(focusedDay.date, 'dd.MM.yyyy')}</h2>
              <dl>
                <div>
                  <dt>Open</dt>
                  <dd>{focusedDay.open}</dd>
                </div>
                <div>
                  <dt>Close</dt>
                  <dd>{focusedDay.close}</dd>
                </div>
                <div>
                  <dt>High</dt>
                  <dd>{focusedDay.high}</dd>
                </div>
                <div>
                  <dt>Low</dt>
                  <dd>{focusedDay.low}</dd>
                </div>
              </dl>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandleStickChart;
