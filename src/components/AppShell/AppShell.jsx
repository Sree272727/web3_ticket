import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  FiHeadphones,
  FiBell,
  FiSettings,
  FiBarChart2,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiCheck,
  FiHelpCircle,
} from 'react-icons/fi';
import { usePersona } from '../../context/PersonaContext';
import './AppShell.css';

const NAV_ITEMS = [
  { path: '/support', icon: FiHeadphones, label: 'Support Portal' },
  { path: '/notifications', icon: FiBell, label: 'Notification Center' },
  { path: '/admin', icon: FiSettings, label: 'Admin Console' },
  { path: '/reporting', icon: FiBarChart2, label: 'Reporting Dashboard' },
];

const PAGE_NAMES = {
  '/support': 'Support Portal',
  '/notifications': 'Notification Center',
  '/admin': 'Admin Console',
  '/reporting': 'Reporting Dashboard',
};

function PersonaDropdown() {
  const { activePersona, switchPersona, PERSONAS } = usePersona();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="topbar-persona-wrapper" ref={ref}>
      <button
        type="button"
        className={`topbar-persona-trigger${open ? ' open' : ''}`}
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={`topbar-persona-dot ${activePersona.colorClass}`} />
        <span>{activePersona.label}</span>
        <FiChevronDown size={14} />
      </button>

      {open && (
        <div className="topbar-persona-menu" role="listbox">
          {PERSONAS.map((persona) => (
            <button
              key={persona.id}
              type="button"
              className={`topbar-persona-option${persona.id === activePersona.id ? ' active' : ''}`}
              onClick={() => {
                switchPersona(persona.id);
                setOpen(false);
              }}
            >
              <span className={`topbar-persona-dot ${persona.colorClass}`} />
              <span className="topbar-persona-option-copy">
                <span className="topbar-persona-option-label">{persona.label}</span>
                <span className="topbar-persona-option-desc">{persona.description}</span>
              </span>
              {persona.id === activePersona.id && <FiCheck size={14} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AppShell() {
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [topbarActions, setTopbarActions] = useState({});
  const pageName = PAGE_NAMES[location.pathname] || 'Platform';
  const isSupportRoute = location.pathname === '/support';

  const registerTopbarActions = useCallback((actions) => {
    setTopbarActions((previous) => ({ ...previous, ...actions }));
  }, []);

  useEffect(() => {
    if (!isSupportRoute) {
      setTopbarActions({});
    }
  }, [isSupportRoute]);

  return (
    <div className={`app-shell${isSidebarCollapsed ? ' sidebar-collapsed' : ''}`}>
      <aside className="app-sidebar">
        <div className="sidebar-logo-area">
          <div className="sidebar-brand-mark">TCS</div>
          {!isSidebarCollapsed && (
            <div className="sidebar-brand-copy">
              <div className="sidebar-brand-name">The Compliance Store</div>
              <div className="sidebar-brand-tagline">Because Getting It Right Matters.</div>
            </div>
          )}
        </div>

        {!isSidebarCollapsed && <div className="sidebar-section-label">Modules</div>}

        <nav className="sidebar-nav" aria-label="Main navigation">
          {NAV_ITEMS.map(({ path, icon: Icon, label }) => (
            <NavLink
              key={path}
              to={path}
              title={isSidebarCollapsed ? label : undefined}
              className={({ isActive }) => `sidebar-nav-item${isActive ? ' active' : ''}`}
            >
              <span className="sidebar-nav-icon">
                <Icon size={16} />
              </span>
              {!isSidebarCollapsed && <span className="sidebar-nav-label">{label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          {isSidebarCollapsed ? (
            <span className="sidebar-version">v2.0</span>
          ) : (
            <span className="sidebar-version">TCS Platform v2.0 · POC</span>
          )}
        </div>
      </aside>

      <div className="app-main">
        <header className="app-topbar">
          <div className="topbar-left">
            <button
              type="button"
              className="sidebar-toggle-btn"
              onClick={() => setIsSidebarCollapsed((value) => !value)}
              aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isSidebarCollapsed ? <FiChevronRight size={16} /> : <FiChevronLeft size={16} />}
            </button>
            <span className="topbar-breadcrumb">
              <span>TCS Platform</span>
              <span className="topbar-separator">/</span>
              <span className="topbar-page-name">{pageName}</span>
            </span>
          </div>

          <div className="topbar-right">
            {isSupportRoute && topbarActions.onOpenHelp && (
              <button type="button" className="topbar-help-btn" onClick={topbarActions.onOpenHelp}>
                <FiHelpCircle size={15} />
                Help & Resources
              </button>
            )}
            <PersonaDropdown />
          </div>
        </header>

        <main className="app-content">
          <Outlet context={{ registerTopbarActions }} />
        </main>
      </div>
    </div>
  );
}
