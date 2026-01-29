'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Palette,
  Key,
  Link2,
  Globe,
  LogOut,
  Boxes,
  BookOpen,
  Users,
  Code,
  ChevronRight,
  User,
  Bell,
  Settings,
  Search,
  Menu,
  X,
  TrendingUp,
  Activity,
  Shield,
  Zap,
} from 'lucide-react';
import {
  DotFilledIcon,
  DotsHorizontalIcon,
} from '@radix-ui/react-icons';
import GeneralTab from './GeneralTab';
import BrandingTab from './BrandingTab';
import OAuthClientTab from './OAuthClientTab';
import RedirectURIsTab from './RedirectURIsTab';
import WebOriginsTab from './WebOriginsTab';
import LogoutURLsTab from './LogoutURLsTab';
import IntegrationTab from './IntegrationTab';
import DocsTab from './DocsTab';
import UsersTab from './UsersTab';
import APITab from './APITab';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
  isNew?: boolean;
}

const navItems: NavItem[] = [
  { id: 'general', label: 'General', icon: LayoutDashboard },
  { id: 'branding', label: 'Branding', icon: Palette },
  { id: 'oauth-client', label: 'OAuth Client', icon: Key, badge: 3 },
  { id: 'redirect-uris', label: 'Redirect URIs', icon: Link2 },
  { id: 'web-origins', label: 'Web Origins', icon: Globe },
  { id: 'logout-urls', label: 'Logout URLs', icon: LogOut },
  { id: 'integration', label: 'Integration', icon: Boxes, isNew: true },
  { id: 'docs', label: 'Docs', icon: BookOpen },
  { id: 'users', label: 'Users', icon: Users, badge: 12 },
  { id: 'api', label: 'API', icon: Code },
];

const statsCards = [
  {
    title: 'Total Users',
    value: '2,543',
    change: '+12.5%',
    trend: 'up',
    icon: Users,
    color: 'from-blue-500 to-blue-600',
  },
  {
    title: 'Active Sessions',
    value: '1,234',
    change: '+8.2%',
    trend: 'up',
    icon: Activity,
    color: 'from-green-500 to-green-600',
  },
  {
    title: 'API Requests',
    value: '45.2K',
    change: '+23.1%',
    trend: 'up',
    icon: Zap,
    color: 'from-purple-500 to-purple-600',
  },
  {
    title: 'Security Score',
    value: '98%',
    change: '+2.4%',
    trend: 'up',
    icon: Shield,
    color: 'from-orange-500 to-orange-600',
  },
];

