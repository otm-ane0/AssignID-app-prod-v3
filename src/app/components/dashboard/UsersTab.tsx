'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Copy, 
  Check, 
  Terminal,
  Shield,
  Zap,
  Lock,
  Search,
  Users,
  Hash,
  User,
  Mail,
  Activity,
  Clock,
  Calendar,
  ToggleRight
} from 'lucide-react';

interface User {
  userId: string;
  name: string;
  email: string;
  sessions: number;
  lastSession: string;
  created: string;
  active: boolean;
}

interface QuickInfoField {
  label: string;
  value: string;
  icon: React.ElementType;
}

const quickInfoFields: QuickInfoField[] = [
  { 
    label: 'Issuer', 
    value: 'https://loginsign.com',
    icon: Shield
  },
  { 
    label: 'JWKS URL', 
    value: 'https://loginsign.com/.well-known/jwks.json',
    icon: Lock
  },
  { 
    label: 'Authorization endpoint', 
    value: 'https://loginsign.com/auth',
    icon: Zap
  },
  { 
    label: 'Token endpoint', 
    value: 'https://loginsign.com/token',
    icon: Terminal
  },
];

const initialUsers: User[] = [
  {
    userId: 'U0001',
    name: 'Max Müller',
    email: 'max.mueller+0001@loginsign.com',
    sessions: 23,
    lastSession: '2025-12-12',
    created: '2025-12-18',
    active: true
  },
  {
    userId: 'U0002',
    name: 'Anna Schmidt',
    email: 'anna.schmidt+0002@loginsign.com',
    sessions: 15,
    lastSession: '2025-12-10',
    created: '2025-12-03',
    active: true
  },
  {
    userId: 'U0003',
    name: 'Thomas Weber',
    email: 'thomas.weber+0003@loginsign.com',
    sessions: 8,
    lastSession: '2025-12-08',
    created: '2025-11-21',
    active: true
  },
  {
    userId: 'U0004',
    name: 'Sarah Fischer',
    email: 'sarah.fischer+0004@loginsign.com',
    sessions: 42,
    lastSession: '2025-12-06',
    created: '2025-11-07',
    active: false
  },
  {
    userId: 'U0005',
    name: 'Michael Koch',
    email: 'michael.koch+0005@loginsign.com',
    sessions: 3,
    lastSession: '2025-12-05',
    created: '2025-10-19',
    active: true
  },
  {
    userId: 'U0006',
    name: 'Julia Becker',
    email: 'julia.becker+0006@loginsign.com',
    sessions: 19,
    lastSession: '2025-12-03',
    created: '2025-10-01',
    active: true
  },
  {
    userId: 'U0007',
    name: 'David Wagner',
    email: 'david.wagner+0007@loginsign.com',
    sessions: 31,
    lastSession: '2025-12-01',
    created: '2025-09-28',
    active: true
  },
  {
    userId: 'U0008',
    name: 'Laura Meyer',
    email: 'laura.meyer+0008@loginsign.com',
    sessions: 12,
    lastSession: '2025-11-28',
    created: '2025-09-03',
    active: false
  },
  {
    userId: 'U0009',
    name: 'Daniel Schulz',
    email: 'daniel.schulz+0009@loginsign.com',
    sessions: 27,
    lastSession: '2025-11-26',
    created: '2025-08-22',
    active: true
  },
  {
    userId: 'U0010',
    name: 'Lisa Hoffmann',
    email: 'lisa.hoffmann+0010@loginsign.com',
    sessions: 5,
    lastSession: '2025-11-25',
    created: '2025-08-15',
    active: true
  }
];

