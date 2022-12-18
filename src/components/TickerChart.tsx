import { format, parseJSON } from 'date-fns';
import { useMemo, useState } from 'react';
import { useGetDailyAdjustedQuery } from '../services/alpha-vantage';
import { AlphaVantageDailyTimeSeriesResponse } from '../types/alpha-vantage-types';
import CandleStickChart, { TickerDay } from './CandleStickChart';

function transformData(data: AlphaVantageDailyTimeSeriesResponse): TickerDay[] {
  const transformedData: TickerDay[] = [];
  for (const date in data['Time Series (Daily)']) {
    const day = data['Time Series (Daily)'][date];
    transformedData.push({
      date: parseJSON(date + 'T00:00:00Z'),
      open: parseFloat(day['1. open']),
      high: parseFloat(day['2. high']),
      low: parseFloat(day['3. low']),
      close: parseFloat(day['4. close']),
    });
  }
  transformedData.sort((a, b) => a.date.getTime() - b.date.getTime());
  return transformedData;
}

export type TickerChartProps = {
  ticker: string;
};

const TickerChart = ({ ticker }: TickerChartProps) => {
  const { data, error, isLoading } = useGetDailyAdjustedQuery(ticker);
  const tickerData = useMemo(() => (data ? transformData(data) : []), [data]);

  const [daysPerScreen, setDaysPerScreen] = useState(30);
  const [offset, setOffset] = useState(0);

  if (error) {
    return <div>Something went wrong</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>
        <CandleStickChart
          days={tickerData.slice(offset, offset + daysPerScreen)}
        />
      </div>
      <div>
        <input
          type="range"
          id="offset"
          name="offset"
          min="0"
          max={tickerData.length - daysPerScreen}
          value={offset}
          onChange={(e) => setOffset(parseInt(e.target.value))}
        />
      </div>
      <div>
        <input
          type="range"
          id="daysPerScreen"
          name="daysPerScreen"
          min="5"
          max={Math.min(tickerData.length - offset, 50)}
          value={daysPerScreen}
          onChange={(e) => setDaysPerScreen(parseInt(e.target.value))}
        />
      </div>
      <div>
        From: {format(tickerData[offset].date, 'yyyy-MM-dd')}
        To: {format(tickerData[offset + daysPerScreen - 1].date, 'yyyy-MM-dd')}
      </div>
    </div>
  );
};

export default TickerChart;
