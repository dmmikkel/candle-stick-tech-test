import { Provider } from 'react-redux';
import { store } from './store';
import { AlphaVantageDailyTimeSeriesResponse } from './types/alpha-vantage-types';
import TickerChart from './components/TickerChart';
import { useState } from 'react';
import styles from './App.module.css';

function App() {
  const [ticker, setTicker] = useState('');
  const [tickerInput, setTickerInput] = useState('');

  return (
    <Provider store={store}>
      <div className={styles.root}>
        <div className={styles.container}>
          <h1>Stock ticker chart</h1>
          <p>
            Enter a stock ticker and click search. Examples: AAPL, MSFT, TSLA
          </p>
          <div className={styles.searchField}>
            <input
              type="text"
              name="ticker"
              id="ticker-input"
              value={tickerInput}
              onChange={(e) => setTickerInput(e.target.value)}
            />
            <button
              type="button"
              onClick={() => {
                setTicker(tickerInput);
              }}
            >
              Search
            </button>
          </div>
          {ticker && <TickerChart ticker={ticker} />}
        </div>
      </div>
    </Provider>
  );
}

export default App;
