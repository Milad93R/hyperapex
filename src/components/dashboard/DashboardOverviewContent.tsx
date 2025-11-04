'use client';

import React, { useState } from 'react';
import { useDashboard } from './DashboardContext';
import './DashboardContent.css';

interface FillData {
  coin: string;
  px: string;
  sz: string;
  side: 'A' | 'B';
  time: number;
  startPosition: string;
  dir: string;
  closedPnl: string;
  hash: string;
  oid: number;
  crossed: boolean;
  fee: string;
  tid: number;
  feeToken: string;
  twapId: string | null;
}

interface HyperinfoResponse {
  success: boolean;
  type: string;
  data: FillData[];
  duration?: string;
  timestamp?: string;
}

interface CalculationResult {
  success: boolean;
  type: string;
  result: {
    releasedPnl: number;
    unrealizedPnl: number;
    assets: Record<string, { position: number; price: number; value: number; currentPrice?: number; currentPriceTimestamp?: number; unrealizedPnl?: number }>;
    totalAssets: number;
    totalValue: number;
    totalUnrealizedPnl: number;
  };
  duration?: string;
  timestamp?: string;
}

export function DashboardOverviewContent() {
  const { isMobile, isCollapsed } = useDashboard();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<HyperinfoResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [calculationInput, setCalculationInput] = useState<string>('');
  const [calculating, setCalculating] = useState(false);
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);
  const [calculationError, setCalculationError] = useState<string | null>(null);

  const handleHyperinfoCall = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Use proxy endpoint to avoid exposing API key to client
      const response = await fetch('/api/hyperinfo/proxy', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'userFillsByTime',
          user: '0xA13CF65c9fb9AFfFA991E8b371C5EE122F8ba537',
          startTime: 1,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || errorData.message || `HTTP ${response.status}`);
      }

      const data = await response.json() as HyperinfoResponse;
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to call hyperinfo API');
    } finally {
      setLoading(false);
    }
  };

  const handleCalculate = async () => {
    if (!result || !result.data || !Array.isArray(result.data) || result.data.length === 0) {
      setCalculationError('Please fetch fill data first');
      return;
    }

    const count = parseInt(calculationInput, 10);
    if (isNaN(count) || count < 1) {
      setCalculationError('Please enter a valid positive number');
      return;
    }

    if (count > result.data.length) {
      setCalculationError(`Count cannot exceed the number of fills (${result.data.length})`);
      return;
    }

    setCalculating(true);
    setCalculationError(null);
    setCalculationResult(null);

    try {
      // First, calculate assets to get the list of coins
      const tempResponse = await fetch('/api/calculate/proxy', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'assetrowscalculate',
          fills: result.data,
          count: count,
        }),
      });

      if (!tempResponse.ok) {
        const errorData = await tempResponse.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || errorData.message || `HTTP ${tempResponse.status}`);
      }

      const tempData = await tempResponse.json() as CalculationResult;
      
      // Get unique coins from assets
      const coins = Object.keys(tempData.result.assets);
      
      // Get the timestamp of the last fill in the selected range (the Nth fill)
      const lastFillIndex = count - 1;
      const lastFillTime = result.data[lastFillIndex]?.time;
      
      if (!lastFillTime) {
        throw new Error('Unable to determine timestamp of last fill');
      }
      
      // Fetch prices from Binance for each coin at the time of the last fill
      const currentPrices: Record<string, number> = {};
      const priceTimestamps: Record<string, number> = {}; // Store timestamps
      
      if (coins.length > 0) {
        // Fetch prices in parallel
        const pricePromises = coins.map(async (coin) => {
          try {
            // Convert coin symbol to Binance format (e.g., BTC -> BTCUSDT)
            const symbol = `${coin}USDT`;
            
            // Align the fill time to the nearest 5-minute candle boundary
            // Binance candles are aligned to 5-minute intervals
            const fillTime = typeof lastFillTime === 'number' ? lastFillTime : parseInt(String(lastFillTime));
            const candleStartTime = Math.floor(fillTime / (5 * 60 * 1000)) * (5 * 60 * 1000);
            const candleEndTime = candleStartTime + 5 * 60 * 1000 - 1;
            
            const binanceResponse = await fetch(
              `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=5m&startTime=${candleStartTime}&endTime=${candleEndTime}&limit=1`
            );
            
            if (binanceResponse.ok) {
              const binanceData = await binanceResponse.json();
              if (Array.isArray(binanceData) && binanceData.length > 0) {
                const candle = binanceData[0];
                const closePrice = parseFloat(candle[4]); // Close price at index 4
                const closeTime = parseInt(candle[6]); // Close time at index 6
                if (!isNaN(closePrice) && closePrice > 0) {
                  return { coin, price: closePrice, timestamp: closeTime };
                }
              }
            }
            return null;
          } catch (error) {
            console.error(`Failed to get price for ${coin}:`, error);
            return null;
          }
        });

        const priceResults = await Promise.all(pricePromises);
        priceResults.forEach((result) => {
          if (result) {
            currentPrices[result.coin] = result.price;
            priceTimestamps[result.coin] = result.timestamp;
          }
        });
      }

      // Now calculate with current prices
      const response = await fetch('/api/calculate/proxy', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'assetrowscalculate',
          fills: result.data,
          count: count,
          currentPrices: currentPrices,
          priceTimestamps: priceTimestamps,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || errorData.message || `HTTP ${response.status}`);
      }

      const data = await response.json() as CalculationResult;
      setCalculationResult(data);
    } catch (err) {
      setCalculationError(err instanceof Error ? err.message : 'Failed to calculate');
    } finally {
      setCalculating(false);
    }
  };

  return (
    <main className="dashboard-main" data-collapsed={!isMobile && isCollapsed}>
      <div className="dashboard-container">
        <h1 className="dashboard-page-title">Overview</h1>
        <p className="dashboard-card-description" style={{ marginBottom: '20px' }}>
          Welcome back! Here&apos;s what&apos;s happening.
        </p>

        <div className="dashboard-section">
          <h2 className="dashboard-section-title">Hyperinfo API</h2>
          <div className="dashboard-card">
            <p className="dashboard-card-description" style={{ marginBottom: '16px' }}>
              Test the Hyperliquid API integration
            </p>
            <button
              className="dashboard-button dashboard-button-primary"
              onClick={handleHyperinfoCall}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Get User Fills by Time'}
            </button>

            {error && (
              <div className="dashboard-card-description" style={{ marginTop: '16px', color: '#ef4444' }}>
                <strong>Error:</strong> {error}
              </div>
            )}

            {result && result.data && Array.isArray(result.data) && result.data.length > 0 && (
              <div style={{ marginTop: '16px' }}>
                <h3 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: '600', color: 'var(--dashboard-text-primary)' }}>
                  User Fills ({result.data.length} records)
                </h3>
                
                {/* Calculation Input Section */}
                <div style={{ marginBottom: '16px', display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--dashboard-text-secondary)' }}>
                    Calculate PnL from first N items:
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={result.data.length}
                    value={calculationInput}
                    onChange={(e) => setCalculationInput(e.target.value)}
                    placeholder="Enter number (e.g., 17)"
                    style={{
                      padding: '6px 10px',
                      fontSize: '12px',
                      border: '1px solid var(--dashboard-border)',
                      borderRadius: '4px',
                      background: 'var(--dashboard-bg-secondary)',
                      color: 'var(--dashboard-text-primary)',
                      width: '120px',
                    }}
                  />
                  <button
                    className="dashboard-button dashboard-button-primary"
                    onClick={handleCalculate}
                    disabled={calculating || !calculationInput}
                    style={{ padding: '6px 12px', fontSize: '12px' }}
                  >
                    {calculating ? 'Calculating...' : 'Calculate'}
                  </button>
                </div>

                {calculationError && (
                  <div className="dashboard-card-description" style={{ marginBottom: '16px', color: '#ef4444' }}>
                    <strong>Error:</strong> {calculationError}
                  </div>
                )}

                {calculationResult && calculationResult.result && (
                  <div style={{ 
                    marginBottom: '16px', 
                    padding: '12px', 
                    background: 'var(--dashboard-bg-secondary)', 
                    borderRadius: '4px',
                    border: '1px solid var(--dashboard-border)'
                  }}>
                    <h4 style={{ marginBottom: '12px', fontSize: '13px', fontWeight: '600', color: 'var(--dashboard-text-primary)' }}>
                      Calculation Results
                    </h4>
                    <div style={{ fontSize: '12px', color: 'var(--dashboard-text-secondary)', marginBottom: '8px' }}>
                      <strong>Released PnL (first {calculationInput} items):</strong>{' '}
                      <span style={{
                        color: calculationResult.result.releasedPnl >= 0 ? '#22c55e' : '#ef4444',
                        fontWeight: '600'
                      }}>
                        {calculationResult.result.releasedPnl >= 0 ? '+' : ''}{calculationResult.result.releasedPnl.toFixed(8)}
                      </span>
                    </div>
                    {calculationResult.result.unrealizedPnl !== undefined && (
                      <div style={{ fontSize: '12px', color: 'var(--dashboard-text-secondary)', marginBottom: '8px' }}>
                        <strong>Unrealized PnL:</strong>{' '}
                        <span style={{
                          color: calculationResult.result.unrealizedPnl >= 0 ? '#22c55e' : '#ef4444',
                          fontWeight: '600'
                        }}>
                          {calculationResult.result.unrealizedPnl >= 0 ? '+' : ''}{calculationResult.result.unrealizedPnl.toFixed(8)}
                        </span>
                      </div>
                    )}
                    {calculationResult.result.unrealizedPnl !== undefined && calculationResult.result.releasedPnl !== undefined && (
                      <div style={{ fontSize: '12px', color: 'var(--dashboard-text-secondary)', marginBottom: '12px', fontWeight: '600' }}>
                        <strong>Total PnL (Released + Unrealized):</strong>{' '}
                        <span style={{
                          color: (calculationResult.result.releasedPnl + calculationResult.result.unrealizedPnl) >= 0 ? '#22c55e' : '#ef4444',
                          fontWeight: '600'
                        }}>
                          {(calculationResult.result.releasedPnl + calculationResult.result.unrealizedPnl) >= 0 ? '+' : ''}
                          {(calculationResult.result.releasedPnl + calculationResult.result.unrealizedPnl).toFixed(8)}
                        </span>
                      </div>
                    )}
                    <div style={{ fontSize: '12px', color: 'var(--dashboard-text-secondary)', marginBottom: '12px' }}>
                      <strong>Total Assets (after first {calculationInput} items):</strong> {calculationResult.result.totalAssets}
                    </div>
                    {calculationResult.result.totalAssets > 0 && (
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--dashboard-text-secondary)', marginBottom: '8px' }}>
                          Asset Positions:
                        </div>
                        <div 
                          className="dashboard-asset-positions-container"
                          style={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            gap: '6px', 
                            marginBottom: '12px',
                            maxHeight: '300px',
                            overflowY: 'auto',
                            overflowX: 'hidden'
                          }}
                        >
                          {Object.entries(calculationResult.result.assets).map(([coin, assetData]) => (
                            <div 
                              key={coin} 
                              style={{ 
                                padding: '8px 10px',
                                background: 'var(--dashboard-bg-tertiary)',
                                borderRadius: '4px',
                                fontSize: '12px'
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                <span style={{ color: 'var(--dashboard-text-primary)', fontWeight: '600' }}>{coin}</span>
                                <span style={{
                                  color: assetData.position >= 0 ? '#22c55e' : '#ef4444',
                                  fontWeight: '600'
                                }}>
                                  {assetData.position >= 0 ? '+' : ''}{assetData.position.toFixed(8)}
                                </span>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--dashboard-text-secondary)', marginBottom: '4px' }}>
                                <span>Entry Price: ${assetData.price.toLocaleString()}</span>
                                <span style={{ fontWeight: '600', color: 'var(--dashboard-text-primary)' }}>
                                  Value: ${assetData.value.toLocaleString()}
                                </span>
                              </div>
                              {assetData.currentPrice !== undefined && assetData.currentPrice > 0 && (
                                <>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--dashboard-text-secondary)' }}>
                                    <span>
                                      Current Price: ${assetData.currentPrice.toLocaleString()}
                                      {assetData.currentPriceTimestamp && (
                                        <span style={{ marginLeft: '8px', fontSize: '10px', opacity: 0.7 }}>
                                          ({new Date(assetData.currentPriceTimestamp).toLocaleString()})
                                        </span>
                                      )}
                                    </span>
                                    {assetData.unrealizedPnl !== undefined && (
                                      <span style={{
                                        fontWeight: '600',
                                        color: assetData.unrealizedPnl >= 0 ? '#22c55e' : '#ef4444'
                                      }}>
                                        Unrealized PnL: {assetData.unrealizedPnl >= 0 ? '+' : ''}{assetData.unrealizedPnl.toFixed(8)}
                                      </span>
                                    )}
                                  </div>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                        <div style={{ 
                          padding: '8px 10px', 
                          background: 'var(--dashboard-bg-tertiary)', 
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: 'var(--dashboard-text-primary)',
                          textAlign: 'right'
                        }}>
                          Total Portfolio Value: ${calculationResult.result.totalValue.toLocaleString()}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="dashboard-table-container">
                  <table className="dashboard-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Coin</th>
                        <th>Price</th>
                        <th>Size</th>
                        <th>Side</th>
                        <th>Direction</th>
                        <th>Start Position</th>
                        <th>Closed PnL</th>
                        <th>Fee</th>
                        <th>Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.data.map((fill, index) => (
                        <tr key={`${fill.hash}-${fill.oid}-${index}`}>
                          <td>{index + 1}</td>
                          <td>{fill.coin}</td>
                          <td>{parseFloat(fill.px).toLocaleString()}</td>
                          <td>{fill.sz}</td>
                          <td>
                            <span style={{
                              color: fill.side === 'B' ? '#22c55e' : '#ef4444',
                              fontWeight: '500'
                            }}>
                              {fill.side === 'B' ? 'Buy' : 'Sell'}
                            </span>
                          </td>
                          <td>{fill.dir}</td>
                          <td>{fill.startPosition}</td>
                          <td style={{
                            color: parseFloat(fill.closedPnl) >= 0 ? '#22c55e' : '#ef4444',
                            fontWeight: '500'
                          }}>
                            {parseFloat(fill.closedPnl).toFixed(4)}
                          </td>
                          <td>{fill.fee} {fill.feeToken}</td>
                          <td>{new Date(fill.time).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {result && (!result.data || !Array.isArray(result.data) || result.data.length === 0) && (
              <div style={{ marginTop: '16px' }}>
                <details open style={{ cursor: 'pointer' }}>
                  <summary style={{ marginBottom: '8px', fontWeight: 'bold' }}>Response</summary>
                  <pre style={{ 
                    background: 'var(--dashboard-bg-secondary)', 
                    padding: '12px', 
                    borderRadius: '4px', 
                    overflow: 'auto',
                    fontSize: '12px',
                    maxHeight: '400px',
                    marginTop: '8px'
                  }}>
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </details>
              </div>
            )}
          </div>
        </div>

        <div className="dashboard-section">
          <h2 className="dashboard-section-title">Quick Stats</h2>
          <div className="dashboard-card">
            <p className="dashboard-card-description">
              Get started by exploring your project settings or viewing your dashboard statistics.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