export default function DashboardShell() {
  const [activeTab, setActiveTab] = useState<string>('general');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(false);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Render content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralTab />;
      
      case 'branding':
        return <BrandingTab />;
      
      case 'oauth-client':
        return <OAuthClientTab />;
      
      case 'redirect-uris':
        return <RedirectURIsTab />;
      
      case 'web-origins':
        return <WebOriginsTab />;
      
      case 'logout-urls':
        return <LogoutURLsTab />;
      
      case 'integration':
        return <IntegrationTab />;
      
      case 'docs':
        return <DocsTab />;
      
      case 'users':
        return <UsersTab />;
      
      case 'api':
        return <APITab />;
      
      // Placeholder for other tabs - show stats cards + placeholder
      default:
        return (
          <>
            {/* Stats Cards Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: isMobile ? '16px' : '24px',
              marginBottom: isMobile ? '24px' : '32px'
            }}>
              {statsCards.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    whileHover={{ y: -4 }}
                    style={{
                      background: '#ffffff',
                      borderRadius: '16px',
                      padding: '24px',
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                      position: 'relative',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)';
                    }}
                  >
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      width: '128px',
                      height: '128px',
                      background: `linear-gradient(135deg, ${stat.color.split(' ')[1]} 0%, ${stat.color.split(' ')[3]} 100%)`,
                      opacity: 0.1,
                      borderRadius: '50%',
                      filter: 'blur(40px)',
                      transition: 'opacity 0.3s'
                    }} />
                    
                    <div style={{ position: 'relative', zIndex: 10 }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        marginBottom: '16px'
                      }}>
                        <div style={{
                          padding: '12px',
                          borderRadius: '12px',
                          background: `linear-gradient(135deg, ${stat.color.split(' ')[1]} 0%, ${stat.color.split(' ')[3]} 100%)`,
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                        }}>
                          <Icon className="w-6 h-6" style={{ color: '#fff' }} />
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#059669'
                        }}>
                          <TrendingUp className="w-4 h-4" />
                          {stat.change}
                        </div>
                      </div>
                      
                      <div>
                        <p style={{
                          fontSize: '14px',
                          color: '#6b7280',
                          fontWeight: '500',
                          marginBottom: '4px'
                        }}>
                          {stat.title}
                        </p>
                        <p style={{
                          fontSize: '32px',
                          fontWeight: '700',
                          color: '#111827',
                          letterSpacing: '-0.5px'
                        }}>
                          {stat.value}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Placeholder Content Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              style={{
                background: '#ffffff',
                borderRadius: '16px',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                border: '1px solid #e5e7eb',
                padding: '32px',
                transition: 'box-shadow 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)';
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                marginBottom: '24px'
              }}>
                <div>
                  <h1 style={{
                    fontSize: '28px',
                    fontWeight: '700',
                    color: '#111827',
                    marginBottom: '8px',
                    letterSpacing: '-0.5px'
                  }}>
                    {navItems.find(item => item.id === activeTab)?.label || 'General'}
                  </h1>
                  <p style={{ fontSize: '15px', color: '#6b7280', lineHeight: '1.6' }}>
                    Manage and configure your {navItems.find(item => item.id === activeTab)?.label.toLowerCase()} settings
                  </p>
                </div>
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    padding: '12px',
                    background: 'linear-gradient(135deg, #eff6ff 0%, #f3e8ff 100%)',
                    borderRadius: '12px'
                  }}
                >
                  {React.createElement(navItems.find(item => item.id === activeTab)?.icon || LayoutDashboard, {
                    className: 'w-8 h-8',
                    style: { color: '#3b82f6' }
                  })}
                </motion.div>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                borderRadius: '12px',
                padding: '32px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  color: '#6b7280'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Code className="w-6 h-6" style={{ color: '#3b82f6' }} />
                  </div>
                  <div>
                    <p style={{ fontWeight: '600', fontSize: '15px', color: '#111827' }}>
                      Content Area Ready
                    </p>
                    <p style={{ fontSize: '14px', marginTop: '2px' }}>
                      Inner page components will be rendered here
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        );
    }
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              zIndex: 35,
              backdropFilter: 'blur(4px)'
            }}
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Fixed Position */}
      <motion.aside
        initial={false}
        animate={{
          width: isMobile ? 288 : (sidebarCollapsed ? 80 : 288),
          x: isMobile ? (mobileMenuOpen ? 0 : -288) : 0
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        style={{
          height: '100vh',
          background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
          color: '#fff',
          position: 'fixed',
          left: 0,
          top: 0,
          overflow: 'hidden',
          boxShadow: '4px 0 24px rgba(0, 0, 0, 0.12)',
          borderRight: '1px solid rgba(148, 163, 184, 0.1)',
          zIndex: 40,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Sidebar Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
          backdropFilter: 'blur(8px)',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <motion.div
              initial={false}
              animate={{ opacity: sidebarCollapsed ? 0 : 1 }}
              transition={{ duration: 0.2 }}
            >
              {!sidebarCollapsed && (
                <>
                  <h1 style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    background: 'linear-gradient(135deg, #fff 0%, #cbd5e1 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '-0.5px'
                  }}>
                    LoginSign
                  </h1>
                  <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px', fontWeight: '500' }}>
                    Dashboard v2.0
                  </p>
                </>
              )}
            </motion.div>
            {!isMobile && (
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                style={{
                  padding: '8px',
                  borderRadius: '8px',
                  background: 'rgba(148, 163, 184, 0.1)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  marginLeft: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(148, 163, 184, 0.2)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(148, 163, 184, 0.1)'}
              >
                {sidebarCollapsed ? <Menu className="w-5 h-5" color="#fff" /> : <X className="w-5 h-5" color="#fff" />}
              </button>
            )}
            {isMobile && (
              <button
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  padding: '8px',
                  borderRadius: '8px',
                  background: 'rgba(148, 163, 184, 0.1)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  marginLeft: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(148, 163, 184, 0.2)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(148, 163, 184, 0.1)'}
              >
                <X className="w-5 h-5" color="#fff" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav style={{ 
          padding: '16px', 
          paddingBottom: '8px',
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          msOverflowStyle: 'none',
          scrollbarWidth: 'none'
        }}>
          <style dangerouslySetInnerHTML={{
            __html: `
              nav::-webkit-scrollbar {
                display: none;
              }
            `
          }} />
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, paddingBottom: '16px' }}>
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  style={{ marginBottom: '8px' }}
                >
                  <motion.button
                    onClick={() => {
                      setActiveTab(item.id);
                      if (isMobile) setMobileMenuOpen(false);
                    }}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '14px 16px',
                      borderRadius: '12px',
                      border: 'none',
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden',
                      background: isActive 
                        ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(147, 51, 234, 0.15) 100%)' 
                        : 'transparent',
                      color: isActive ? '#fff' : '#cbd5e1',
                      fontWeight: isActive ? '600' : '500',
                      fontSize: '14px',
                      transition: 'all 0.2s',
                      boxShadow: isActive ? '0 4px 12px rgba(59, 130, 246, 0.15)' : 'none'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'rgba(148, 163, 184, 0.1)';
                        e.currentTarget.style.color = '#fff';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#cbd5e1';
                      }
                    }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(147, 51, 234, 0.2) 100%)',
                          borderRadius: '12px',
                        }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                    <Icon 
                      className={`w-5 h-5`} 
                      style={{ 
                        position: 'relative', 
                        zIndex: 10,
                        color: isActive ? '#60a5fa' : 'inherit'
                      }} 
                    />
                    {!sidebarCollapsed && (
                      <>
                        <span style={{ position: 'relative', zIndex: 10, flex: 1, textAlign: 'left' }}>
                          {item.label}
                        </span>
                        {item.badge && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            style={{
                              position: 'relative',
                              zIndex: 10,
                              padding: '2px 8px',
                              fontSize: '11px',
                              fontWeight: '600',
                              background: 'rgba(59, 130, 246, 0.2)',
                              color: '#60a5fa',
                              borderRadius: '9999px',
                              border: '1px solid rgba(59, 130, 246, 0.3)'
                            }}
                          >
                            {item.badge}
                          </motion.span>
                        )}
                        {item.isNew && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            style={{
                              position: 'relative',
                              zIndex: 10,
                              padding: '2px 8px',
                              fontSize: '11px',
                              fontWeight: '600',
                              background: 'rgba(16, 185, 129, 0.2)',
                              color: '#34d399',
                              borderRadius: '9999px',
                              border: '1px solid rgba(16, 185, 129, 0.3)'
                            }}
                          >
                            NEW
                          </motion.span>
                        )}
                      </>
                    )}
                  </motion.button>
                </motion.li>
              );
            })}
          </ul>
        </nav>
      </motion.aside>

      {/* Main Content Area */}
      <motion.main
        initial={false}
        animate={{ marginLeft: isMobile ? 0 : (sidebarCollapsed ? 80 : 288) }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        style={{ flex: 1, minHeight: '100vh', width: '100%' }}
      >
        {/* Header */}
        <header style={{
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(226, 232, 240, 0.5)',
          position: 'sticky',
          top: 0,
          zIndex: 20,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: isMobile ? '12px 16px' : '16px 32px',
            gap: '12px'
          }}>
            {/* Mobile Menu Button & Breadcrumb */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: isMobile ? '8px' : '12px',
                flex: isMobile ? 1 : 'unset'
              }}
            >
              {isMobile && (
                <motion.button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    padding: '8px',
                    borderRadius: '10px',
                    background: '#fff',
                    border: '1px solid #e2e8f0',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s',
                    flexShrink: 0
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
                >
                  <Menu className="w-5 h-5" style={{ color: '#64748b' }} />
                </motion.button>
              )}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: isMobile ? '13px' : '14px',
                overflow: 'hidden'
              }}>
                {!isMobile && <span style={{ color: '#64748b', fontWeight: '500' }}>Dashboard</span>}
                {!isMobile && <ChevronRight className="w-4 h-4" style={{ color: '#94a3b8' }} />}
                <span style={{
                  color: '#0f172a',
                  fontWeight: '600',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {navItems.find(item => item.id === activeTab)?.label || 'General'}
                </span>
              </div>
            </motion.div>

            {/* Actions & User Profile */}
            <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '12px' }}>
              {/* Search - Hidden on mobile */}
              {!isMobile && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    padding: '10px',
                    borderRadius: '12px',
                    background: '#fff',
                    border: '1px solid #e2e8f0',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
                >
                  <Search className="w-5 h-5" style={{ color: '#64748b' }} />
                </motion.button>
              )}

              {/* Notifications */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: isMobile ? '8px' : '10px',
                  borderRadius: '12px',
                  background: '#fff',
                  border: '1px solid #e2e8f0',
                  cursor: 'pointer',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
              >
                <Bell className="w-5 h-5" style={{ color: '#64748b' }} />
                <span style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  width: '8px',
                  height: '8px',
                  background: '#ef4444',
                  borderRadius: '50%',
                  border: '2px solid #fff'
                }}></span>
              </motion.button>

              {/* Settings - Hidden on mobile */}
              {!isMobile && (
                <motion.button
                  whileHover={{ scale: 1.05, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    padding: '10px',
                    borderRadius: '12px',
                    background: '#fff',
                    border: '1px solid #e2e8f0',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
                >
                  <Settings className="w-5 h-5" style={{ color: '#64748b' }} />
                </motion.button>
              )}

              {/* Divider - Hidden on mobile */}
              {!isMobile && <div style={{ width: '1px', height: '32px', background: '#e2e8f0' }} />}

              {/* User Profile */}
              <div style={{ position: 'relative' }}>
                <motion.button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: isMobile ? '0' : '12px',
                    padding: isMobile ? '8px' : '8px 16px',
                    borderRadius: '12px',
                    background: profileMenuOpen ? '#f8fafc' : '#fff',
                    border: '1px solid #e2e8f0',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => !profileMenuOpen && (e.currentTarget.style.background = '#f8fafc')}
                  onMouseLeave={(e) => !profileMenuOpen && (e.currentTarget.style.background = '#fff')}
                >
                  <div style={{
                    width: isMobile ? '32px' : '36px',
                    height: isMobile ? '32px' : '36px',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                  }}>
                    <User className="w-5 h-5" style={{ color: '#fff' }} />
                  </div>
                  {!isMobile && (
                    <>
                      <div style={{ textAlign: 'left' }}>
                        <p style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>Admin User</p>
                        <p style={{ fontSize: '12px', color: '#64748b' }}>admin@assignid.com</p>
                      </div>
                      <DotsHorizontalIcon className="w-4 h-4" style={{ color: '#94a3b8' }} />
                    </>
                  )}
                </motion.button>

                {/* Profile Dropdown Menu */}
                <AnimatePresence>
                  {profileMenuOpen && (
                    <>
                      {/* Backdrop */}
                      <div
                        onClick={() => setProfileMenuOpen(false)}
                        style={{
                          position: 'fixed',
                          inset: 0,
                          zIndex: 30
                        }}
                      />
                      
                      {/* Dropdown */}
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        style={{
                          position: 'absolute',
                          top: 'calc(100% + 8px)',
                          right: 0,
                          width: '240px',
                          background: '#fff',
                          borderRadius: '12px',
                          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                          border: '1px solid #e2e8f0',
                          overflow: 'hidden',
                          zIndex: 50
                        }}
                      >
                        {/* User Info Header */}
                        <div style={{
                          padding: '16px',
                          borderBottom: '1px solid #e2e8f0',
                          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
                        }}>
                          <p style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a', marginBottom: '4px' }}>
                            Admin User
                          </p>
                          <p style={{ fontSize: '12px', color: '#64748b' }}>
                            admin@assignid.com
                          </p>
                        </div>

                        {/* Menu Items */}
                        <div style={{ padding: '8px' }}>
                          <button
                            onClick={() => {
                              setProfileMenuOpen(false);
                              // Add your logout logic here
                              console.log('Logout clicked');
                            }}
                            style={{
                              width: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              padding: '12px',
                              borderRadius: '8px',
                              border: 'none',
                              background: 'transparent',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              fontSize: '14px',
                              color: '#ef4444',
                              fontWeight: '500'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#fee2e2';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'transparent';
                            }}
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div style={{ padding: isMobile ? '16px' : '32px' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.main>
    </div>
  );
}
