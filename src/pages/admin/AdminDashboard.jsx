import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaBox, 
  FaPercent, 
  FaFileAlt, 
  FaUsers,
  FaChartLine,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaHome,
  FaTag
} from 'react-icons/fa';
import './AdminDashboard.css';
import BrandLogo from '../../components/BrandLogo';

function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    let canceled = false;
    (async () => {
      try {
        const res = await fetch('/api/admin/me', { credentials: 'include' });
        if (!res.ok) throw new Error('unauth');
      } catch (_) {
        if (!canceled) navigate('/admin');
      }
    })();
    return () => { canceled = true; };
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' });
    } finally {
      navigate('/admin');
    }
  };

  const menuItems = [
    {
      path: '/admin/dashboard',
      icon: <FaChartLine />,
      label: 'Обзор',
      exact: true
    },
    {
      path: '/admin/dashboard/products',
      icon: <FaBox />,
      label: 'Товары'
    },
    {
      path: '/admin/dashboard/promotions',
      icon: <FaPercent />,
      label: 'Акции'
    },
    {
      path: '/admin/dashboard/promocodes',
      icon: <FaTag />,
      label: 'Промокоды'
    },
    {
      path: '/admin/dashboard/content',
      icon: <FaFileAlt />,
      label: 'Контент'
    },
    {
      path: '/admin/dashboard/orders',
      icon: <FaUsers />,
      label: 'Заказы'
    }
  ];

  const isActiveLink = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <BrandLogo 
            to="/admin/advanced" 
            size="sm" 
            onClick={(e) => {
              if (window.location.pathname === '/admin/advanced') {
                e.preventDefault();
                window.location.reload();
              }
            }}
          />
          <Link to="/" className="brand-link" style={{ marginLeft: 'auto' }}>
            <FaHome />
            <span>На сайт</span>
          </Link>
          <button 
            className="sidebar-close"
            onClick={() => setIsSidebarOpen(false)}
          >
            <FaTimes />
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActiveLink(item.path, item.exact) ? 'active' : ''}`}
              onClick={() => setIsSidebarOpen(false)}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt />
            <span>Выйти</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-main">
        <header className="admin-header">
          <button 
            className="sidebar-toggle"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <FaBars />
          </button>
          
          <div className="admin-brand">
            <BrandLogo 
              to="/admin/advanced" 
              size="sm" 
              onClick={(e) => {
                if (window.location.pathname === '/admin/advanced') {
                  e.preventDefault();
                  window.location.reload();
                }
              }}
            />
            <h1 className="admin-title">Панель администратора</h1>
          </div>
          
          <div className="header-actions">
            <Link to="/" className="site-link">
              <FaHome /> На сайт
            </Link>
            <button className="logout-btn-header" onClick={handleLogout}>
              <FaSignOutAlt />
            </button>
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default AdminDashboard;
