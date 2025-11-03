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

export function DashboardOverviewContent() {
  const { isMobile, isCollapsed } = useDashboard();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<HyperinfoResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

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
                <div className="dashboard-table-container">
                  <table className="dashboard-table">
                    <thead>
                      <tr>
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

