'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  CheckCircle2, 
  Circle, 
  Copy, 
  Check, 
  Upload, 
  Code2, 
  Lock, 
  Key, 
  Link2, 
  Shield,
  ChevronDown,
  ChevronUp,
  Rocket,
  KeyRound,
  Globe,
  Server,
  ShieldCheck
} from 'lucide-react'
import Input from '../../components/Input'
import Button, { ButtonType } from '../../components/Button'
import { BodyText } from '../../components/Text'

// Step completion state interface
interface StepCompletion {
  projectSetup: boolean
  step1: boolean
  step2: boolean
  step3: boolean
  step4: {
    verifySignature: boolean
    verifyIssuer: boolean
    verifyAudience: boolean
    verifyExpiration: boolean
    extractIdentity: boolean
  }
}

// Code block component with copy functionality
const CodeBlock = ({ code, language = 'javascript' }: { code: string, language?: string }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="code-block-wrapper"
      style={{
        position: 'relative',
        backgroundColor: '#1e1e1e',
        borderRadius: '8px',
        padding: '16px',
        marginTop: '12px',
        marginBottom: '12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      }}
    >
      <button
        onClick={handleCopy}
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: 'rgba(255, 255, 255, 0.1)',
          border: 'none',
          borderRadius: '6px',
          padding: '8px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          color: '#fff',
          fontSize: '12px',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
        {copied ? 'Copied!' : 'Copy'}
      </button>
      <pre style={{
        margin: 0,
        fontSize: '13px',
        lineHeight: '1.6',
        color: '#d4d4d4',
        overflow: 'auto',
        paddingRight: '80px'
      }}>
        <code>{code}</code>
      </pre>
    </motion.div>
  )
}

// Step card component
const StepCard = ({ 
  children, 
  isCompleted,
  onToggleComplete,
  delay = 0
}: { 
  children: React.ReactNode
  isCompleted: boolean
  onToggleComplete: () => void
  delay?: number
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '32px',
        marginBottom: '24px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        border: '1px solid #e5e7eb',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {isCompleted && (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '4px' }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            backgroundColor: '#10b981',
          }}
        />
      )}
      {children}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onToggleComplete}
        style={{
          marginTop: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 20px',
          borderRadius: '8px',
          border: isCompleted ? '1px solid #10b981' : '1px solid #d1d5db',
          backgroundColor: isCompleted ? '#ecfdf5' : '#ffffff',
          color: isCompleted ? '#059669' : '#6b7280',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '500',
          transition: 'all 0.2s'
        }}
      >
        {isCompleted ? (
          <>
            <CheckCircle2 size={18} />
            Completed
          </>
        ) : (
          <>
            <Circle size={18} />
            Mark as Complete
          </>
        )}
      </motion.button>
    </motion.div>
  )
}

// Checklist item component
const ChecklistItem = ({ 
  label, 
  isChecked, 
  onToggle 
}: { 
  label: string
  isChecked: boolean
  onToggle: () => void
}) => {
  return (
    <motion.div
      whileHover={{ x: 4 }}
      onClick={onToggle}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        borderRadius: '8px',
        cursor: 'pointer',
        backgroundColor: isChecked ? '#f0fdf4' : '#f9fafb',
        border: `1px solid ${isChecked ? '#bbf7d0' : '#e5e7eb'}`,
        marginBottom: '8px',
        transition: 'all 0.2s'
      }}
    >
      <div style={{
        minWidth: '24px',
        minHeight: '24px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: isChecked ? '#10b981' : '#ffffff',
        border: `2px solid ${isChecked ? '#10b981' : '#d1d5db'}`,
        transition: 'all 0.2s'
      }}>
        {isChecked && <Check size={14} color="#ffffff" />}
      </div>
      <span style={{
        fontSize: '14px',
        color: isChecked ? '#166534' : '#374151',
        fontWeight: isChecked ? '500' : '400'
      }}>
        {label}
      </span>
    </motion.div>
  )
}

