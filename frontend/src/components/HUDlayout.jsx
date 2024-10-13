import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "./ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar"
import { SearchIcon, BellIcon, CalendarIcon, LogInIcon, UserPlusIcon, ShieldIcon, LogOutIcon, HeartIcon, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from './ui/ThemeToggle';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  const handleAdminActions = () => {
    navigate('/admin-actions');
    setShowUserMenu(false);
  };

  let  basename = process.env.REACT_APP_BASENAME || '';

  if (basename === '/') {
    basename = '';
  }

  return (
    <div className="flex h-screen w-full flex-col bg-background text-foreground">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-muted px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2 text-lg font-semibold">
          <img src={`${basename}/vakslogo_kuvake.png`} alt="VAKS Logo" className="h-6 w-6" />
          <span className="hidden md:inline">VAKS-Viestiseinä</span>
        </Link>

        <nav className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary">
            <CalendarIcon className="h-5 w-5"  />
            <span className="hidden md:inline">{t('common.events')}</span>
          </Link>

          {user ? (
            <>
              {user.role === 'organizer' && (
                <Link to="/moderate" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary">
                  <ShieldIcon className="h-5 w-5" />
                  <span className="hidden md:inline">{t('common.moderate')}</span>
                </Link>
              )}
              <Button variant="ghost" size="icon" aria-label={t('common.search')}>
                <SearchIcon className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" aria-label={t('common.notifications')}>
                <BellIcon className="h-5 w-5" />
              </Button>
              <div className="relative" ref={menuRef}>
                <Avatar
                  className="h-8 w-8 border cursor-pointer"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <AvatarImage src={`${basename}placeholder-user.jpg`} alt="Avatar" />
                  <AvatarFallback>AC</AvatarFallback>
                </Avatar>
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-background border border-muted rounded-md shadow-lg py-1 z-10">
                    {user && user.role === 'organizer' && (
                      <button
                        onClick={handleAdminActions}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        {t('common.adminActions')}
                      </button>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted"
                    >
                      <LogOutIcon className="h-4 w-4 mr-2" />
                      {t('common.logout')}
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary">
                <LogInIcon className="h-5 w-5" />
                <span className="hidden md:inline">{t('common.login')}</span>
              </Link>
              <Link to="/register" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary">
                <UserPlusIcon className="h-5 w-5" />
                <span className="hidden md:inline">{t('common.register')}</span>
              </Link>
            </>
          )}
          <ThemeToggle />
          <LanguageSwitcher />
        </nav>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <nav className="hidden h-full w-64 flex-col border-r border-muted bg-muted-foreground/5 px-4 py-6 md:flex">
          <div className="mb-6 flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" style={{ color: '#93C01F' }}/>
            <h2 className="text-lg font-semibold">{t('common.events')}</h2>
          </div>
          <div className="flex-1 overflow-auto">
            <Link
              to="/"
              className="mb-2 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted hover:text-primary"
            >
              <CalendarIcon className="h-4 w-4" />
              <span>{t('common.upcomingEvents')}</span>
            </Link>
            <Link
              to="/past-events"
              className="mb-2 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted hover:text-primary"
            >
              <CalendarIcon className="h-4 w-4" />
              <span>{t('common.pastEvents')}</span>
            </Link>
            <Link
              to="/saved-events"
              className="mb-2 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted hover:text-primary"
            >
              <HeartIcon className="h-4 w-4" />
              <span>{t('common.savedEvents')}</span>
            </Link>
          </div>
        </nav>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

function MessageCircleIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  )
}
