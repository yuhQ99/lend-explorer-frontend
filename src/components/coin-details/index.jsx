import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Link } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { FetchApi } from '../../utils/fetch-api.js';
import { truncateAddress, formatNumberWithCommas } from '../../utils/format.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const CoinDetails = () => {
  const [searchParams] = useSearchParams();
  const symbol = searchParams.get('symbol');
  const [lendPage, setLendPage] = useState(1);
  const [borrowPage, setBorrowPage] = useState(1);
  const [leaderboardMode, setLeaderboardMode] = useState('LEND');

  // Convert CORE to WCORE for API calls
  const apiToken = symbol === 'CORE' ? 'WCORE' : symbol;

  const [lendData, setLendData] = useState(null);
  const [borrowData, setBorrowData] = useState(null);

  // Query for lend data
  const { data: lendQueryData, isLoading, isError } = useQuery({
    queryKey: ['coinDetails', symbol, 'LEND', lendPage],
    queryFn: () => FetchApi.getCoinDetails({
      page: lendPage,
      limit: 5,
      token: apiToken,
      mode: 'LEND'
    })
  });

  // Query for borrow data
  const { data: borrowQueryData } = useQuery({
    queryKey: ['coinDetails', symbol, 'BORROW', borrowPage],
    queryFn: () => FetchApi.getCoinDetails({
      page: borrowPage,
      limit: 5,
      token: apiToken,
      mode: 'BORROW'
    })
  });

  // Effect for updating lend data
  useEffect(() => {
    console.log('lend data:', lendQueryData);
    if (lendQueryData) {
      setLendData(lendQueryData.data);
    }
  }, [lendQueryData]);

  // Effect for updating borrow data
  useEffect(() => {
    if (borrowQueryData) {
      setBorrowData(borrowQueryData.data);
    }
  }, [borrowQueryData]);

  // Query for leaderboard data
  const { data: leaderboardData } = useQuery({
    queryKey: ['coinDetails', symbol, leaderboardMode, 'leaderboard'],
    queryFn: () => FetchApi.getCoinDetails({
      page: 1,
      limit: 100,
      token: apiToken,
      mode: leaderboardMode,
      sortBy: `tokensData.${apiToken}.${leaderboardMode.toLowerCase()}.scaledBalance:desc`
    })
  });

  const renderPagination = (currentPage, totalPages, setPage) => {
    const pages = [];
    const maxVisible = 6;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1) ||
        totalPages <= maxVisible
      ) {
        pages.push(
          <button
            key={i}
            onClick={() => setPage(i)}
            style={{
              padding: '8px 12px',
              backgroundColor: currentPage === i ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '6px',
              color: 'white',
              cursor: 'pointer',
              margin: '0 4px'
            }}
          >
            {i}
          </button>
        );
      } else if (i === 2 || i === totalPages - 1) {
        pages.push(<span key={i} style={{ color: 'white' }}>...</span>);
      }
    }
    return pages;
  };

  const renderTable = (title, data, page, setPage) => (
    <div style={{
      backgroundColor: 'rgba(34, 34, 34, 0.85)',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '24px'
    }}>
      <h3 style={{ color: 'white', marginBottom: '16px' }}>{title}</h3>
      <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
        <thead>
          <tr>
            <th style={{ color: '#999', textAlign: 'left', padding: '12px' }}>Address</th>
            <th style={{ color: '#999', textAlign: 'left', padding: '12px' }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {data?.results.map((row, index) => (
            <tr key={index} style={{ backgroundColor: 'rgba(42, 42, 42, 0.85)' }}>
              <td style={{ padding: '12px', color: 'white' }}>{truncateAddress(row.user)}</td>
              <td style={{ padding: '12px', color: 'white' }}>{formatNumberWithCommas(row.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
        {renderPagination(page, data?.totalPages || 1, setPage)}
      </div>
    </div>
  );

  const ModeToggle = () => (
    <div style={{ 
      display: 'flex', 
      gap: '8px', 
      backgroundColor: 'rgba(26, 26, 26, 0.85)',
      padding: '4px',
      borderRadius: '8px'
    }}>
      <button
        onClick={() => setLeaderboardMode('LEND')}
        style={{
          padding: '8px 16px',
          backgroundColor: leaderboardMode === 'LEND' ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
          border: 'none',
          borderRadius: '6px',
          color: 'white',
          cursor: 'pointer',
          transition: 'background-color 0.2s'
        }}
      >
        Lend
      </button>
      <button
        onClick={() => setLeaderboardMode('BORROW')}
        style={{
          padding: '8px 16px',
          backgroundColor: leaderboardMode === 'BORROW' ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
          border: 'none',
          borderRadius: '6px',
          color: 'white',
          cursor: 'pointer',
          transition: 'background-color 0.2s'
        }}
      >
        Borrow
      </button>
    </div>
  );

  const renderDistributionChart = () => {
    if (!leaderboardData?.data?.results) return null;

    // Ensure we have exactly 100 users
    const userData = leaderboardData.data.results;
    // Pad with empty data if less than 100 users
    while (userData.length < 100) {
      userData.push({ user: "N/A", amount: "0" });
    }
    
    const data = {
      labels: userData.map((_, index) => `#${index + 1}`),
      datasets: [
        {
          label: `${leaderboardMode === 'LEND' ? 'Lending' : 'Borrowing'} Amount`,
          data: userData.map(item => parseFloat(item.amount)),
          backgroundColor: 'rgba(227, 134, 39, 0.8)',
          borderColor: 'rgba(227, 134, 39, 1)',
          borderWidth: 1,
        },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: 'white'
          }
        },
        tooltip: {
          callbacks: {
            title: (context) => {
              const index = context[0].dataIndex;
              return `Rank #${index + 1}`;
            },
            label: (context) => {
              const index = context.dataIndex;
              const address = userData[index].user;
              const value = context.raw.toLocaleString();
              return [
                `Address: ${address}`,
                `Amount: ${value} ${symbol}`
              ];
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            color: 'white',
            callback: (value) => value.toLocaleString()
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: 'white',
            // Show every 5th label to avoid overcrowding
            callback: (value, index) => index % 5 === 0 ? `#${index + 1}` : '',
            maxRotation: 0,
            autoSkip: false
          }
        }
      }
    };

    return (
      <div style={{
        backgroundColor: 'rgba(34, 34, 34, 0.85)',
        borderRadius: '12px',
        padding: '20px',
        marginTop: '24px'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '16px' 
        }}>
          <h3 style={{ color: 'white' }}>Top 100 Users Distribution</h3>
          <ModeToggle />
        </div>
        <div style={{ height: '400px' }}>
          <Bar data={data} options={options} />
        </div>
      </div>
    );
  };

  const renderLeaderboard = () => {
    if (!leaderboardData?.data?.results) return null;

    return (
      <div style={{
        backgroundColor: 'rgba(34, 34, 34, 0.85)',
        borderRadius: '12px',
        padding: '20px',
        marginTop: '24px'
      }}>
        <h3 style={{ color: 'white', marginBottom: '16px' }}>Leaderboard</h3>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
          <thead>
            <tr>
              <th style={{ color: '#999', textAlign: 'left', padding: '12px' }}>Rank</th>
              <th style={{ color: '#999', textAlign: 'left', padding: '12px' }}>Address</th>
              <th style={{ color: '#999', textAlign: 'left', padding: '12px' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData.data.results.map((row, index) => (
              <tr key={index} style={{ backgroundColor: 'rgba(42, 42, 42, 0.85)' }}>
                <td style={{ padding: '12px', color: 'white' }}>
                  {index < 3 && <span style={{ marginRight: '8px' }}>🏆</span>}
                  {index + 1}
                </td>
                <td style={{ padding: '12px', color: 'white' }}>
                  <a 
                    href={`https://scan.coredao.org/address/${row.user}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: 'white',
                      textDecoration: 'none',
                      ':hover': {
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    {row.user}
                  </a>
                </td>
                <td style={{ padding: '12px', color: 'white' }}>{formatNumberWithCommas(row.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div style={{ padding: '24px' }}>
      <h2 style={{ 
        color: 'white', 
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span>{symbol} Details</span>
        <div style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'center'
        }}>
          {[
            'CORE',
            'USDT',
            'stCORE',
            'BTCB',
            'USDC',
            'WBTC',
            'COREBTC',
            'aBTC'
          ].map((token) => {
            const isActive = symbol === token;
            
            return (
              <Link
                key={token}
                to={`/coin?symbol=${token}`}
                style={{
                  padding: '4px 8px',
                  backgroundColor: isActive ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '4px',
                  color: 'white',
                  textDecoration: 'none',
                  fontFamily: "'Mulish', sans-serif",
                  fontSize: '12px',
                  transition: 'background-color 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: 'fit-content',
                  cursor: 'pointer',
                }}
              >
                {token}
              </Link>
            );
          })}
        </div>
      </h2>
      {renderTable('Lend Details', lendData, lendPage, setLendPage)}
      {renderTable('Borrow Details', borrowData, borrowPage, setBorrowPage)}
      {renderDistributionChart()}
      {renderLeaderboard()}
    </div>
  );
};

export default CoinDetails;
