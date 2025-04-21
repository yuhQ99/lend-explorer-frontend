import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import './index.css';

const Layout = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const handleClick = () => {
    setIsVisible(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      width: "100%",
      minHeight: "100vh",
      position: "relative",
      zIndex: 1,
    }}>
      {isVisible && (
        <div style={{
          background: '#DA3E3E',
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "8px 16px",
          position: "relative",
        }}>
          <a href="https://ignition.coredao.org/registration/code?code=0DD34B"
             target="_blank"
             rel="noopener noreferrer"
             style={{
               color: 'white',
               textAlign: "center",
               fontFamily: "'Mulish', sans-serif",
               fontWeight: 400,
               fontSize: '14px',
             }}>
            Ignition Season 3 is live: sign up now for extra yield!
          </a>
          <button
            onClick={handleClick}
            style={{
              position: "absolute",
              right: "16px",
              background: "none",
              border: "none",
              color: "white",
              cursor: "pointer",
              fontSize: "20px",
              padding: "0 8px",
            }}>
            ×
          </button>
        </div>
      )}
      <nav style={{
        height: "48px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "rgba(34, 34, 34, 0.95)",
        backdropFilter: "blur(10px)",
        padding: "0 16px",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}>
        {/* Left section: Logo and Navigation */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "32px",
        }}>
          {/* Logo */}
          <Link to="/" style={{ 
            display: "flex", 
            alignItems: "center",
            color: "#DA3E3E",
            textDecoration: "none",
            fontFamily: "'Mulish', sans-serif",
            fontWeight: 700,
            fontSize: "18px",
          }}>
            <img src="/src/assets/core_logo_light.svg" alt="COLEND" style={{ height: "20px", marginRight: "8px" }}/>
          </Link>

          {/* Desktop Navigation */}
          <div className="desktop-nav" style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
          }}>
            <Link to="/" className={isActive('/')} style={{ 
              color: "white", 
              textDecoration: "none", 
              fontFamily: "'Mulish', sans-serif",
              fontSize: "14px",
              fontWeight: 400,
            }}>All Markets</Link>
            <Link to="/supply-borrow" className={isActive('/supply-borrow')} style={{ 
              color: "white", 
              textDecoration: "none", 
              fontFamily: "'Mulish', sans-serif",
              fontSize: "14px",
              fontWeight: 400,
            }}>Supply & Borrow</Link>
            <Link to="/leaderboard" className={isActive('/leaderboard')} style={{ 
              color: "white", 
              textDecoration: "none", 
              fontFamily: "'Mulish', sans-serif",
              fontSize: "14px",
              fontWeight: 400,
            }}>Leaderboard</Link>
            <button style={{
              background: "#DA3E3E",
              color: "white",
              border: "none",
              padding: "6px 16px",
              borderRadius: "4px",
              fontFamily: "'Mulish', sans-serif",
              fontSize: "14px",
              fontWeight: 400,
              cursor: "pointer",
            }}>
              AIRDROP
            </button>
            <Link to="/bridges" className={isActive('/bridges')} style={{ 
              color: "white", 
              textDecoration: "none", 
              fontFamily: "'Mulish', sans-serif",
              fontSize: "14px",
              fontWeight: 400,
            }}>Bridges</Link>
          </div>
        </div>

        {/* Right section: Wallet and Settings */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}>
          {/* Wallet Button */}
          <button style={{
            background: "rgba(255, 255, 255, 0.1)",
            color: "white",
            border: "none",
            padding: "6px 12px",
            borderRadius: "4px",
            fontFamily: "'Mulish', sans-serif",
            fontSize: "14px",
            fontWeight: 400,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}>
            <img src="/src/assets/metamask-icon.png" alt="" style={{ height: "16px" }}/>
            <span>0x4...3247</span>
          </button>


          {/* Mobile Menu Button - Only visible on mobile */}
          <button
            onClick={toggleMenu}
            className="mobile-nav"
            style={{
              background: "none",
              border: "none",
              color: "white",
              cursor: "pointer",
              padding: "4px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <span style={{
              width: "20px",
              height: "2px",
              background: "white",
              display: "block",
            }}></span>
            <span style={{
              width: "20px",
              height: "2px",
              background: "white",
              display: "block",
            }}></span>
            <span style={{
              width: "20px",
              height: "2px",
              background: "white",
              display: "block",
            }}></span>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="mobile-nav" style={{
            position: "fixed",
            top: "48px",
            left: 0,
            right: 0,
            backgroundColor: "rgba(34, 34, 34, 0.95)",
            backdropFilter: "blur(10px)",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}>
            <Link to="/">All Markets</Link>
            <Link to="/supply-borrow">Supply & Borrow</Link>
            <Link to="/leaderboard">Leaderboard</Link>
            <button>AIRDROP</button>
            <Link to="/bridges">Bridges</Link>
          </div>
        )}
      </nav>
      <main style={{ 
        flex: 1, 
        margin: 0,
        position: "relative",
        zIndex: 1,
      }}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
