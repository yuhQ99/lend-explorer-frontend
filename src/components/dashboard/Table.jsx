import React from 'react';
import { truncateAddress, formatNumberWithCommas } from '../../utils/format.js';

const Table = ({ data, isLoading, isError, sortBy, headers, onSort }) => {
  const [items, setItems] = React.useState([]);
  
  React.useEffect(() => {
    if (data) {
      setItems(data);
    }
  }, [data]);

  const handleSort = (header, index) => {
    if (index === 0) return; // Don't sort the first column
    
    const newSortBy = sortBy.startsWith(header.sortByKey) 
      ? sortBy.endsWith(':desc') 
        ? `${header.sortByKey}:asc`
        : `${header.sortByKey}:desc`
      : `${header.sortByKey}:desc`;
    
    onSort(newSortBy);
  };

  return (
    <div style={{ position: 'relative', overflow: 'auto' }}>
      <table style={{
        width: '100%',
        borderCollapse: 'separate',
        borderSpacing: '0 8px',
        fontFamily: "'Mulish', sans-serif"
      }}>
        <thead>
          <tr style={{
            background: '#1A1A1A',
            borderBottom: '1px solid #333333'
          }}>
            {headers.map((header, index) => (
              <th 
                key={index} 
                onClick={() => handleSort(header, index)}
                style={{
                  padding: '16px',
                  textAlign: 'left',
                  color: '#999999',
                  fontSize: '13px',
                  fontWeight: 300,
                  letterSpacing: '0.2px',
                  whiteSpace: 'nowrap',
                  cursor: index === 0 ? 'default' : 'pointer',
                  userSelect: 'none',
                  transition: 'background-color 0.2s ease',
                  position: index === 0 ? 'sticky' : 'relative',
                  left: index === 0 ? 0 : 'auto',
                  zIndex: index === 0 ? 1000 : 1, // Increased z-index for first column
                  background: '#1A1A1A',
                  fontFamily: "'Mulish', sans-serif"
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}>
                  <span style={{
                    opacity: 0.8,
                    fontWeight: 300,
                  }}>{header.title}</span>
                  {index !== 0 && (
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      marginLeft: '4px',
                      opacity: sortBy.startsWith(header.sortByKey) ? 0.8 : 0.5
                    }}>
                      {sortBy.startsWith(header.sortByKey) ? (
                        sortBy.endsWith('desc') ? (
                          <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 6L1 3H7L4 6Z" fill="#999999"/>
                          </svg>
                        ) : (
                          <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 2L7 5H1L4 2Z" fill="#999999"/>
                          </svg>
                        )
                      ) : (
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M4 1L7 4H1L4 1Z M4 7L1 4H7L4 7Z" fill="#666666"/>
                        </svg>
                      )}
                    </span>
                  )}
                </div>
                {index !== headers.length - 1 && (
                  <div style={{
                    position: 'absolute',
                    right: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '1px',
                    height: '14px',
                    background: '#333333'
                  }} />
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item, rowIndex) => (
            <tr key={rowIndex} style={{
              backgroundColor: 'rgba(42, 42, 42, 0.85)',
              borderRadius: '8px'
            }}>
              {headers.map((header, colIndex) => (
                <td key={colIndex} style={{
                  padding: '12px 16px',
                  color: 'white',
                  fontSize: '14px',
                  borderTop: colIndex === 0 ? '1px solid #333' : 'none',
                  borderBottom: colIndex === 0 ? '1px solid #333' : 'none',
                  position: colIndex === 0 ? 'sticky' : 'relative',
                  left: colIndex === 0 ? 0 : 'auto',
                  background: colIndex === 0 ? 'rgba(42, 42, 42, 0.85)' : 'transparent',
                  zIndex: colIndex === 0 ? 999 : 1, // Increased z-index for first column
                  ...(colIndex === 0 && {
                    boxShadow: '2px 0 4px rgba(0, 0, 0, 0.1)' // Optional: adds subtle shadow to indicate fixed column
                  })
                }}>
                  {colIndex === 0 ? (
                    <a 
                      href={`https://scan.coredao.org/address/${item?.user}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: 'white',
                        textDecoration: 'none',
                        cursor: 'pointer',
                        ':hover': {
                          textDecoration: 'underline'
                        }
                      }}
                    >
                      {truncateAddress(item?.user)}
                    </a>
                  ) : item?.[header.valueKey] ? formatNumberWithCommas(item[header.valueKey]) : '0.00'}
                </td>
              ))}
            </tr>
          ))}
          {isLoading && (
            <tr>
              <td colSpan={headers.length} style={{ textAlign: 'center', padding: '20px', color: 'white' }}>
                Loading...
              </td>
            </tr>
          )}
          {isError && (
            <tr>
              <td colSpan={headers.length} style={{ textAlign: 'center', padding: '20px', color: 'white' }}>
                Error fetching data
              </td>
            </tr>
          )}
          {!isLoading && !isError && items.length === 0 && (
            <tr>
              <td colSpan={headers.length} style={{ textAlign: 'center', padding: '20px', color: 'white' }}>
                No results found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
