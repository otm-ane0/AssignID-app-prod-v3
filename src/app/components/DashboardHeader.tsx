'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, 
  LogOut, 
  FileText, 
  Shield, 
  HelpCircle,
  ChevronDown,
  Lock
} from 'lucide-react'

// Logo Component - Larger, more visible design
const LoginSignLogo = () => (
  <motion.div 
    className="flex items-center gap-2"
    whileHover={{ scale: 1.02 }}
    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
  >
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="cursor-pointer"
    >
      {/* Padlock body */}
      <path
        d="M12 22V16C12 12.6863 14.6863 10 18 10H30C33.3137 10 36 12.6863 36 16V22"
        stroke="#0066CC"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      {/* Lock body */}
      <rect
        x="8"
        y="22"
        width="32"
        height="20"
        rx="4"
        fill="#0066CC"
      />
      {/* Keyhole */}
      <circle cx="24" cy="30" r="3" fill="white" />
      <path
        d="M24 33V37"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Small person icon inside */}
      <circle cx="24" cy="28" r="2" fill="white" />
    </svg>
  </motion.div>
)

// Types
interface DashboardHeaderProps {
  activeTab: 'account' | 'profile'
  onTabChange: (tab: 'account' | 'profile') => void
  userName: string
  userEmail: string
  userAvatar?: string
  onLogout: () => void
}

// Tab Switcher Component - Inspired by modern minimalistic design
const TabSwitcher = ({
  activeTab,
  onTabChange,
}: {
  activeTab: 'account' | 'profile'
  onTabChange: (tab: 'account' | 'profile') => void
}) => {
  const tabs = [
    { id: 'account' as const, label: 'Accounts' },
    { id: 'profile' as const, label: 'Profile' },
  ]

  return (
    <div className="relative inline-flex items-center bg-gray-50/80 rounded-full p-1 gap-2">
      {tabs.map((tab) => (
        <motion.button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`relative px-10 py-3 text-[15px] transition-colors duration-200 rounded-full ${
            activeTab === tab.id
              ? 'text-gray-900 font-medium'
              : 'text-gray-400 font-normal hover:text-gray-600'
          }`}
          whileTap={{ scale: 0.98 }}
        >
          <span className="relative z-10">{tab.label}</span>
          {activeTab === tab.id && (
            <motion.div
              layoutId="activeTabIndicator"
              className="absolute inset-0 bg-gray-200 rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
              style={{ zIndex: 0 }}
              initial={false}
              transition={{
                type: 'spring',
                stiffness: 500,
                damping: 35,
              }}
            />
          )}
        </motion.button>
      ))}
    </div>
  )
}

// User Avatar with Dropdown - Enhanced design
const UserMenu = ({
  userName,
  userEmail,
  userAvatar,
  onLogout,
}: {
  userName: string
  userEmail: string
  userAvatar?: string
  onLogout: () => void
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Get user initials
  const getInitials = () => {
    if (!userName) return 'U'
    return userName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const menuItems = [
    { label: 'Terms of use', href: 'https://loginsign.com/terms', icon: FileText },
    { label: 'Privacy Policy', href: 'https://loginsign.com/privacy', icon: Shield },
    { label: 'Support', href: 'https://loginsign.com/support', icon: HelpCircle },
  ]

  return (
    <div className="relative" ref={menuRef}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center justify-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-gray-200 hover:ring-gray-300 shadow-md transition-all duration-200">
          {userAvatar ? (
            <img
              src={userAvatar}
              alt={userName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-semibold text-[15px]">
              {getInitials()}
            </div>
          )}
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-xl border border-gray-100/80 overflow-hidden z-50"
            style={{
              boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 4px 12px -2px rgba(0, 0, 0, 0.05)'
            }}
          >
            {/* User Info Section */}
            <div className="px-5 py-4 bg-linear-to-br from-gray-50 to-white border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-white shadow-sm">
                  {userAvatar ? (
                    <img
                      src={userAvatar}
                      alt={userName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-semibold">
                      {getInitials()}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {userName || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{userEmail}</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2 px-2">
              {menuItems.map((item, index) => {
                const IconComponent = item.icon
                return (
                  <motion.a
                    key={index}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ x: 2 }}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors duration-150"
                    onClick={() => setIsOpen(false)}
                  >
                    <IconComponent className="w-4 h-4 text-gray-400" />
                    {item.label}
                  </motion.a>
                )
              })}
            </div>

            {/* Divider */}
            <div className="mx-4 border-t border-gray-100" />

            {/* Logout Button */}
            <div className="py-2 px-2">
              <motion.button
                onClick={() => {
                  setIsOpen(false)
                  onLogout()
                }}
                whileHover={{ x: 2 }}
                className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-150"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Main Header Component - Proper flexbox layout with perfect centering
export const DashboardHeader = ({
  activeTab,
  onTabChange,
  userName,
  userEmail,
  userAvatar,
  onLogout,
}: DashboardHeaderProps) => {
  return (
    <header className="w-full h-16 bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="w-full h-full">
        <div className="flex items-center justify-between h-full pl-6 pr-6">
          {/* Left: Logo - Far left */}
          <div className="flex items-center shrink-0">
            <a href="/" className="flex items-center">
              <LoginSignLogo />
            </a>
          </div>

          {/* Center: Tab Switcher - Absolutely centered */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <TabSwitcher activeTab={activeTab} onTabChange={onTabChange} />
          </div>

          {/* Right: User Menu - Far right */}
          <div className="flex items-center shrink-0">
            <UserMenu
              userName={userName}
              userEmail={userEmail}
              userAvatar={userAvatar}
              onLogout={onLogout}
            />
          </div>
        </div>
      </div>
    </header>
  )
}

export default DashboardHeader