// OAuth credential display component
const CredentialItem = ({ 
  icon, 
  label, 
  value, 
  isSecret = false 
}: { 
  icon: React.ReactNode
  label: string
  value: string
  isSecret?: boolean
}) => {
  const [showSecret, setShowSecret] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        padding: '16px',
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
        marginBottom: '12px',
        border: '1px solid #e5e7eb'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        {icon}
        <span style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>
          {label}
          {isSecret && <span style={{ 
            marginLeft: '8px', 
            fontSize: '11px', 
            color: '#ef4444',
            backgroundColor: '#fee2e2',
            padding: '2px 8px',
            borderRadius: '4px',
            fontWeight: '500'
          }}>Backend Only</span>}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <code style={{
          flex: 1,
          fontSize: '13px',
          padding: '8px 12px',
          backgroundColor: '#ffffff',
          borderRadius: '6px',
          border: '1px solid #e5e7eb',
          color: isSecret && !showSecret ? '#9ca3af' : '#1f2937',
          fontFamily: 'monospace',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {isSecret && !showSecret ? '••••••••••••••••••••' : value}
        </code>
        {isSecret && (
          <button
            onClick={() => setShowSecret(!showSecret)}
            style={{
              padding: '8px',
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '11px',
              color: '#6b7280'
            }}
          >
            {showSecret ? 'Hide' : 'Show'}
          </button>
        )}
        <button
          onClick={handleCopy}
          style={{
            padding: '8px',
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {copied ? <Check size={16} color="#10b981" /> : <Copy size={16} color="#6b7280" />}
        </button>
      </div>
    </motion.div>
  )
}

export default function StartGuidePage() {
  const [projectName, setProjectName] = useState('')
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [showLoginDemo, setShowLoginDemo] = useState(false)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  
  const [completion, setCompletion] = useState<StepCompletion>({
    projectSetup: false,
    step1: false,
    step2: false,
    step3: false,
    step4: {
      verifySignature: false,
      verifyIssuer: false,
      verifyAudience: false,
      verifyExpiration: false,
      extractIdentity: false
    }
  })

  const toggleProjectSetup = () => {
    setCompletion(prev => ({ ...prev, projectSetup: !prev.projectSetup }))
  }

  const toggleStep1 = () => {
    setCompletion(prev => ({ ...prev, step1: !prev.step1 }))
  }

  const toggleStep2 = () => {
    setCompletion(prev => ({ ...prev, step2: !prev.step2 }))
  }

  const toggleStep3 = () => {
    setCompletion(prev => ({ ...prev, step3: !prev.step3 }))
  }

  const toggleStep4Item = (key: keyof StepCompletion['step4']) => {
    setCompletion(prev => ({
      ...prev,
      step4: {
        ...prev.step4,
        [key]: !prev.step4[key]
      }
    }))
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0])
    }
  }

  const handleTestLogin = () => {
    setIsLoggingIn(true)
    setShowLoginDemo(false)
    
    // Simulate login process
    setTimeout(() => {
      setIsLoggingIn(false)
      setShowLoginDemo(true)
    }, 1500)
  }

  // Code examples
  const frontendCode = `<html>
<head>
  <script src="https://loginsign.com/sdk.js"></script>
</head>
<body>
  <button id="loginsign-button">Continue with LoginSign</button>

  <script>
    LoginSign.init({
      clientId: 'CLIENT_ID',
      redirectUri: 'http://localhost:3000/callback',
      scope: 'openid email profile'
    });

    document.getElementById('loginsign-button').onclick = () => {
      LoginSign.login()
        .then(result => {
          console.log('User:', result.user);
          localStorage.setItem('user', JSON.stringify(result.user));
          window.location.href = '/dashboard';
        })
        .catch(err => console.error('Login failed:', err));
    };
  </script>
</body>
</html>`

  const backendCode = `// server.js (Node.js + Express)
const express = require('express');
const axios = require('axios');
const { jwtVerify, createRemoteJWKSet } = require('jose');

const app = express();
const jwks = createRemoteJWKSet(new URL('https://loginsign.com/.well-known/jwks.json'));

app.get('/callback', async (req, res) => {
  const { code } = req.query;

  const tokenResponse = await axios.post('https://loginsign.com/token', {
    client_id: 'CLIENT_ID',
    client_secret: 'CLIENT_SECRET',
    code,
    grant_type: 'authorization_code',
    redirect_uri: 'http://localhost:3000/callback'
  });

  const { id_token } = tokenResponse.data;

  const { payload } = await jwtVerify(id_token, jwks, {
    issuer: 'https://loginsign.com',
    audience: 'CLIENT_ID'
  });

  console.log('User:', payload.sub, payload.email);
  res.redirect('/dashboard?user=' + payload.sub);
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));`

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f3f4f6',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            textAlign: 'center',
            marginBottom: '48px'
          }}
        >
          <h1 style={{
            fontSize: '36px',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '12px',
            background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            LoginSign Integration Guide
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#6b7280',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Follow these steps to integrate centralized authentication into your application.
            It's as simple as "Sign in with Google" but for your own platform.
          </p>
        </motion.div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '32px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            border: '1px solid #e5e7eb'
          }}
        >
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
            Your Progress
          </h2>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {[
              completion.projectSetup,
              completion.step1,
              completion.step2,
              completion.step3,
              Object.values(completion.step4).every(v => v)
            ].map((isComplete, index) => (
              <motion.div
                key={index}
                initial={{ width: 0 }}
                animate={{ width: '20%' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                style={{
                  height: '8px',
                  backgroundColor: isComplete ? '#10b981' : '#e5e7eb',
                  borderRadius: '4px',
                  transition: 'background-color 0.3s'
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Project Setup */}
        <StepCard 
          isCompleted={completion.projectSetup}
          onToggleComplete={toggleProjectSetup}
          delay={0.1}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.3)'
            }}>
              <Rocket size={24} />
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', letterSpacing: '0.5px' }}>STEP 0</div>
              <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', margin: 0 }}>
                Project Setup
              </h2>
            </div>
          </div>
          <p style={{ fontSize: '15px', color: '#6b7280', lineHeight: '1.6', marginBottom: '24px' }}>
            Start by giving your project a name and optionally uploading a logo. 
            This information will be displayed to users during the authentication flow.
          </p>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Project Name
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="My Awesome App"
              style={{
                width: '100%',
                padding: '10px 14px',
                fontSize: '14px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                outline: 'none',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Project Logo (Optional)
            </label>
            <div style={{
              border: '2px dashed #d1d5db',
              borderRadius: '8px',
              padding: '24px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#3b82f6'
              e.currentTarget.style.backgroundColor = '#eff6ff'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#d1d5db'
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
            onClick={() => document.getElementById('logo-upload')?.click()}
            >
              <Upload size={32} color="#9ca3af" style={{ margin: '0 auto 8px' }} />
              <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                {logoFile ? logoFile.name : 'Click to upload or drag and drop'}
              </p>
              <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                PNG, JPG or SVG (max. 2MB)
              </p>
              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                style={{ display: 'none' }}
              />
            </div>
          </div>
        </StepCard>

        {/* Step 1: Create OAuth Client */}
        <StepCard 
          isCompleted={completion.step1}
          onToggleComplete={toggleStep1}
          delay={0.2}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 6px -1px rgba(124, 58, 237, 0.3)'
            }}>
              <KeyRound size={24} />
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', letterSpacing: '0.5px' }}>STEP 1</div>
              <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', margin: 0 }}>
                Create OAuth Client
              </h2>
            </div>
          </div>
          <p style={{ fontSize: '15px', color: '#6b7280', lineHeight: '1.6', marginBottom: '24px' }}>
            After creating your project, you'll receive OAuth credentials. 
            Keep your CLIENT_SECRET secure and never expose it in frontend code.
          </p>

          <div style={{
            backgroundColor: '#fefce8',
            border: '1px solid #fde047',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <Shield size={20} color="#ca8a04" style={{ marginTop: '2px' }} />
              <div>
                <p style={{ fontSize: '13px', fontWeight: '600', color: '#854d0e', margin: '0 0 4px 0' }}>
                  Security Notice
                </p>
                <p style={{ fontSize: '13px', color: '#a16207', margin: 0, lineHeight: '1.5' }}>
                  Store CLIENT_SECRET in environment variables. Never commit it to version control or expose it in client-side code.
                </p>
              </div>
            </div>
          </div>

          <CredentialItem
            icon={<Key size={16} color="#6366f1" />}
            label="CLIENT_ID"
            value="loginsign_cli_1a2b3c4d5e6f7g8h9i0j"
          />
          
          <CredentialItem
            icon={<Lock size={16} color="#ef4444" />}
            label="CLIENT_SECRET"
            value="loginsign_sec_9z8y7x6w5v4u3t2s1r0q_AbCdEfGhIjKlMnOpQrSt"
            isSecret={true}
          />
          
          <CredentialItem
            icon={<Link2 size={16} color="#8b5cf6" />}
            label="AUTHORIZATION_ENDPOINT"
            value="https://auth.loginsign.com/oauth/authorize"
          />
          
          <CredentialItem
            icon={<Code2 size={16} color="#10b981" />}
            label="TOKEN_ENDPOINT"
            value="https://auth.loginsign.com/oauth/token"
          />
          
          <CredentialItem
            icon={<Shield size={16} color="#f59e0b" />}
            label="JWKS_URL"
            value="https://auth.loginsign.com/.well-known/jwks.json"
          />
          
          <CredentialItem
            icon={<Link2 size={16} color="#06b6d4" />}
            label="REDIRECT_URI"
            value="https://yourapp.com/callback"
          />
        </StepCard>

        {/* Step 2: Add Login Button */}
        <StepCard 
          isCompleted={completion.step2}
          onToggleComplete={toggleStep2}
          delay={0.3}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.3)'
            }}>
              <Globe size={24} />
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', letterSpacing: '0.5px' }}>STEP 2</div>
              <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', margin: 0 }}>
                Add Login Button (Frontend)
              </h2>
            </div>
          </div>
          <p style={{ fontSize: '15px', color: '#6b7280', lineHeight: '1.6', marginBottom: '16px' }}>
            Add the LoginSign button to your application's login page. 
            When clicked, it redirects users to the LoginSign authorization server.
          </p>

          <CodeBlock code={frontendCode} language="html" />

          <div style={{
            marginTop: '24px',
            textAlign: 'center'
          }}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleTestLogin}
              disabled={isLoggingIn}
              style={{
                padding: '14px 32px',
                fontSize: '16px',
                fontWeight: '600',
                color: '#ffffff',
                background: isLoggingIn 
                  ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
                  : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                border: 'none',
                borderRadius: '10px',
                cursor: isLoggingIn ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.3), 0 2px 4px -1px rgba(37, 99, 235, 0.2)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'all 0.3s'
              }}
            >
              {isLoggingIn ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    style={{
                      width: '18px',
                      height: '18px',
                      border: '2px solid #ffffff',
                      borderTopColor: 'transparent',
                      borderRadius: '50%'
                    }}
                  />
                  Authenticating...
                </>
              ) : (
                <>
                  <Code2 size={20} />
                  Test LoginSign Button
                </>
              )}
            </motion.button>
          </div>

          {showLoginDemo && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 0.5,
                type: "spring",
                stiffness: 300,
                damping: 20
              }}
              style={{
                marginTop: '20px',
                padding: '20px',
                backgroundColor: '#ecfdf5',
                border: '2px solid #86efac',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.1), 0 2px 4px -1px rgba(16, 185, 129, 0.06)'
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 500, damping: 15 }}
              >
                <CheckCircle2 size={28} color="#10b981" />
              </motion.div>
              <div style={{ flex: 1 }}>
                <p style={{ 
                  margin: 0, 
                  fontSize: '15px', 
                  fontWeight: '700', 
                  color: '#065f46',
                  lineHeight: '1.5'
                }}>
                  Demo: Logged in as demo@example.com (ID: user123)
                </p>
                <p style={{ 
                  margin: '4px 0 0 0', 
                  fontSize: '13px', 
                  color: '#059669',
                  lineHeight: '1.4'
                }}>
                  Authentication successful! User data received from LoginSign.
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowLoginDemo(false)}
                style={{
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#059669',
                  backgroundColor: '#d1fae5',
                  border: '1px solid #86efac',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Dismiss
              </motion.button>
            </motion.div>
          )}

          <div style={{
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: '8px',
            padding: '16px',
            marginTop: '16px'
          }}>
            <p style={{ fontSize: '13px', fontWeight: '600', color: '#1e40af', margin: '0 0 8px 0' }}>
              💡 What happens next?
            </p>
            <ul style={{ fontSize: '13px', color: '#1e40af', margin: 0, paddingLeft: '20px', lineHeight: '1.6' }}>
              <li>User clicks the button and is redirected to LoginSign</li>
              <li>User authenticates with their LoginSign account</li>
              <li>LoginSign redirects back to your callback URL with an authorization code</li>
              <li>Your backend exchanges the code for tokens</li>
            </ul>
          </div>
        </StepCard>

        {/* Step 3: Handle Callback */}
        <StepCard 
          isCompleted={completion.step3}
          onToggleComplete={toggleStep3}
          delay={0.4}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 6px -1px rgba(245, 158, 11, 0.3)'
            }}>
              <Server size={24} />
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', letterSpacing: '0.5px' }}>STEP 3</div>
              <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', margin: 0 }}>
                Handle Callback (Backend)
              </h2>
            </div>
          </div>
          <p style={{ fontSize: '15px', color: '#6b7280', lineHeight: '1.6', marginBottom: '16px' }}>
            Set up a backend endpoint to handle the OAuth callback. 
            This endpoint exchanges the authorization code for tokens and verifies the ID token.
          </p>

          <CodeBlock code={backendCode} language="javascript" />

          <div style={{
            backgroundColor: '#fef3c7',
            border: '1px solid #fde047',
            borderRadius: '8px',
            padding: '16px',
            marginTop: '16px'
          }}>
            <p style={{ fontSize: '13px', fontWeight: '600', color: '#92400e', margin: '0 0 8px 0' }}>
              ⚠️ Important Notes
            </p>
            <ul style={{ fontSize: '13px', color: '#92400e', margin: 0, paddingLeft: '20px', lineHeight: '1.6' }}>
              <li>Always verify the state parameter to prevent CSRF attacks</li>
              <li>Use HTTPS in production for secure communication</li>
              <li>Store tokens securely (HTTP-only cookies recommended)</li>
              <li>Implement token refresh logic for long-lived sessions</li>
            </ul>
          </div>
        </StepCard>

        {/* Step 4: Verify Tokens */}
        <StepCard 
          isCompleted={Object.values(completion.step4).every(v => v)}
          onToggleComplete={() => {}}
          delay={0.5}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.3)'
            }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', letterSpacing: '0.5px' }}>STEP 4</div>
              <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', margin: 0 }}>
                Token Verification Checklist
              </h2>
            </div>
          </div>
          <p style={{ fontSize: '15px', color: '#6b7280', lineHeight: '1.6', marginBottom: '24px' }}>
            Ensure you perform all these verification steps to securely validate the ID token.
            This is critical for preventing security vulnerabilities.
          </p>

          <ChecklistItem
            label="Verify signature with JWKS (RS256 algorithm)"
            isChecked={completion.step4.verifySignature}
            onToggle={() => toggleStep4Item('verifySignature')}
          />
          
          <ChecklistItem
            label="Verify issuer (iss) matches 'https://auth.loginsign.com'"
            isChecked={completion.step4.verifyIssuer}
            onToggle={() => toggleStep4Item('verifyIssuer')}
          />
          
          <ChecklistItem
            label="Verify audience (aud) matches your CLIENT_ID"
            isChecked={completion.step4.verifyAudience}
            onToggle={() => toggleStep4Item('verifyAudience')}
          />
          
          <ChecklistItem
            label="Verify expiration (exp) is in the future"
            isChecked={completion.step4.verifyExpiration}
            onToggle={() => toggleStep4Item('verifyExpiration')}
          />
          
          <ChecklistItem
            label="Extract user identity (sub, email, name, picture)"
            isChecked={completion.step4.extractIdentity}
            onToggle={() => toggleStep4Item('extractIdentity')}
          />

          <div style={{
            backgroundColor: '#dcfce7',
            border: '1px solid #86efac',
            borderRadius: '8px',
            padding: '16px',
            marginTop: '20px'
          }}>
            <p style={{ fontSize: '13px', fontWeight: '600', color: '#166534', margin: '0 0 8px 0' }}>
              ✓ Security Best Practices
            </p>
            <ul style={{ fontSize: '13px', color: '#166534', margin: 0, paddingLeft: '20px', lineHeight: '1.6' }}>
              <li>Use a well-tested JWT library (jsonwebtoken, jose, etc.)</li>
              <li>Cache JWKS keys to improve performance</li>
              <li>Implement token refresh before expiration</li>
              <li>Log authentication attempts for security monitoring</li>
            </ul>
          </div>
        </StepCard>

        {/* Completion Message */}
        {Object.values(completion).every(v => 
          typeof v === 'boolean' ? v : Object.values(v).every(x => x)
        ) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{
              backgroundColor: '#f0fdf4',
              border: '2px solid #86efac',
              borderRadius: '12px',
              padding: '32px',
              textAlign: 'center',
              marginTop: '32px',
              boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.1), 0 4px 6px -2px rgba(16, 185, 129, 0.05)'
            }}
          >
            <div style={{
              width: '64px',
              height: '64px',
              margin: '0 auto 16px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CheckCircle2 size={36} color="#ffffff" />
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#166534', marginBottom: '8px' }}>
              🎉 Integration Complete!
            </h2>
            <p style={{ fontSize: '15px', color: '#15803d', lineHeight: '1.6', maxWidth: '500px', margin: '0 auto' }}>
              Congratulations! You've completed all the steps. Your application is now ready to use LoginSign authentication.
              Test the integration thoroughly before going to production.
            </p>
          </motion.div>
        )}

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          style={{
            textAlign: 'center',
            marginTop: '48px',
            paddingTop: '32px',
            borderTop: '1px solid #e5e7eb'
          }}
        >
          <p style={{ fontSize: '14px', color: '#9ca3af' }}>
            Need help? Check out our{' '}
            <a href="/docs" style={{ color: '#3b82f6', textDecoration: 'none' }}>documentation</a>
            {' '}or{' '}
            <a href="/support" style={{ color: '#3b82f6', textDecoration: 'none' }}>contact support</a>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
