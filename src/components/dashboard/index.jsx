import React from 'react';
import './index.css';
import Table from './Table';
import { useQuery } from '@tanstack/react-query';
import { FetchApi } from '../../utils/fetch-api.js';
import { Link } from 'react-router-dom';
import { headers } from './constants.js';

const Dashboard = () => {
  const [sortBy, setSortBy] = React.useState('updatedAt:desc');
  const [userInput, setUserInput] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [searchDate, setSearchDate] = React.useState('');
  const [searchParams, setSearchParams] = React.useState({
    user: null,
    date: null
  });
  const limit = 10;

  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const today = new Date();
    today.setHours(23, 59, 59, 999); // Set to end of today

    if (selectedDate > today) {
      // If selected date is in the future, set to current date and time
      const currentDateTime = new Date();
      const formattedDateTime = currentDateTime.toISOString().slice(0, 19);
      setSearchDate(formattedDateTime);
    } else {
      setSearchDate(e.target.value);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setUserInput(value);
  };

  const handleSearch = () => {
    setSearchParams({
      user: userInput || null,
      date: searchDate ? new Date(searchDate).toISOString() : null  // Convert to UTC ISO string
    });
    setPage(1); // Reset to first page when searching
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboard', page, limit, sortBy, searchParams],
    queryFn: () => FetchApi.getDashboard({ 
      page, 
      limit, 
      sortBy, 
      user: searchParams.user, 
      date: searchParams.date 
    }),
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
  });

  const handleSort = (newSortBy) => {
    setSortBy(newSortBy);
  };

  return (
    <div className="dashboard-container" style={{
      padding: '24px',
      backgroundColor: 'rgba(26, 26, 26, 0.75)', // reduced opacity from 0.90 to 0.75
      minHeight: '100vh'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        gap: '24px'
      }}>
        <h2 style={{
          color: 'white',
          fontFamily: "'Mulish', sans-serif",
          fontWeight: 500,
          fontSize: '20px',
          margin: 0
        }}>
          Dashboard
        </h2>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap'
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
          ].map((token) => (
            <Link
              key={token}
              to={`/coin?symbol=${token}`}
              style={{
                padding: '6px 12px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '6px',
                color: 'white',
                textDecoration: 'none',
                fontFamily: "'Mulish', sans-serif",
                fontSize: '14px',
                transition: 'background-color 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: 'fit-content',
                cursor: 'pointer',
                ':hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)'
                }
              }}
            >
              {token}
            </Link>
          ))}
        </div>
        <div style={{
          position: 'relative',
          display: 'flex',
          gap: '12px',
          maxWidth: '600px',
          width: '100%'
        }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => {
                setSearchDate('');
                setUserInput('');
                setSearchParams({
                  user: null,
                  date: null
                });
              }}
              style={{
                padding: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '6px',
                color: 'white',
                cursor: 'pointer',
                fontFamily: "'Mulish', sans-serif",
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              Reset
            </button>
            <input
              type="datetime-local"
              value={searchDate}
              onChange={handleDateChange}
              max={new Date().toISOString().slice(0, 19)} // Set max attribute to current date/time
              step="1"
              style={{
                width: '200px',
                padding: '8px 12px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '6px',
                color: 'white',
                fontFamily: "'Mulish', sans-serif",
                fontSize: '14px',
                outline: 'none',
                cursor: 'pointer'
              }}
            />
          </div>
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              type="text"
              placeholder="Search address..."
              value={userInput}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '8px 36px 8px 12px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '6px',
                color: 'white',
                fontFamily: "'Mulish', sans-serif",
                fontSize: '14px',
                outline: 'none',
                '::placeholder': {
                  color: 'rgba(255, 255, 255, 0.5)'
                }
              }}
            />
            <svg 
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                opacity: 0.5
              }}
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" 
                stroke="white" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <button
            onClick={handleSearch}
            style={{
              padding: '8px 16px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '6px',
              color: 'white',
              fontFamily: "'Mulish', sans-serif",
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease',
              whiteSpace: 'nowrap'
            }}
          >
            Search
          </button>
        </div>
      </div>
      <div className="grid-container" style={{
        overflowX: 'auto',
        backgroundColor: 'rgba(34, 34, 34, 0.85)', // made semi-transparent
        borderRadius: '12px',
        padding: '16px'
      }}>
        <Table 
          data={data?.data?.results}
          isLoading={isLoading}
          isError={isError}
          sortBy={sortBy}
          headers={headers}
          onSort={handleSort}
        />
      </div>
      
      {/* Pagination Controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: '20px',
        gap: '12px'
      }}>
        <button
          onClick={() => setPage(prev => Math.max(1, prev - 1))}
          disabled={page === 1 || isLoading}
          style={{
            padding: '8px 16px',
            backgroundColor: page === 1 ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '6px',
            color: 'white',
            cursor: page === 1 ? 'not-allowed' : 'pointer',
            fontFamily: "'Mulish', sans-serif",
            fontSize: '14px',
            transition: 'background-color 0.2s ease'
          }}
        >
          Previous
        </button>
        
        {data?.data?.totalPages > 0 && (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {[...Array(data.data.totalPages)].map((_, index) => {
              const pageNumber = index + 1;
              
              // Always show first page, last page, current page, and pages around current page
              const showPage = pageNumber === 1 || 
                              pageNumber === data.data.totalPages ||
                              (pageNumber >= page - 1 && pageNumber <= page + 1) ||
                              pageNumber <= 3 ||
                              pageNumber > data.data.totalPages - 2;

              // Show ellipsis after first group and before last group
              const showLeftEllipsis = pageNumber === 4 && page > 5;
              const showRightEllipsis = pageNumber === data.data.totalPages - 3 && page < data.data.totalPages - 4;

              if (showLeftEllipsis || showRightEllipsis) {
                return (
                  <span
                    key={`ellipsis-${pageNumber}`}
                    style={{
                      color: 'white',
                      fontFamily: "'Mulish', sans-serif",
                      fontSize: '14px'
                    }}
                  >
                    ...
                  </span>
                );
              }

              if (showPage) {
                return (
                  <button
                    key={pageNumber}
                    onClick={() => setPage(pageNumber)}
                    disabled={page === pageNumber || isLoading}
                    style={{
                      padding: '8px 12px',
                      backgroundColor: page === pageNumber ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '6px',
                      color: 'white',
                      cursor: page === pageNumber ? 'default' : 'pointer',
                      fontFamily: "'Mulish', sans-serif",
                      fontSize: '14px',
                      minWidth: '40px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      transition: 'background-color 0.2s ease'
                    }}
                  >
                    {pageNumber}
                  </button>
                );
              }

              return null;
            })}
          </div>
        )}

        <button
          onClick={() => setPage(prev => prev + 1)}
          disabled={!data?.data?.hasMore || isLoading}
          style={{
            padding: '8px 16px',
            backgroundColor: !data?.data?.hasMore ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '6px',
            color: 'white',
            cursor: !data?.data?.hasMore ? 'not-allowed' : 'pointer',
            fontFamily: "'Mulish', sans-serif",
            fontSize: '14px',
            transition: 'background-color 0.2s ease'
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
