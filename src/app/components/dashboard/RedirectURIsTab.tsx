'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Copy, 
  Check, 
  AlertCircle,
  Terminal,
  Shield,
  Zap,
  Lock,
  Plus,
  Trash2,
  Link2,
  ExternalLink,
  Globe,
  Route
} from 'lucide-react';

interface RedirectURI {
  id: string;
  environment: string;
  uri: string;
}

interface RedirectURIsTabProps {
  initialData?: RedirectURI[];
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

const defaultRedirectURIs: RedirectURI[] = [
  {
    id: '1',
    environment: 'Development',
    uri: 'http://localhost:3000/callback'
  },
  {
    id: '2',
    environment: 'Production',
    uri: 'https://app.example.com/callback'
  }
];

export default function RedirectURIsTab({ initialData }: RedirectURIsTabProps) {
  // Form state
  const [redirectURIs, setRedirectURIs] = useState<RedirectURI[]>(initialData || defaultRedirectURIs);
  const [newURI, setNewURI] = useState('');
  const [newEnvironment, setNewEnvironment] = useState('');
  
  // Track dirty state
  const [isDirty, setIsDirty] = useState(false);
  const [originalData, setOriginalData] = useState<RedirectURI[]>(initialData || defaultRedirectURIs);
  
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
    const hasChanged = JSON.stringify(redirectURIs) !== JSON.stringify(originalData);
    setIsDirty(hasChanged);
  }, [redirectURIs, originalData]);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleAddURI = () => {
    if (newURI.trim()) {
      const newRedirectURI: RedirectURI = {
        id: Date.now().toString(),
        environment: newEnvironment.trim() || 'Custom',
        uri: newURI.trim()
      };
      setRedirectURIs([...redirectURIs, newRedirectURI]);
      setNewURI('');
      setNewEnvironment('');
    }
  };

  const handleRemoveURI = (id: string) => {
    setRedirectURIs(redirectURIs.filter(uri => uri.id !== id));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    setOriginalData(redirectURIs);
    setIsDirty(false);
    setIsSaving(false);
    console.log('Saved:', redirectURIs);
  };

  const handleDiscard = () => {
    setRedirectURIs(originalData);
    setNewURI('');
    setNewEnvironment('');
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
        {/* Main Redirect URIs Card */}
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
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(16, 185, 129, 0.15)',
              flexShrink: 0
            }}>
              <ExternalLink style={{ width: '24px', height: '24px', color: '#10b981' }} />
            </div>
            <div>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#111827',
                marginBottom: '6px',
                letterSpacing: '-0.5px'
              }}>
                Redirect URIs
              </h2>
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                lineHeight: '1.5'
              }}>
                Register exact URLs for OAuth callbacks.
              </p>
            </div>
          </div>

          {/* Body */}
          <div style={{ padding: '32px', position: 'relative', zIndex: 10 }}>
            {/* Table Header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '180px 1fr auto',
              gap: '16px',
              padding: '0 16px 12px',
              borderBottom: '1px solid #f1f5f9'
            }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '12px',
                fontWeight: '600',
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Globe style={{ width: '12px', height: '12px', color: '#3b82f6' }} />
                </div>
                Environment
              </label>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '12px',
                fontWeight: '600',
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Route style={{ width: '12px', height: '12px', color: '#10b981' }} />
                </div>
                Redirect URI
              </label>
              <div style={{ width: '80px' }} />
            </div>

            {/* URI List */}
            <div style={{ marginTop: '16px', marginBottom: '32px' }}>
              <AnimatePresence mode="popLayout">
                {redirectURIs.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20, height: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '180px 1fr auto',
                      gap: '16px',
                      padding: '16px',
                      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      marginBottom: '12px',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <p style={{
                        fontSize: '14px',
                        color: '#111827',
                        fontWeight: '600'
                      }}>
                        {item.environment}
                      </p>
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{
                        fontSize: '14px',
                        color: '#475569',
                        fontWeight: '500',
                        fontFamily: '"Monaco", "Menlo", "Ubuntu Mono", monospace',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {item.uri}
                      </p>
                    </div>
                    <motion.button
                      onClick={() => handleRemoveURI(item.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        padding: '8px 16px',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#ef4444',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        borderRadius: '8px',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      Remove
                    </motion.button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Add New URI Section */}
            <div style={{
              padding: '24px',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.03) 0%, rgba(147, 51, 234, 0.03) 100%)',
              border: '1px solid rgba(59, 130, 246, 0.1)',
              borderRadius: '12px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '16px'
              }}>
                <div style={{
                  padding: '8px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                }}>
                  <Plus style={{ width: '16px', height: '16px', color: '#fff' }} />
                </div>
                <label style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#111827'
                }}>
                  Add redirect URI
                </label>
              </div>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '180px 1fr auto',
                gap: '12px',
                alignItems: isMobile ? 'stretch' : 'end'
              }}>
                <div>
                  <input
                    type="text"
                    value={newEnvironment}
                    onChange={(e) => setNewEnvironment(e.target.value)}
                    style={{
                      width: '100%',
                      height: isMobile ? '44px' : '48px',
                      padding: '0 16px',
                      background: '#ffffff',
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
                      e.currentTarget.style.borderColor = '#3b82f6';
                      e.currentTarget.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                    }}
                    placeholder="Environment"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={newURI}
                    onChange={(e) => setNewURI(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddURI()}
                    style={{
                      width: '100%',
                      height: isMobile ? '44px' : '48px',
                      padding: '0 16px',
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '14px',
                      color: '#111827',
                      fontWeight: '500',
                      fontFamily: '"Monaco", "Menlo", "Ubuntu Mono", monospace',
                      outline: 'none',
                      transition: 'all 0.2s',
                      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#3b82f6';
                      e.currentTarget.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                    }}
                    placeholder="https://yourapp.com/callback"
                  />
                </div>
                <motion.button
                  onClick={handleAddURI}
                  disabled={!newURI.trim()}
                  whileHover={newURI.trim() ? { scale: 1.02 } : {}}
                  whileTap={newURI.trim() ? { scale: 0.98 } : {}}
                  style={{
                    height: isMobile ? '44px' : '48px',
                    padding: '0 24px',
                    width: isMobile ? '100%' : 'auto',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#fff',
                    background: newURI.trim() 
                      ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
                      : '#94a3b8',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: newURI.trim() ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s',
                    boxShadow: newURI.trim() ? '0 4px 12px rgba(59, 130, 246, 0.3)' : 'none',
                    opacity: newURI.trim() ? 1 : 0.6
                  }}
                  onMouseEnter={(e) => {
                    if (newURI.trim()) {
                      e.currentTarget.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (newURI.trim()) {
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                    }
                  }}
                >
                  Add
                </motion.button>
              </div>
            </div>
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

      {/* Unsaved Changes Bar */}
      <AnimatePresence>
        {isDirty && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            style={{
              background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(245, 158, 11, 0.15) 100%)',
              border: '1px solid rgba(251, 191, 36, 0.25)',
              borderRadius: '16px',
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.2) 0%, rgba(245, 158, 11, 0.25) 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <AlertCircle style={{ width: '20px', height: '20px', color: '#f59e0b' }} />
              </div>
              <div>
                <p style={{
                  fontSize: '15px',
                  fontWeight: '600',
                  color: '#92400e',
                  marginBottom: '4px'
                }}>
                  You have unsaved changes
                </p>
                <p style={{
                  fontSize: '13px',
                  color: '#b45309',
                  fontWeight: '500'
                }}>
                  Save or discard your changes before leaving
                </p>
              </div>
            </div>
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
                  background: isSaving ? '#64748b' : 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 12px rgba(15, 23, 42, 0.3)',
                  opacity: isSaving ? 0.7 : 1
                }}
                onMouseEnter={(e) => {
                  if (!isSaving) {
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(15, 23, 42, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(15, 23, 42, 0.3)';
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
  );
}
