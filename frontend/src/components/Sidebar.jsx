import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * Navigation configuration
 */
const navigationItems = [
  {
    path: '/',
    label: 'Dashboard',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
  },
  {
    path: '/members',
    label: 'Members',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
  },
  {
    path: '/events',
    label: 'Events',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    path: '/settings',
    label: 'Settings',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
  },
];

/**
 * Sidebar Component
 * Responsive navigation sidebar with collapsible functionality
 * 
 * @param {boolean} collapsed - Whether the sidebar is collapsed
 * @param {function} setCollapsed - Function to toggle sidebar collapse
 * @param {boolean} isMobile - Whether the current screen is mobile
 */
const Sidebar = ({ collapsed, setCollapsed, isMobile }) => {
  const location = useLocation();
  const sidebarRef = useRef(null);

  // Responsive state
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // Tooltip state
  const [hoveredItem, setHoveredItem] = useState(null);
  const [hoveredProfile, setHoveredProfile] = useState(false);
  const [hoveredExpandButton, setHoveredExpandButton] = useState(false);
  const [hoveredCloseButton, setHoveredCloseButton] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, item: null });
  const [profileTooltipPosition, setProfileTooltipPosition] = useState({ top: 0 });
  const [expandButtonTooltipPosition, setExpandButtonTooltipPosition] = useState({ top: 0 });
  const [closeButtonTooltipPosition, setCloseButtonTooltipPosition] = useState({ top: 0 });

  // Detect if device supports hover (not touch-only)
  const [supportsHover, setSupportsHover] = useState(true);

  useEffect(() => {
    // Check if device supports hover and set responsive states
    const hasHover = window.matchMedia('(hover: hover)').matches;
    setSupportsHover(hasHover);

    const handleResize = () => {
      const width = window.innerWidth;
      setIsTablet(width >= 640 && width < 1024);
      setIsDesktop(width >= 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Clear tooltip states when sidebar collapsed state changes
    setHoveredProfile(false);
    setHoveredItem(null);
    setHoveredExpandButton(false);
    setHoveredCloseButton(false);
  }, [collapsed]);

  /**
   * Check if a navigation path is currently active
   */
  const isActive = (path) => location.pathname === path;

  /**
   * Handle keyboard navigation
   */
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isMobile && !collapsed) {
        setCollapsed(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [collapsed, setCollapsed, isMobile]);

  /**
   * Handle touch gestures for mobile
   */
  useEffect(() => {
    if (!isMobile || collapsed) return;

    let startX = 0;
    let startY = 0;

    const handleTouchStart = (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const deltaX = startX - endX;
      const deltaY = Math.abs(startY - endY);

      // Swipe left to close sidebar (must be more horizontal than vertical)
      if (deltaX > 50 && deltaY < 100) {
        setCollapsed(true);
      }
    };

    const sidebarElement = sidebarRef.current;
    if (sidebarElement) {
      sidebarElement.addEventListener('touchstart', handleTouchStart);
      sidebarElement.addEventListener('touchend', handleTouchEnd);

      return () => {
        sidebarElement.removeEventListener('touchstart', handleTouchStart);
        sidebarElement.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isMobile, collapsed, setCollapsed]);

  /**
   * Toggle sidebar collapse
   */
  const handleToggle = () => {
    setCollapsed(!collapsed);
    // Clear tooltip states when toggling
    setHoveredProfile(false);
    setHoveredItem(null);
    setHoveredExpandButton(false);
    setHoveredCloseButton(false);
  };

  /**
   * Handle navigation link click on mobile
   */
  const handleNavClick = () => {
    if (isMobile) {
      setCollapsed(true);
    }
  };

  return (
    <>
      <aside
        ref={sidebarRef}
        className={`
          ${isMobile ? 'h-[100dvh]' : 'h-screen'} 
          bg-white 
          fixed 
          left-0 
          top-0 
          transition-all 
          duration-300 
          ease-in-out
          flex 
          flex-col 
          border-r 
          border-gray-200 
          shadow-lg
          sidebar-container
          ${isMobile ? 'sidebar-mobile' : ''}
          ${isTablet ? 'sidebar-tablet-landscape' : ''}
          custom-scrollbar
          ${isMobile
            ? `w-72 sm:w-80 ${collapsed ? '-translate-x-full' : 'translate-x-0'} z-40`
            : isTablet
              ? `w-72 ${collapsed ? '-translate-x-full lg:translate-x-0 lg:w-16' : 'translate-x-0'} z-40 lg:z-30`
              : collapsed
                ? 'w-16 translate-x-0 z-30'
                : 'w-64 translate-x-0 z-30'
          }
          ${!isDesktop ? 'safe-area-inset-left' : ''}
        `}
        role="navigation"
        aria-label="Main navigation"
        aria-hidden={collapsed && (isMobile || isTablet)}
      >
        {/* Header */}
        <header className={`
          flex 
          items-center 
          ${!isDesktop ? 'h-14' : 'h-16'}
          ${collapsed && isDesktop ? 'px-2' : 'px-4'}
          border-b 
          border-gray-200
          ${(collapsed && isDesktop) ? 'justify-center' : 'justify-between'}
          flex-shrink-0
          relative
          ${!isDesktop ? 'safe-area-inset-top' : ''}
        `}>
          {/* Logo - Full size when expanded or on mobile/tablet */}
          {(!collapsed || !isDesktop) && (
            <div className="flex items-center justify-center space-x-3 min-w-0">
              <img
                src="/SKUS.svg"
                alt="SKUS"
                className="h-8 sm:h-10 w-auto object-contain filter brightness-110 contrast-110 saturate-150 drop-shadow-sm flex-shrink-0 sidebar-logo"
              />
              <h1 className="text-lg sm:text-xl font-bold text-gray-800 leading-none drop-shadow-sm truncate">
                ProFile
              </h1>
            </div>
          )}

          {/* Logo - Compact size when collapsed on desktop */}
          {(collapsed && isDesktop) && (
            <div className="flex items-center justify-center w-full">
              <div
                className="group relative flex items-center justify-center w-12 h-12 rounded-lg hover:bg-gray-100 transition-all duration-200 cursor-pointer"
                onClick={handleToggle}
                onMouseEnter={(e) => {
                  if (supportsHover) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setExpandButtonTooltipPosition({
                      top: rect.top + (rect.height / 2)
                    });
                    setHoveredExpandButton(true);
                  }
                }}
                onMouseLeave={() => {
                  if (supportsHover) {
                    setHoveredExpandButton(false);
                  }
                }}
                aria-label="Expand sidebar"
              >
                {/* Logo - visible by default */}
                <img
                  src="/SKUS.svg"
                  alt="SKUS ProFile"
                  className="h-10 w-auto object-contain filter brightness-110 contrast-110 saturate-150 drop-shadow-sm group-hover:opacity-0 transition-opacity duration-200"
                />

                {/* Expand icon - visible on hover */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute h-5 w-5 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path d="M21.97 15V9C21.97 4 19.97 2 14.97 2H8.96997C3.96997 2 1.96997 4 1.96997 9V15C1.96997 20 3.96997 22 8.96997 22H14.97C19.97 22 21.97 20 21.97 15Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M14.97 2V22" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M7.96997 9.43994L10.53 11.9999L7.96997 14.5599" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          )}

          {/* Toggle button - visible when expanded or on mobile/tablet */}
          {(!collapsed || !isDesktop) && (
            <button
              className="
                absolute
                right-1
                top-1/2
                -translate-y-1/2
                p-1.5
                rounded-lg 
                hover:bg-gray-100 
                focus:outline-none 
                focus:ring-2 
                focus:ring-blue-500 
                focus:ring-offset-2
                transition-colors
                duration-200
                flex-shrink-0
                touch-manipulation
              "
              onClick={handleToggle}
              onMouseEnter={(e) => {
                if (supportsHover) {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setCloseButtonTooltipPosition({
                    top: rect.top + (rect.height / 2),
                    left: rect.right + 10
                  });
                  setHoveredCloseButton(true);
                }
              }}
              onMouseLeave={() => {
                if (supportsHover) {
                  setHoveredCloseButton(false);
                }
              }}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`
                  h-5 
                  w-5 
                  text-gray-600 
                  transition-transform 
                  duration-200 
                  ${collapsed ? 'rotate-180' : ''}
                `}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path d="M21.97 15V9C21.97 4 19.97 2 14.97 2H8.96997C3.96997 2 1.96997 4 1.96997 9V15C1.96997 20 3.96997 22 8.96997 22H14.97C19.97 22 21.97 20 21.97 15Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7.96997 2V22" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14.97 9.43994L12.41 11.9999L14.97 14.5599" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </header>

        {/* Navigation */}
        <nav className={`
          flex-1 overflow-y-auto py-4 min-h-0
          ${isMobile ? 'max-h-[calc(100dvh-7rem)]' : isTablet ? 'max-h-[calc(100dvh-7.5rem)]' : ''}
          ${!isDesktop ? 'safe-area-inset-bottom' : ''}
          navigation
          custom-scrollbar
          smooth-scroll
        `} role="menubar">
          <ul className={`space-y-1 ${collapsed && isDesktop ? 'px-1' : 'px-3'}`} role="none">
            {navigationItems.map((item) => (
              <li key={item.path} role="none">
                <Link
                  to={item.path}
                  onClick={handleNavClick}
                  onMouseEnter={(e) => {
                    if (collapsed && isDesktop && supportsHover) {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setTooltipPosition({
                        top: rect.top + (rect.height / 2),
                        item: item.path
                      });
                      setHoveredItem(item.path);
                    }
                  }}
                  onMouseLeave={() => {
                    if (supportsHover) {
                      setHoveredItem(null);
                    }
                  }}
                  className={`
                    group 
                    relative 
                    flex 
                    items-center 
                    ${collapsed && isDesktop ? 'justify-center p-3 mx-1' : 'px-4 py-3'} 
                    rounded-lg 
                    transition-all
                    duration-200 
                    focus:outline-none 
                    focus:ring-2 
                    focus:ring-blue-500 
                    focus:ring-offset-1
                    touch-manipulation
                    min-h-[44px]
                    ${isActive(item.path)
                      ? 'bg-blue-50 text-blue-700 shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }
                    ${collapsed && isDesktop ? 'w-12 h-12' : ''}
                  `}
                  role="menuitem"
                  aria-current={isActive(item.path) ? 'page' : undefined}
                >
                  <div className={`
                    flex-shrink-0
                    ${collapsed && isDesktop ? 'flex items-center justify-center' : ''}
                    ${isActive(item.path) ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}
                  `}>
                    {item.icon}
                  </div>

                  {(!collapsed || !isDesktop) && (
                    <span className="ml-3 font-medium truncate text-sm sm:text-base">
                      {item.label}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile Section */}
        <footer className={`
          border-t 
          border-gray-200 
          ${collapsed && isDesktop ? 'p-2' : 'p-4'}
          ${(collapsed && isDesktop) ? 'flex items-center justify-center' : ''}
          flex-shrink-0
          ${!isDesktop ? 'min-h-[4rem] safe-area-inset-bottom' : ''}
        `}>
          <div
            className={`
              ${collapsed && isDesktop
                ? 'group relative flex items-center justify-center w-12 h-12 rounded-lg hover:bg-gray-100 transition-all duration-200 cursor-pointer'
                : 'flex items-center space-x-3'
              }
            `}
            onMouseEnter={(e) => {
              if (collapsed && isDesktop && supportsHover) {
                const rect = e.currentTarget.getBoundingClientRect();
                setProfileTooltipPosition({
                  top: rect.top + (rect.height / 2)
                });
                setHoveredProfile(true);
              }
            }}
            onMouseLeave={() => {
              if (supportsHover) {
                setHoveredProfile(false);
              }
            }}
          >
            <div
              className={`
                ${collapsed && isDesktop ? 'w-6 h-6' : 'w-8 h-8 sm:w-10 sm:h-10'}
                rounded-full 
                bg-blue-500 
                flex 
                items-center 
                justify-center 
                text-white 
                font-semibold
                flex-shrink-0
                transition-all
                duration-200
                ${collapsed && isDesktop ? 'group-hover:bg-blue-600' : ''}
                text-sm sm:text-base
              `}
              role="img"
              aria-label="Admin user avatar"
            >
              A
            </div>

            {(!collapsed || !isDesktop) && (
              <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-base font-semibold text-gray-700 truncate">
                  Admin User
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 truncate">
                  admin@memberhub.com
                </p>
              </div>
            )}
          </div>
        </footer>
      </aside>

      {/* Tooltips Portal - Rendered outside sidebar to avoid overflow */}
      {collapsed && isDesktop && supportsHover && (
        <div className="fixed pointer-events-none z-50">
          {/* Navigation tooltips */}
          {navigationItems.map((item) => (
            <div
              key={`tooltip-${item.path}`}
              className={`
                absolute left-16 ml-1
                px-2 py-1
                bg-gray-900 text-white text-xs font-medium
                rounded border border-gray-700
                transition-opacity duration-150 ease-out
                whitespace-nowrap
                -translate-y-1/2
                shadow-lg
                ${hoveredItem === item.path && tooltipPosition.item === item.path ? 'opacity-100 visible' : 'opacity-0 invisible'}
              `}
              style={{
                top: `${tooltipPosition.item === item.path ? tooltipPosition.top : 0}px`,
              }}
            >
              {item.label}
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-[3px] border-transparent border-r-gray-900"></div>
            </div>
          ))}

          {/* Sidebar expand tooltip */}
          <div
            className={`
              absolute left-16 ml-1
              px-2 py-1
              bg-gray-900 text-white text-xs
              rounded border border-gray-700
              transition-opacity duration-150 ease-out
              whitespace-nowrap
              -translate-y-1/2
              shadow-lg
              ${hoveredExpandButton ? 'opacity-100 visible' : 'opacity-0 invisible'}
            `}
            style={{
              top: `${expandButtonTooltipPosition.top}px`,
            }}
          >
            <div className="font-medium">Open Sidebar</div>
            <div className="absolute right-full top-1/2 -translate-y-1/2 border-[3px] border-transparent border-r-gray-900"></div>
          </div>

          {/* User profile tooltip */}
          <div
            className={`
              absolute left-16 ml-2
              px-3 py-2
              bg-gray-900 text-white text-sm
              rounded-md border border-gray-700
              transition-opacity duration-150 ease-out
              whitespace-nowrap
              -translate-y-1/2
              shadow-lg
              ${hoveredProfile ? 'opacity-100 visible' : 'opacity-0 invisible'}
            `}
            style={{
              top: `${profileTooltipPosition.top}px`,
            }}
          >
            <div className="font-medium">Admin User</div>
            <div className="absolute right-full top-1/2 -translate-y-1/2 border-[3px] border-transparent border-r-gray-900"></div>
          </div>
        </div>
      )}

      {/* Close Button Tooltip - Shows when expanded and hovered */}
      {!collapsed && isDesktop && supportsHover && hoveredCloseButton && (
        <div
          className="fixed bg-gray-900 text-white px-2 py-1 rounded border border-gray-700 text-xs font-medium z-50 pointer-events-none whitespace-nowrap shadow-lg"
          style={{
            top: `${closeButtonTooltipPosition.top}px`,
            left: `${closeButtonTooltipPosition.left}px`,
            transform: 'translateY(-50%)',
          }}
        >
          Close Sidebar
          <div className="absolute right-full top-1/2 -translate-y-1/2 border-[3px] border-transparent border-r-gray-900"></div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