export default function UsersTab() {
  // State
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Filter users based on search
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    
    const query = searchQuery.toLowerCase();
    return users.filter(user => 
      user.userId.toLowerCase().includes(query) ||
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  }, [users, searchQuery]);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleToggleActive = (userId: string) => {
    setUsers(users.map(user => 
      user.userId === userId ? { ...user, active: !user.active } : user
    ));
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: isMobile ? '16px' : '24px'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: isMobile ? '16px' : '24px'
      }}>
        {/* Main Users Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            position: 'relative',
            overflow: 'hidden',
            gridColumn: 'span 2'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)';
          }}
        >
          {/* Gradient Background */}
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '300px',
            height: '300px',
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%)',
            borderRadius: '50%',
            filter: 'blur(60px)',
            pointerEvents: 'none'
          }} />

          {/* Header */}
          <div style={{
            padding: isMobile ? '20px 16px' : '24px 32px',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'flex-start',
            gap: isMobile ? '12px' : '16px',
            position: 'relative',
            zIndex: 10
          }}>
            <div style={{
              width: isMobile ? '40px' : '48px',
              height: isMobile ? '40px' : '48px',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(79, 70, 229, 0.1) 100%)',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(99, 102, 241, 0.15)',
              flexShrink: 0
            }}>
              <Users style={{ width: isMobile ? '20px' : '24px', height: isMobile ? '20px' : '24px', color: '#6366f1' }} />
            </div>
            <div>
              <h2 style={{
                fontSize: isMobile ? '18px' : '20px',
                fontWeight: '700',
                color: '#111827',
                marginBottom: '6px',
                letterSpacing: '-0.5px'
              }}>
                Users
              </h2>
              <p style={{
                fontSize: isMobile ? '13px' : '14px',
                color: '#6b7280',
                lineHeight: '1.5'
              }}>
                Search by userID, name, or email. Sorted by createdDate (newest first).
              </p>
            </div>
          </div>

          {/* Body */}
          <div style={{ padding: isMobile ? '16px' : '32px', position: 'relative', zIndex: 10 }}>
            {/* Search Input */}
            <div style={{ marginBottom: isMobile ? '16px' : '24px', position: 'relative' }}>
              <div style={{ position: 'relative' }}>
                <Search style={{
                  position: 'absolute',
                  left: isMobile ? '12px' : '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: isMobile ? '16px' : '18px',
                  height: isMobile ? '16px' : '18px',
                  color: '#94a3b8',
                  pointerEvents: 'none'
                }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isMobile ? 'Search users...' : 'Search users (userID, name, email)...'}
                  style={{
                    width: '100%',
                    height: isMobile ? '44px' : '48px',
                    paddingLeft: isMobile ? '40px' : '48px',
                    paddingRight: isMobile ? '12px' : '16px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: isMobile ? '14px' : '14px',
                    color: '#111827',
                    fontWeight: '500',
                    outline: 'none',
                    transition: 'all 0.2s',
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.background = '#ffffff';
                    e.currentTarget.style.borderColor = '#3b82f6';
                    e.currentTarget.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.background = '#f8fafc';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                  }}
                />
              </div>
            </div>

            {/* Users Table */}
            <div style={{
              overflow: isMobile ? 'auto' : 'hidden',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              WebkitOverflowScrolling: 'touch'
            }}>
              <table style={{
                width: isMobile ? 'max-content' : '100%',
                minWidth: isMobile ? '900px' : '100%',
                borderCollapse: 'collapse',
                fontSize: isMobile ? '12px' : '13px',
                tableLayout: isMobile ? 'auto' : 'fixed'
              }}>
                <thead>
                  <tr style={{
                    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                    borderBottom: '1px solid #e2e8f0'
                  }}>
                    <th style={{
                      padding: isMobile ? '12px 16px' : '14px 18px',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#64748b',
                      fontSize: isMobile ? '10px' : '11px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      width: isMobile ? 'auto' : '8%'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '6px' : '8px' }}>
                        <div style={{
                          width: isMobile ? '18px' : '20px',
                          height: isMobile ? '18px' : '20px',
                          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(79, 70, 229, 0.1) 100%)',
                          borderRadius: '5px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Hash style={{ width: isMobile ? '9px' : '10px', height: isMobile ? '9px' : '10px', color: '#6366f1' }} />
                        </div>
                        UserID
                      </div>
                    </th>
                    <th style={{
                      padding: isMobile ? '12px 16px' : '14px 18px',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#64748b',
                      fontSize: isMobile ? '10px' : '11px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      width: isMobile ? 'auto' : '13%'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '6px' : '8px' }}>
                        <div style={{
                          width: isMobile ? '18px' : '20px',
                          height: isMobile ? '18px' : '20px',
                          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.1) 100%)',
                          borderRadius: '5px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <User style={{ width: isMobile ? '9px' : '10px', height: isMobile ? '9px' : '10px', color: '#3b82f6' }} />
                        </div>
                        Name
                      </div>
                    </th>
                    <th style={{
                      padding: isMobile ? '12px 16px' : '14px 18px',
                      textAlign: 'center',
                      fontWeight: '600',
                      color: '#64748b',
                      fontSize: isMobile ? '10px' : '11px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      width: isMobile ? 'auto' : '28%'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: isMobile ? '6px' : '8px' }}>
                        <div style={{
                          width: isMobile ? '18px' : '20px',
                          height: isMobile ? '18px' : '20px',
                          background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(219, 39, 119, 0.1) 100%)',
                          borderRadius: '5px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Mail style={{ width: isMobile ? '9px' : '10px', height: isMobile ? '9px' : '10px', color: '#ec4899' }} />
                        </div>
                        Email
                      </div>
                    </th>
                    <th style={{
                      padding: isMobile ? '12px 16px' : '14px 18px',
                      textAlign: 'center',
                      fontWeight: '600',
                      color: '#64748b',
                      fontSize: isMobile ? '10px' : '11px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      width: isMobile ? 'auto' : '8%'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: isMobile ? '6px' : '8px' }}>
                        <div style={{
                          width: isMobile ? '18px' : '20px',
                          height: isMobile ? '18px' : '20px',
                          background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.1) 0%, rgba(234, 88, 12, 0.1) 100%)',
                          borderRadius: '5px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Activity style={{ width: isMobile ? '9px' : '10px', height: isMobile ? '9px' : '10px', color: '#f97316' }} />
                        </div>
                        Sessions
                      </div>
                    </th>
                    <th style={{
                      padding: isMobile ? '12px 16px' : '14px 18px',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#64748b',
                      fontSize: isMobile ? '10px' : '11px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      width: isMobile ? 'auto' : '11%'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '6px' : '8px' }}>
                        <div style={{
                          width: isMobile ? '18px' : '20px',
                          height: isMobile ? '18px' : '20px',
                          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(109, 40, 217, 0.1) 100%)',
                          borderRadius: '5px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Clock style={{ width: isMobile ? '9px' : '10px', height: isMobile ? '9px' : '10px', color: '#8b5cf6' }} />
                        </div>
                        Last session
                      </div>
                    </th>
                    <th style={{
                      padding: isMobile ? '12px 16px' : '14px 18px',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#64748b',
                      fontSize: isMobile ? '10px' : '11px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      width: isMobile ? 'auto' : '10%'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '6px' : '8px' }}>
                        <div style={{
                          width: isMobile ? '18px' : '20px',
                          height: isMobile ? '18px' : '20px',
                          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)',
                          borderRadius: '5px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Calendar style={{ width: isMobile ? '9px' : '10px', height: isMobile ? '9px' : '10px', color: '#10b981' }} />
                        </div>
                        Created
                      </div>
                    </th>
                    <th style={{
                      padding: isMobile ? '12px 16px' : '14px 18px',
                      textAlign: 'center',
                      fontWeight: '600',
                      color: '#64748b',
                      fontSize: isMobile ? '10px' : '11px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      width: isMobile ? 'auto' : '10%'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: isMobile ? '6px' : '8px' }}>
                        <div style={{
                          width: isMobile ? '18px' : '20px',
                          height: isMobile ? '18px' : '20px',
                          background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(22, 163, 74, 0.1) 100%)',
                          borderRadius: '5px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <ToggleRight style={{ width: isMobile ? '9px' : '10px', height: isMobile ? '9px' : '10px', color: '#22c55e' }} />
                        </div>
                        Active
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence mode="popLayout">
                    {filteredUsers.map((user, index) => (
                      <motion.tr
                        key={user.userId}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2, delay: index * 0.02 }}
                        style={{
                          borderBottom: '1px solid #f1f5f9',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#f9fafb';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <td style={{
                          padding: isMobile ? '12px 16px' : '14px 18px',
                          color: '#64748b',
                          fontWeight: '500',
                          fontFamily: '"Monaco", "Menlo", "Ubuntu Mono", monospace',
                          fontSize: isMobile ? '11px' : '12px'
                        }}>
                          {user.userId}
                        </td>
                        <td style={{
                          padding: isMobile ? '12px 16px' : '14px 18px',
                          color: '#111827',
                          fontWeight: '500',
                          fontSize: isMobile ? '12px' : '13px'
                        }}>
                          {user.name}
                        </td>
                        <td style={{
                          padding: isMobile ? '12px 16px' : '14px 18px',
                          maxWidth: isMobile ? 'none' : '0',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          textAlign: 'center'
                        }}>
                          <a
                            href={`mailto:${user.email}`}
                            style={{
                              color: '#3b82f6',
                              textDecoration: 'none',
                              fontWeight: '500',
                              fontSize: isMobile ? '11px' : '12px',
                              transition: 'color 0.2s',
                              display: 'inline-block',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              maxWidth: '100%'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = '#2563eb';
                              e.currentTarget.style.textDecoration = 'underline';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = '#3b82f6';
                              e.currentTarget.style.textDecoration = 'none';
                            }}
                          >
                            {user.email}
                          </a>
                        </td>
                        <td style={{
                          padding: isMobile ? '12px 16px' : '14px 18px',
                          color: '#64748b',
                          fontWeight: '600',
                          fontSize: isMobile ? '12px' : '13px',
                          textAlign: 'center'
                        }}>
                          {user.sessions}
                        </td>
                        <td style={{
                          padding: isMobile ? '12px 16px' : '14px 18px',
                          color: '#64748b',
                          fontWeight: '500',
                          fontSize: isMobile ? '11px' : '12px'
                        }}>
                          {user.lastSession}
                        </td>
                        <td style={{
                          padding: isMobile ? '12px 16px' : '14px 18px',
                          color: '#64748b',
                          fontWeight: '500',
                          fontSize: isMobile ? '11px' : '12px'
                        }}>
                          {user.created}
                        </td>
                        <td style={{
                          padding: isMobile ? '12px 16px' : '14px 18px',
                          textAlign: 'center'
                        }}>
                          <motion.button
                            onClick={() => handleToggleActive(user.userId)}
                            whileTap={{ scale: 0.95 }}
                            style={{
                              position: 'relative',
                              width: isMobile ? '42px' : '48px',
                              height: isMobile ? '24px' : '28px',
                              background: user.active 
                                ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
                                : '#cbd5e1',
                              border: 'none',
                              borderRadius: isMobile ? '12px' : '14px',
                              cursor: 'pointer',
                              transition: 'all 0.3s',
                              boxShadow: user.active 
                                ? '0 2px 8px rgba(59, 130, 246, 0.3)'
                                : '0 1px 3px rgba(0, 0, 0, 0.1)',
                              display: 'inline-block'
                            }}
                          >
                            <motion.div
                              animate={{
                                x: user.active ? (isMobile ? 19 : 22) : 2
                              }}
                              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                              style={{
                                position: 'absolute',
                                top: '2px',
                                left: 0,
                                width: isMobile ? '20px' : '24px',
                                height: isMobile ? '20px' : '24px',
                                background: '#ffffff',
                                borderRadius: isMobile ? '10px' : '12px',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15)'
                              }}
                            />
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* No Results Message */}
            {filteredUsers.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  padding: '40px',
                  textAlign: 'center',
                  color: '#94a3b8',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                No users found matching "{searchQuery}"
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Quick Info Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
            borderRadius: '16px',
            border: '1px solid rgba(148, 163, 184, 0.1)',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.12)',
            position: 'relative',
            overflow: 'hidden',
            alignSelf: 'start'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.18)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 24px rgba(0, 0, 0, 0.12)';
          }}
        >
          {/* Gradient Background */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(40px)',
            pointerEvents: 'none'
          }} />

          {/* Console Header */}
          <div style={{
            padding: '24px',
            borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            position: 'relative',
            zIndex: 10
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(147, 51, 234, 0.2) 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(59, 130, 246, 0.3)'
            }}>
              <Terminal style={{ width: '20px', height: '20px', color: '#60a5fa' }} />
            </div>
            <div>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '700',
                color: '#fff',
                letterSpacing: '-0.3px'
              }}>
                Quick info
              </h3>
              <p style={{
                fontSize: '13px',
                color: '#94a3b8',
                fontWeight: '500'
              }}>
                Endpoints developers copy constantly.
              </p>
            </div>
          </div>

          {/* Console Body */}
          <div style={{ padding: '24px', position: 'relative', zIndex: 10 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {quickInfoFields.map((field, index) => {
                const Icon = field.icon;
                return (
                  <motion.div 
                    key={field.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.05, duration: 0.3 }}
                    style={{ position: 'relative' }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '10px'
                    }}>
                      <Icon style={{ width: '14px', height: '14px', color: '#60a5fa' }} />
                      <label style={{
                        fontSize: '11px',
                        fontWeight: '600',
                        color: '#94a3b8',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>
                        {field.label}
                      </label>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <div style={{
                        flex: 1,
                        padding: '12px 14px',
                        background: 'rgba(15, 23, 42, 0.6)',
                        border: '1px solid rgba(148, 163, 184, 0.15)',
                        borderRadius: '10px',
                        overflow: 'hidden'
                      }}>
                        <p style={{
                          fontSize: '12px',
                          color: '#cbd5e1',
                          fontFamily: '"Monaco", "Menlo", "Ubuntu Mono", monospace',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          fontWeight: '500'
                        }}>
                          {field.value}
                        </p>
                      </div>
                      <motion.button
                        onClick={() => handleCopy(field.value, field.label)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                          padding: '12px',
                          background: 'rgba(148, 163, 184, 0.1)',
                          border: '1px solid rgba(148, 163, 184, 0.15)',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(59, 130, 246, 0.15)';
                          e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(148, 163, 184, 0.1)';
                          e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.15)';
                        }}
                        title="Copy to clipboard"
                      >
                        <AnimatePresence mode="wait">
                          {copiedField === field.label ? (
                            <motion.div
                              key="check"
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              exit={{ scale: 0, rotate: 180 }}
                              transition={{ duration: 0.3 }}
                            >
                              <Check style={{ width: '16px', height: '16px', color: '#34d399' }} />
                            </motion.div>
                          ) : (
                            <motion.div
                              key="copy"
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              exit={{ scale: 0, rotate: 180 }}
                              transition={{ duration: 0.3 }}
                            >
                              <Copy style={{ width: '16px', height: '16px', color: '#94a3b8' }} />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Console Footer Note */}
            <div style={{
              marginTop: '24px',
              paddingTop: '20px',
              borderTop: '1px solid rgba(148, 163, 184, 0.1)'
            }}>
              <p style={{
                fontSize: '11px',
                color: '#64748b',
                lineHeight: '1.6',
                fontWeight: '500'
              }}>
                These endpoints are used by your OAuth clients for authentication. Keep them secure and don't share your credentials.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
