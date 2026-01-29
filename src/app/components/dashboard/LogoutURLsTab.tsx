'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Copy, 
  Check, 
  Terminal,
  Shield,
  Zap,
  Lock,
  LogOut,
  Link2
} from 'lucide-react';

interface LogoutURLsTabProps {
  initialURL?: string;
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

export default function LogoutURLsTab({ initialURL }: LogoutURLsTabProps) {
  // Form state
  const [logoutURL, setLogoutURL] = useState(initialURL || '');
  
  // Track dirty state
  const [isDirty, setIsDirty] = useState(false);
  const [originalURL, setOriginalURL] = useState(initialURL || '');
  
  // Copy functionality
  const [copiedField, setCopiedField] = useState<string | null>(null);
  
  // Save state
  const [isSaving, setIsSaving] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Check if form has changed
  useEffect(() => {
    const hasChanged = logoutURL !== originalURL;
    setIsDirty(hasChanged);
  }, [logoutURL, originalURL]);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    setOriginalURL(logoutURL);
    setIsDirty(false);
    setIsSaving(false);
    console.log('Saved logout URL:', logoutURL);
  };

  const handleDiscard = () => {
    setLogoutURL(originalURL);
    setIsDirty(false);
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
        {/* Main Logout URLs Card */}
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
            padding: '24px 32px',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '16px',
            position: 'relative',
            zIndex: 10
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(239, 68, 68, 0.15)',
              flexShrink: 0
            }}>
              <LogOut style={{ width: '24px', height: '24px', color: '#ef4444' }} />
            </div>
            <div>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#111827',
                marginBottom: '6px',
                letterSpacing: '-0.5px'
              }}>
                Logout URLs
              </h2>
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                lineHeight: '1.5'
              }}>
                Allowed return URL after logout.
              </p>
            </div>
          </div>

          {/* Body */}
          <div style={{ padding: '32px', position: 'relative', zIndex: 10 }}>
            {/* URL Input */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '10px',
                letterSpacing: '-0.01em'
              }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Link2 style={{ width: '12px', height: '12px', color: '#ef4444' }} />
                </div>
                Allowed logout URL
              </label>
              
              <input
                type="text"
                value={logoutURL}
                onChange={(e) => setLogoutURL(e.target.value)}
                style={{
                  width: '100%',
                  height: '48px',
                  padding: '0 16px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '14px',
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
                placeholder="https://app.example.com/logout-callback"
              />
            </div>

            {/* Unsaved Changes Inline */}
            <AnimatePresence>
              {isDirty && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '20px',
                    paddingTop: '20px',
                    borderTop: '1px solid #f1f5f9'
                  }}
                >
                  <p style={{
                    fontSize: '14px',
                    color: '#64748b',
                    fontWeight: '500'
                  }}>
                    Unsaved changes
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <motion.button
                      type="button"
                      onClick={handleDiscard}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        padding: '10px 20px',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#64748b',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        borderRadius: '10px',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#0f172a';
                        e.currentTarget.style.background = 'rgba(148, 163, 184, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#64748b';
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      Discard
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={handleSave}
                      disabled={isSaving}
                      whileHover={isSaving ? {} : { scale: 1.02 }}
                      whileTap={isSaving ? {} : { scale: 0.98 }}
                      style={{
                        padding: '12px 24px',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#fff',
                        background: isSaving ? '#64748b' : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                        border: 'none',
                        borderRadius: '10px',
                        cursor: isSaving ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.2s',
                        boxShadow: isSaving ? 'none' : '0 4px 12px rgba(59, 130, 246, 0.3)',
                        opacity: isSaving ? 0.7 : 1
                      }}
                      onMouseEnter={(e) => {
                        if (!isSaving) {
                          e.currentTarget.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.4)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSaving) {
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                        }
                      }}
                    >
                      {isSaving ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                            style={{
                              width: '14px',
                              height: '14px',
                              border: '2px solid rgba(255, 255, 255, 0.3)',
                              borderTopColor: '#fff',
                              borderRadius: '50%'
                            }}
                          />
                          Saving...
                        </>
                      ) : (
                        'Save changes'
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
            overflow: 'hidden'
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
