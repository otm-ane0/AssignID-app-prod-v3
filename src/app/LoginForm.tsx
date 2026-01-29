'use client'
import BackIcon from './icons/Back'
import GoogleIcon from './icons/Google'
import AppleIcon from './icons/Apple'
import EmailIcon from './icons/Email'
import Input from './components/Input'
import Button, { ButtonType } from './components/Button'
import { BodyLink } from './components/Link'
import Link from 'next/link'
import {
  useOnClickOutside,
  useOnClickOutsideCustom,
} from './hooks/useOnClickOutside'
import { BodyText } from './components/Text'
import FacebookIcon from './icons/Facebook'
import XIcon from './icons/X'
import MicrosoftIcon from './icons/Microsoft'
import GithubIcon from './icons/Github'
import RedirectForm from './RedirectForm'
import JSCookie from 'js-cookie'
import { useEffect, useRef, useState } from 'react';

export const LoginSignLogo = (props: any) => (
  <svg
    width={39}
    height={50}
    viewBox="0 0 39 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect
      x={4.34375}
      y={0.289062}
      width={30.6057}
      height={38.6724}
      rx={15.3029}
      fill="#0E273D"
    />
    <rect
      x={9.55859}
      y={5.03125}
      width={20.1666}
      height={30.843}
      rx={10.0833}
      fill="#FAFAFB"
    />
    <path
      d="M0 24.1682C0 21.411 2.23519 19.1758 4.99243 19.1758H33.6446C36.4019 19.1758 38.637 21.411 38.637 24.1682V43.4867C38.637 46.8434 35.9159 49.5645 32.5593 49.5645H6.07773C2.72109 49.5645 0 46.8434 0 43.4867V24.1682Z"
      fill="#055491"
    />
    <path
      d="M13.2422 40.0287C13.2422 36.889 15.7874 34.3438 18.9271 34.3438H19.4956C22.6354 34.3438 25.1806 36.889 25.1806 40.0287V44.0082H13.2422V40.0287Z"
      fill="#FAFAFB"
    />
    <circle cx={19.3493} cy={29.7907} r={4.97434} fill="#FAFAFB" />
  </svg>
)

const NavLink = ({ icon, text, onClick, href }: any) => {
  return (
    <a href={href || "#"} onClick={onClick} className="navigation-link">
      {icon && <span>{icon}</span>}
      {text && <span>{text}</span>}
    </a>
  )
}

const Navigation = ({loginProps}: any) => {
  return (
    <div className="assign-navigation">
      <div className="inner">
      <NavLink href={loginProps.userAppUrl} icon={<BackIcon style={{position: 'relative', top: '-1px'}} />} text={`Back`} />
        {/* <NavLink href={loginProps.userAppUrl} text={`Back to ${loginProps.name}`} /> */}
        <NavLink text={'Need help?'} />
      </div>
    </div>
  )
}

const FormList = {
  PasswordLogin: 'login',
  Signup: 'signup',
  OtpLogin: 'otp',
  OtpCode: 'otp_code',
}

function LoginForm({
  loginProps,
  style,
  showLogo = true,
  selfApp = false,
  onFormChange
}: {
  loginProps: any
  style?: any
  showLogo?: boolean
  selfApp?: boolean,
  onFormChange?: any
}) {
  const lastFormRef = useRef<any>(null);
  const [activeForm, setActiveForm] = useState(FormList.PasswordLogin)

  const emailInputRef = useRef<HTMLInputElement | null>(null)
  const passwordInputRef = useRef<HTMLInputElement | null>(null)
  const otpInputRef = useRef<HTMLInputElement | null>(null)
  const cfPasswordInputRef = useRef<HTMLInputElement | null>(null)
  const buttonClickRef = useRef(false)
  const buttonContinueRef = useRef<HTMLDivElement | null>(null)
  const [loginWithEmailActivated, setLoginWithEmailActivated] = useState(false)
  const [enteredEmailValue, setEnteredEmailValue] = useState<string | null>(
    null,
  )
  const emailValueRef = useRef<string | null>(null)
  const [loginWithOTPEnabled, setLoginWithOTPEnabled] = useState(false)
  const [loginResponse, setLoginResponse] = useState<any>(null)
  const [moreOptionsActivated, setMoreOptionsActivated] = useState(false)
  const [redirectParams, setRedirectParams] = useState<any>(null)
  const [currentScreen, setCurrentScreen] = useState<string | null>(null)
  const [account, setAccount] = useState<any>(null);
 
  const [error, setError] = useState<{
    field: string | null
    err: string
  }>({
    field: null,
    err: '',
  })
 
  const onLoginWithEmailClicked = (e: any) => {
    setLoginWithEmailActivated(true)
  }

  useEffect(() => {
    // Listener for the custom event
    const handleCustomEvent = (event: CustomEvent) => {
      console.log('Custom event received:', event.detail.new_form);
      setActiveForm(event.detail.new_form);
      lastFormRef.current = event.detail.new_form;
      // setCurrentScreen()
    };

    // Add event listener
    window.addEventListener('change_form', handleCustomEvent as EventListener);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('change_form', handleCustomEvent as EventListener);
    };
  }, []); // Empty dependency array ensures this effect runs once on mount

  useEffect(() => {
    console.log('____loginprops :: ', loginProps)
  }, [loginProps])

  useEffect(() => {
    if(onFormChange) {
      onFormChange(activeForm)
    }
  }, [activeForm]);

  useEffect(() => {
    emailValueRef.current = enteredEmailValue
  }, [enteredEmailValue])

  const onEmailInputFocus = (e: any) => {
    buttonClickRef.current = false
  }

  const onEmailInputBlur = (e: any) => {}

  const onLoginWithOTPClicked = (e: any) => {
    sendLoginRequest('email')
    setLoginWithOTPEnabled(true)
  }

  const authToken = async (tk: string) => {
    let r = await fetch(`${loginProps.appURL}/api/auth/ls_me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: '*/*',
        authorization: tk,
      },
    })
    if (r && r.status === 200) {
      let k = await r.json()
      console.log('auth::token :: ', k)
      // setInitialized('signed')
      // setAccount(k.account)
      setAccount(k.account);
      setCurrentScreen('logged_in_already')
    } else {
      // initLogin()
      setCurrentScreen('login_form')
      console.log('error')
    }
  }

  useEffect(() => {
    let ck = JSCookie.get('loginsign_')
    if (ck) {
      authToken(ck)
    } else {
      setCurrentScreen('login_form');
    }
  }, [])

  const sendConnectRequest = async (method?: string) => {
    let url = `${loginProps.appURL}/oauth/connect_native?sess_id=${loginProps.sessionId}`
    // let email_val = `${loginProps.email}/${'0'}/${loginWithOTPEnabled ? 'email' : method || 'password'}`
    let email_val = `${loginProps.email}/${'0'}/${activeForm === FormList.Signup ? "signup" : (loginWithOTPEnabled ? 'email' : method || 'password')}`
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email_val,
        passwd: passwordInputRef.current?.value || 'null',
        currentForm: activeForm,
      }),
    }).then(async (response) => {
      let body = await response.json()
      if (response.status === 201) {
        /** new account or new device being created and needs verification */
        /** save a auth cookie too */
        setLoginResponse(body)
      } else if (response.status === 200) {
        /** account get logined */
        /** maybe verification needed if there's no accessToken cookie and if verified set the auth cookie */
        if (body.cookieToken) {
          JSCookie.set('assign_easy_auth', body.cookieToken, {
            expires: 60, // 60 days
          })
        }
        setRedirectParams(body)
      } else if (response.status === 404) {
        console.log('BODY :: ', body)
        if (body.message === 'EMAIL_ALREADY_EXIST') {
          window.alert('Account with this email already exists')
        } else {
          window.alert(body.message || 'Wrong credentials.')
        }
      }
    })
  }

  const sendLoggedInRequest = async () => {
    let url = `${loginProps.appURL}/oauth/native_user?sess_id=${loginProps.sessionId}`
    let ck = JSCookie.get('loginsign_');
    await fetch(url, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        Authorization: ck
      } as any,
      body: JSON.stringify({})
    }).then(async (response) => {
      let body = await response.json()
      if (response.status === 201) {
        /** new account or new device being created and needs verification */
        /** save a auth cookie too */
        setLoginResponse(body)
      } else if (response.status === 200) {

        setCurrentScreen('login_form');
        /** account get logined */
        /** maybe verification needed if there's no accessToken cookie and if verified set the auth cookie */
        if (body.cookieToken) {
          JSCookie.set('assign_easy_auth', body.cookieToken, {
            expires: 60, // 60 days
          })
        }
        setRedirectParams(body)
      } else if (response.status === 404) {
        console.log('BODY :: ', body)
        if (body.message === 'EMAIL_ALREADY_EXIST') {
          window.alert('Account with this email already exists')
        } else {
          window.alert(body.message || 'Wrong credentials.')
        }
      }
    })
  }

  const sendLoginRequest = async (method?: string) => {
    let url = `${loginProps.appURL}/oauth/native?sess_id=${loginProps.sessionId}`
    /** get a auth cookie too */
    // `${}/COOKIE_VAL/CHALLENGE_TYPE`

    let cookie_val = '0'
    if (JSCookie.get('assign_easy_auth')) {
      cookie_val = JSCookie.get('assign_easy_auth') || '0'
    }

    // let email_val = `${emailValueRef.current}/${cookie_val}/${loginWithOTPEnabled ? 'email' : method || 'password'}`
    let email_val = `${emailValueRef.current}/${cookie_val}/${activeForm === FormList.Signup ? "signup" : (loginWithOTPEnabled ? 'email' : method || 'password')}`

    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email_val,
        passwd: passwordInputRef.current?.value || 'null',
        currentForm: activeForm,
      }),
    }).then(async (response) => {
      let body = await response.json()
      if (response.status === 201) {
        /** new account or new device being created and needs verification */
        /** save a auth cookie too */
        setLoginResponse(body)
      } else if (response.status === 200) {
        /** account get logined */
        /** maybe verification needed if there's no accessToken cookie and if verified set the auth cookie */
        if (body.cookieToken) {
          JSCookie.set('assign_easy_auth', body.cookieToken, {
            expires: 60, // 60 days
          })
        }
        setRedirectParams(body)
      } else if (response.status === 404) {
        console.log('BODY :: ', body)
        if (body.message === 'EMAIL_ALREADY_EXIST') {
          // window.alert('Account with this email already exists')
          setError({
            field: "email",
            err: "Email already exists"
          })
        } else {
          setError({
            field: "pwd",
            err: "Wrong password"
          })
          // window.alert(body.message || 'Wrong credentials.')
        }
      }
    })
  }

  useEffect(() => {
    if (loginResponse && loginResponse.request_id) {
      setLoginWithOTPEnabled(true);
      setActiveForm(FormList.OtpCode);
      lastFormRef.current = FormList.OtpCode;
    }
  }, [loginResponse])

  const verifyLoginOtp = async () => {
    let url = `${loginProps.appURL}/oauth/challenge_native?sess_id=${loginProps.sessionId}`
    /** get a auth cookie too */
    try {
      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          request_id: loginResponse.request_id,
          otp_code: emailInputRef.current?.value,
        }),
      })
        .then((response) => {
          console.log('verify login otp :: ', response)
          if (response.status === 200) {
            response.json().then((params) => {
              if (params.cookieToken) {
                JSCookie.set('assign_easy_auth', params.cookieToken, {
                  expires: 60, // 60 days
                })
              }
              setRedirectParams(params)
            })
          } else if (response.status === 400) {
            response.json().then((err) => {
              if (err.message === 'FAILED') {
                window.alert('Wrong otp.')
              } else if (err.message === 'EXPIRED') {
                window.alert(
                  'OTP is expired, please try again by closing this popup.',
                )
              }
            })
          }
        })
        .catch((r) => {
          console.log('error :: ', r)
        })
    } catch (error) {
      console.log('e :: ', error)
    }
  }

  const handleFormSubmit = (form: any, is_retry: boolean = false) => async (e: any) => {
    console.log('CLICKEc :: ', e)
    e.preventDefault()
    if (loginProps.sessionType === 'ConnectApp') {
      await sendConnectRequest()
    } else {
      if (form === FormList.Signup) {
        if (
          passwordInputRef.current?.value !== cfPasswordInputRef.current?.value
        ) {
          // window.alert("Password doesn't match.")
          setError({
            field: 'pwd',
            err: "Password doesn't match."
          })
          return
        }
        if ((emailInputRef.current?.value.length || 0) < 1) {
          return
        }
        if (emailInputRef.current) {
          setEnteredEmailValue(emailInputRef.current.value)
          emailValueRef.current = emailInputRef.current.value
        }
        await sendLoginRequest("signup")
      } else if (form === FormList.PasswordLogin) {
        if ((emailInputRef.current?.value.length || 0) < 1) {
          return
        }
        if (emailInputRef.current) {
          setEnteredEmailValue(emailInputRef.current.value)
          emailValueRef.current = emailInputRef.current.value
        }
        await sendLoginRequest()
      } else if (form === FormList.OtpLogin) {
        if(is_retry) {
          if (emailValueRef.current) {
            setLoginWithOTPEnabled(true)
            await sendLoginRequest('email')  
          }
        }
        else
        {
          if ((emailInputRef.current?.value.length || 0) < 1) {
            return
          }
          if (emailInputRef.current) {
            setEnteredEmailValue(emailInputRef.current.value)
            emailValueRef.current = emailInputRef.current.value
          }
          setLoginWithOTPEnabled(true)
          await sendLoginRequest('email')
        }
      } else if (form === FormList.OtpCode) {
        await verifyLoginOtp()
      }
    }
  }

  const handleSendOtpAndOpenCodeForm = () => {}

  useEffect(() => {
    console.log('LOGIN PROPS :: ', loginProps)
    if (loginProps) {
      // document.documentElement.style.setProperty(
      //   '--app-color',
      //   loginProps.color || '#164C78',
      // )
      // const transparentColor = `${loginProps.color || '#164C78'}C2` // Add transparency using hex format
      // document.documentElement.style.setProperty(
      //   '--app-color-2',
      //   transparentColor,
      // )
      document.documentElement.style.setProperty('--app-color', '#164C78')
      const transparentColor = `${'#164C78'}C2` // Add transparency using hex format
      document.documentElement.style.setProperty(
        '--app-color-2',
        transparentColor,
      )
    }
  }, [loginProps])

  return (
    <>
      {currentScreen === 'login_form' ? (
        <>
          {redirectParams ? (
            <RedirectForm
              selfApp={selfApp}
              loginProps={{
                ...redirectParams,
                name: loginProps.name,
                logo: '/image_login.png' /* || loginProps.logo*/,
                appURL: loginProps.appURL,
                sessionId: loginProps.sessionId,
              }}
            />
          ) : (
            <>
              {loginProps.sessionType === 'ConnectApp' ? (
                <>
                  <div style={style || {}} className="assign-form-container">
                    {showLogo && <Navigation loginProps={loginProps} />}
                    <div className="assign-form-body">
                      {showLogo && (
                        <>
                          {loginProps.sessionType === 'ConnectApp' ? (
                            <div className="assign-form-hdr new">
                              {/* <img src={loginProps.logo || '/static/faqnationlogo.png'} /> */}
                              <div className="img-container">
                                <img
                                  src={
                                    '/image_login.png' /*|| loginProps.logo || '/static/faqnationlogo.png'*/
                                  }
                                />
                              </div>
                              <span className="divider-line">
                                <svg
                                  width={84}
                                  height={4}
                                  viewBox="0 0 84 4"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <line
                                    y1={2}
                                    x2={84}
                                    y2={2}
                                    stroke="#055491"
                                    strokeWidth={4}
                                    strokeDasharray="4 4"
                                  />
                                </svg>
                              </span>
                              <div className="img-container">
                                <a href='https://loginsign.com'><LoginSignLogo /></a>
                              </div>
                              <span className="divider-line">
                                <svg
                                  width={84}
                                  height={4}
                                  viewBox="0 0 84 4"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <line
                                    y1={2}
                                    x2={84}
                                    y2={2}
                                    stroke="#055491"
                                    strokeWidth={4}
                                    strokeDasharray="4 4"
                                  />
                                </svg>
                              </span>
                              <div className="img-container">
                                <img
                                  src={
                                    loginProps.ccLogo ||
                                    '/static/faqnationlogo.png'
                                  }
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="assign-form-hdr new">
                              {/* <img src={loginProps.logo || '/static/faqnationlogo.png'} /> */}
                              <div className="img-container">
                              <a href='https://loginsign.com'><LoginSignLogo /></a>
                              </div>
                              <span className="divider-line">
                                <svg
                                  width={84}
                                  height={4}
                                  viewBox="0 0 84 4"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <line
                                    y1={2}
                                    x2={84}
                                    y2={2}
                                    stroke="#055491"
                                    strokeWidth={4}
                                    strokeDasharray="4 4"
                                  />
                                </svg>
                              </span>
                              <div className="img-container">
                                <img
                                  src={
                                    loginProps.logo ||
                                    '/static/faqnationlogo.png'
                                  }
                                />
                              </div>
                            </div>
                          )}
                        </>
                      )}
                      <div className="assign-form-body">
                        {activeForm === FormList.PasswordLogin ? (
                          <>
                            <form onSubmit={handleFormSubmit(activeForm)}>
                              <div className="inner">
                                {/* <Input
                          ref={emailInputRef}
                          htmlType={'email'}
                          className={'assign-signin-input'}
                          placeholder={'Email'}
                        /> */}
                                <div className="prefilled-input">
                                  <div>
                                    <div>
                                      <img src={loginProps.picture} />
                                    </div>
                                    <div>
                                      <div>
                                        <span>
                                          {loginProps.firstName +
                                            ' ' +
                                            loginProps.lastName}
                                        </span>
                                      </div>
                                      <div>
                                        <span>{loginProps.email}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <Input
                                  ref={passwordInputRef}
                                  htmlType={'password'}
                                  className={'assign-signin-input'}
                                  placeholder={'Password'}
                                />
                                <div
                                  style={{
                                    width: '100%',
                                    maxWidth: '380px',
                                  }}
                                >
                                  <p>{`After connecting, ${loginProps.name} will be able to access your data of ${loginProps.ccName}.`}</p>
                                </div>
                                <Button
                                  className="assign-signin-continue-button"
                                  type={ButtonType.Primary}
                                  label="Connect"
                                  htmlType="submit"
                                />
                              </div>
                            </form>
                            <div>
                              <Button
                                className="assign-signin-continue-button"
                                type={ButtonType.NoBorder}
                                onClick={(e) => handleSendOtpAndOpenCodeForm()}
                                label="Send One-Time Password"
                              />
                            </div>
                          </>
                        ) : activeForm === FormList.OtpCode ? (
                          <>
                            <form onSubmit={handleFormSubmit(activeForm)}>
                              <div className="inner">
                                {/* <div
                          className="assign-form-more-option"
                          style={{ marginBottom: 10, marginTop: 10 }}
                        >
                          <div>{enteredEmailValue}</div>
                        </div> */}
                                <div className="prefilled-input">
                                  <div>
                                    <div>
                                      <img src={loginProps.picture} />
                                    </div>
                                    <div>
                                      <div>
                                        <span>
                                          {loginProps.firstName +
                                            ' ' +
                                            loginProps.lastName}
                                        </span>
                                      </div>
                                      <div>
                                        <span>{loginProps.email}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div
                                  className={
                                    'input-wrapper assign-signin-input'
                                  }
                                >
                                  <div className="input-control">
                                    <input
                                      ref={otpInputRef}
                                      type={'number'}
                                      placeholder={'Code'}
                                      style={{ textAlign: 'left' }}
                                      pattern="\d*" 
                                      maxLength={6}
                                    />
                                  </div>
                                </div>
                                <div
                                  style={{
                                    width: '100%',
                                    maxWidth: '380px',
                                  }}
                                >
                                  <p>{`After connecting, ${loginProps.name} will be able to access your data of ${loginProps.ccName}.`}</p>
                                </div>
                                <Button
                                  className="assign-signin-continue-button"
                                  type={ButtonType.Primary}
                                  htmlType="submit"
                                  label="Verify & Connect"
                                />
                              </div>
                            </form>
                            <div>
                              <Button
                                className="assign-signin-continue-button"
                                type={ButtonType.NoBorder}
                                label="Try with Password"
                                onClick={(e) =>
                                {
                                  setActiveForm(FormList.PasswordLogin);
                                  lastFormRef.current = FormList.PasswordLogin;
                                }
                                }
                              />
                            </div>
                          </>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                    {/* <div className="assign-form-footer">
              <p>
                By continuing you agree our <NavLink text={'Terms'} />.
                <br />
                Secure access protection with LoginSign.
              </p>
            </div> */}
                  </div>
                </>
              ) : loginProps.sessionType === 'OldLogin' ? (
                <>
                  <div style={style || {}} className="assign-form-container">
                    {showLogo && <Navigation loginProps={loginProps} />}
                    <div className="assign-form-body">
                      {showLogo && (
                        <>
                          {loginProps.sessionType === 'ConnectApp' ? (
                            <div className="assign-form-hdr new">
                              {/* <img src={loginProps.logo || '/static/faqnationlogo.png'} /> */}
                              <div className="img-container">
                                <img
                                  src={
                                    loginProps.logo ||
                                    '/static/faqnationlogo.png'
                                  }
                                />
                              </div>
                              <span className="divider-line">
                                <svg
                                  width={84}
                                  height={4}
                                  viewBox="0 0 84 4"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <line
                                    y1={2}
                                    x2={84}
                                    y2={2}
                                    stroke="#055491"
                                    strokeWidth={4}
                                    strokeDasharray="4 4"
                                  />
                                </svg>
                              </span>
                              <div className="img-container">
                                <LoginSignLogo />
                              </div>
                              <span className="divider-line">
                                <svg
                                  width={84}
                                  height={4}
                                  viewBox="0 0 84 4"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <line
                                    y1={2}
                                    x2={84}
                                    y2={2}
                                    stroke="#055491"
                                    strokeWidth={4}
                                    strokeDasharray="4 4"
                                  />
                                </svg>
                              </span>
                              <div className="img-container">
                                <img
                                  src={
                                    loginProps.ccLogo ||
                                    '/static/faqnationlogo.png'
                                  }
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="assign-form-hdr new">
                              {/* <img src={loginProps.logo || '/static/faqnationlogo.png'} /> */}
                              <div className="img-container">
                              <a href='https://loginsign.com'><LoginSignLogo /></a>
                              </div>
                              <span className="divider-line">
                                <svg
                                  width={84}
                                  height={4}
                                  viewBox="0 0 84 4"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <line
                                    y1={2}
                                    x2={84}
                                    y2={2}
                                    stroke="#055491"
                                    strokeWidth={4}
                                    strokeDasharray="4 4"
                                  />
                                </svg>
                              </span>
                              <div className="img-container">
                                <img
                                  src={
                                    loginProps.logo ||
                                    '/static/faqnationlogo.png'
                                  }
                                />
                              </div>
                            </div>
                          )}
                        </>
                      )}
                      <div className="assign-form-body">
                        {activeForm === FormList.PasswordLogin ? (
                          <>
                            <form onSubmit={handleFormSubmit(activeForm)}>
                              <div className="inner">
                                <Input
                                  ref={emailInputRef}
                                  htmlType={'email'}
                                  className={'assign-signin-input'}
                                  placeholder={'Email'}
                                  error={
                                    error.field === 'email'
                                      ? error.err
                                      : null
                                  }
                                />
                                <Input
                                  ref={passwordInputRef}
                                  htmlType={'password'}
                                  className={'assign-signin-input'}
                                  placeholder={'Password'}
                                  error={
                                    error.field === 'password' ||
                                    error.field === 'pwd'
                                      ? error.err
                                      : null
                                  }
                                />
                                <Button
                                  className="assign-signin-continue-button"
                                  type={ButtonType.Primary}
                                  label="Log in"
                                  htmlType="submit"
                                />
                                {/* <div className="assign-form-more-option"> */}
                                  {/* <div>or</div> */}
                                {/* </div> */}
                                <Button
                                  className="assign-signin-continue-button"
                                  type={ButtonType.Secondary}
                                  label="Sign up"
                                  onClick={(e) =>{
                                    setActiveForm(FormList.Signup)
                                    lastFormRef.current = FormList.Signup;
                                  }}
                                />
                              </div>
                            </form>
                            <div>
                              <Button
                                className="assign-signin-continue-button"
                                type={ButtonType.NoBorder}
                                onClick={(e) =>{
                                  setActiveForm(FormList.OtpLogin)
                                  lastFormRef.current = FormList.OtpLogin;
                                }}
                                label="Send One Time Password (OTP)"
                              />
                            </div>
                          </>
                        ) : activeForm === FormList.OtpLogin ? (
                          <>
                            <form onSubmit={handleFormSubmit(activeForm)}>
                              <div className="inner">
                                <Input
                                  ref={emailInputRef}
                                  htmlType={'email'}
                                  className={'assign-signin-input'}
                                  placeholder={'Email'}
                                />
                                <Button
                                  className="assign-signin-continue-button"
                                  type={ButtonType.Primary}
                                  htmlType="submit"
                                  label="Send One Time Password"
                                />
                              </div>
                            </form>
                            <div>
                              <Button
                                className="assign-signin-continue-button"
                                type={ButtonType.NoBorder}
                                label="Log in"
                                onClick={(e) =>{
                                  setActiveForm(FormList.PasswordLogin)
                                  lastFormRef.current = FormList.PasswordLogin;
                                }}
                              />
                            </div>
                          </>
                        ) : activeForm === FormList.OtpCode ? (
                          <>
                            <form onSubmit={handleFormSubmit(activeForm)}>
                              <div className="inner">
                                <div
                                  className="assign-form-more-option email-value"
                                  style={{ marginBottom: 10, marginTop: 10 }}
                                >
                                  <div>{enteredEmailValue}</div>
                                  <span onClick={(e) => {
                                    console.log("X")
                                    if(lastFormRef.current === FormList.Signup){
                                      setActiveForm(FormList.Signup);
                                      lastFormRef.current = FormList.Signup;
                                    }
                                    else
                                    {
                                      setActiveForm(FormList.OtpLogin)
                                      lastFormRef.current = FormList.OtpLogin;
                                    }
                                  }}>
                                  <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="24px"
                                viewBox="0 -960 960 960"
                                width="24px"
                                fill="#7D7978"
                              >
                                <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                              </svg>
                                  </span>
                                </div>
                                <div
                                  className={
                                    'input-wrapper assign-signin-input'
                                  }
                                >
                                  <div className="input-control">
                                    <input
                                      ref={otpInputRef}
                                      type={'number'}
                                      placeholder={'Code'}
                                      style={{ textAlign: 'left' }}
                                      pattern="\d*" 
                                      maxLength={6}
                                    />
                                  </div>
                                </div>
                                <Button
                                  className="assign-signin-continue-button"
                                  type={ButtonType.Primary}
                                  htmlType="submit"
                                  label="Confirm Code"
                                />
                                {/* <div className="assign-form-more-option"> */}
                                  {/* <div>or</div> */}
                                {/* </div> */}
                                <Button
                                  className="assign-signin-continue-button"
                                  type={ButtonType.Secondary}
                                  label="Resend Confirmation Code"
                                  onClick={(e) => {
                                    setLoginResponse(null)
                                    handleFormSubmit(FormList.OtpLogin, true)({preventDefault: () => {}});

                                    // handleFormSubmit({preventDefault: () => {}})(e);
                                    // setActiveForm(FormList.OtpLogin)
                                  }}
                                />
                              </div>
                            </form>
                            <div>
                              <Button
                                className="assign-signin-continue-button"
                                type={ButtonType.NoBorder}
                                label="Back to log in"
                                onClick={(e) =>{
                                  setActiveForm(FormList.PasswordLogin)
                                  lastFormRef.current = FormList.PasswordLogin;
                                }}
                              />
                            </div>
                          </>
                        ) : activeForm === FormList.Signup ? (
                          <>
                            <form onSubmit={handleFormSubmit(activeForm)}>
                              <div className="inner">
                                <Input
                                  ref={emailInputRef}
                                  htmlType={'email'}
                                  className={'assign-signin-input'}
                                  placeholder={'Email'}
                                  error={
                                    error.field === 'email'
                                      ? error.err
                                      : null
                                  }
                                />
                                <Input
                                  ref={passwordInputRef}
                                  htmlType={'password'}
                                  className={'assign-signin-input'}
                                  placeholder={'Password'}
                                  error={
                                    error.field === 'password' ||
                                    error.field === 'pwd'
                                      ? error.err
                                      : null
                                  }
                                />
                                <Input
                                  ref={cfPasswordInputRef}
                                  htmlType={'password'}
                                  className={'assign-signin-input'}
                                  placeholder={'Confirm Password'}
                                  error={
                                    error.field === 'cpassword' ||
                                    error.field === 'cpwd'
                                      ? error.err
                                      : null
                                  }
                                />
                                <Button
                                  className="assign-signin-continue-button"
                                  type={ButtonType.Primary}
                                  htmlType="submit"
                                  label="Sign up"
                                />
                              </div>
                            </form>
                            <div>
                              <Button
                                className="assign-signin-continue-button"
                                type={ButtonType.NoBorder}
                                label="Log in"
                                onClick={(e) =>{
                                  setActiveForm(FormList.PasswordLogin)
                                  lastFormRef.current = FormList.PasswordLogin;
                                }}
                              />
                            </div>
                          </>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                    {/* <div className="assign-form-footer">
              <p>
                By continuing you agree our <NavLink text={'Terms'} />.
                <br />
                Secure access protection with LoginSign.
              </p>
            </div> */}
                  </div>
                </>
              ) : (
                <>
                  <div style={style || {}} className="assign-form-container">
                    {showLogo && <>
                      <div className="assign-navigation">
                        <div className="inner">
                          {/* <NavLink href={loginProps.userAppUrl} text={`Back to ${loginProps.name}`} /> */}
                          <NavLink href={loginProps.userAppUrl} icon={<BackIcon style={{position: 'relative', top: '-1px'}} />} text={`Back`} />
                          {activeForm === FormList.PasswordLogin ? <NavLink onClick={(e: any) =>{
                                  e.preventDefault();
                                  setActiveForm(FormList.OtpLogin)
                                  lastFormRef.current = FormList.OtpLogin;}
                                } text={'One-Time Password'} /> : (activeForm === FormList.OtpLogin) ? (<NavLink onClick={(e: any) =>{
                                  e.preventDefault();
                                  setActiveForm(FormList.PasswordLogin)
                                  lastFormRef.current = FormList.PasswordLogin;}
                                } text={'Use Password'} />) : activeForm === FormList.OtpCode ? (<NavLink onClick={(e: any) =>{
                                  e.preventDefault();
                                  setActiveForm(FormList.OtpCode)
                                  lastFormRef.current = FormList.OtpCode;}
                                } text={'Switch Email'} />) : activeForm === FormList.Signup ? (<NavLink onClick={(e: any) =>{
                                  e.preventDefault();
                                  setActiveForm(FormList.PasswordLogin)
                                  lastFormRef.current = FormList.PasswordLogin;}
                                } text={'Log in'} />) : <></>}
                        </div>
                      </div>
                    </>}
                    <div className="assign-form-body">
                      {showLogo && (
                        <>
                          {(
                            <div className="assign-form-hdr new">
                              <a href='https://loginsign.com'><img style={{height: 80}} width={"auto"} src={'/image_login.png'} /></a>
                            </div>
                          )}
                        </>
                      )}
                      <div className="assign-form-body">
                        {activeForm === FormList.PasswordLogin ? (
                          <>
                          <form onSubmit={handleFormSubmit(activeForm)}>
                              <div className="inner">
                                <Input
                                  ref={emailInputRef}
                                  htmlType={'email'}
                                  className={'assign-signin-input'}
                                  placeholder={'Email'}
                                  error={
                                    error.field === 'email'
                                      ? error.err
                                      : null
                                  }
                                />
                                <Input
                                  ref={passwordInputRef}
                                  htmlType={'password'}
                                  className={'assign-signin-input'}
                                  placeholder={'Password'}
                                  error={
                                    error.field === 'password' ||
                                    error.field === 'pwd'
                                      ? error.err
                                      : null
                                  }
                                />
                                <Button
                                  className="assign-signin-continue-button"
                                  type={ButtonType.Primary}
                                  label="Log in"
                                  htmlType="submit"
                                />
                                {/* <div className="assign-form-more-option">
                                </div> */}
                                <Button
                                  className="assign-signin-continue-button"
                                  type={ButtonType.Secondary}
                                  label="Create New Account"
                                  onClick={(e) =>{
                                    setActiveForm(FormList.Signup)
                                    lastFormRef.current = FormList.Signup;
                                  }}
                                />
                              </div>
                            </form>
                            {/* <div>
                              <Button
                                className="assign-signin-continue-button"
                                type={ButtonType.NoBorder}
                                onClick={(e) =>
                                  setActiveForm(FormList.OtpLogin)
                                }
                                label="Send One Time Password (OTP)"
                              />
                            </div> */}
                          </>
                        ) : activeForm === FormList.OtpLogin ? (
                          <>
                            <form onSubmit={handleFormSubmit(activeForm)}>
                              <div className="inner">
                                <Input
                                  ref={emailInputRef}
                                  htmlType={'email'}
                                  className={'assign-signin-input'}
                                  placeholder={'Email'}
                                />
                                <Button
                                  className="assign-signin-continue-button"
                                  type={ButtonType.Primary}
                                  htmlType="submit"
                                  label="Send One-Time Password"
                                />
                                {/* <div className="assign-form-more-option">
                                </div> */}
                                <Button
                                  className="assign-signin-continue-button"
                                  type={ButtonType.Secondary}
                                  label="Create New Account"
                                  onClick={(e) =>{
                                    setActiveForm(FormList.Signup)
                                    lastFormRef.current = FormList.Signup;
                                  }}
                                />
                              </div>
                            </form>
                            {/* <div>
                              <Button
                                className="assign-signin-continue-button"
                                type={ButtonType.NoBorder}
                                label="Log in"
                                onClick={(e) =>
                                  setActiveForm(FormList.PasswordLogin)
                                }
                              />
                            </div> */}
                          </>
                        ) : activeForm === FormList.OtpCode ? (
                          <>
                            <form onSubmit={handleFormSubmit(activeForm)}>
                              <div className="inner">
                                <div
                                  className="assign-form-more-option email-value"
                                  style={{ marginBottom: 10, marginTop: 10 }}
                                >
                                  <div>{enteredEmailValue}</div>
                                  <span onClick={(e) => {
                                    console.log("X")
                                    if(lastFormRef.current === FormList.Signup){
                                      setActiveForm(FormList.Signup);
                                      lastFormRef.current = FormList.Signup;
                                    }
                                    else
                                    {
                                      setActiveForm(FormList.OtpLogin)
                                      lastFormRef.current = FormList.OtpLogin;
                                    }
                                  }}>
                                  <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="24px"
                                viewBox="0 -960 960 960"
                                width="24px"
                                fill="#7D7978"
                              >
                                <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                              </svg>
                                  </span>
                                </div>
                                <div
                                  className={
                                    'input-wrapper assign-signin-input'
                                  }
                                >
                                  <div className="input-control">
                                    <input
                                      ref={otpInputRef}
                                      type={'number'}
                                      placeholder={'Code'}
                                      style={{ textAlign: 'left' }}
                                      pattern="\d*" 
                                      maxLength={6}
                                    />
                                  </div>
                                </div>
                                <Button
                                  className="assign-signin-continue-button"
                                  type={ButtonType.Primary}
                                  htmlType="submit"
                                  label="Confirm Code"
                                />
                                {/* <div className="assign-form-more-option"> */}
                                  {/* <div>or</div> */}
                                {/* </div> */}
                                <Button
                                  className="assign-signin-continue-button"
                                  type={ButtonType.Secondary}
                                  // label="Change email"
                                  label="Resend Confirmation Code"
                                  onClick={(e) => {
                                    setLoginResponse(null)
                                    handleFormSubmit(FormList.OtpCode, false)({preventDefault: () => {}});
                                    // handleFormSubmit(activeForm)({preventDefault: () => {}});
                                    // handleFormSubmit({preventDefault: () => {}})(activeForm);
                                    // setActiveForm(FormList.OtpLogin)
                                  }}
                                />
                              </div>
                            </form>
                            {/* <div>
                              <Button
                                className="assign-signin-continue-button"
                                type={ButtonType.NoBorder}
                                label="Back to log in"
                                onClick={(e) =>
                                  setActiveForm(FormList.PasswordLogin)
                                }
                              />
                            </div> */}
                          </>
                        ) : activeForm === FormList.Signup ? (
                          <>
                            <form onSubmit={handleFormSubmit(activeForm)}>
                              <div className="inner">
                                <Input
                                  ref={emailInputRef}
                                  htmlType={'email'}
                                  className={'assign-signin-input'}
                                  placeholder={'Email'}
                                />
                                <Input
                                  ref={passwordInputRef}
                                  htmlType={'password'}
                                  className={'assign-signin-input'}
                                  placeholder={'Password'}
                                />
                                <Input
                                  ref={cfPasswordInputRef}
                                  htmlType={'password'}
                                  className={'assign-signin-input'}
                                  placeholder={'Confirm Password'}
                                />
                                <Button
                                  className="assign-signin-continue-button"
                                  type={ButtonType.Primary}
                                  htmlType="submit"
                                  label="Create New Account"
                                />
                                {/* <div className="assign-form-more-option">
                                </div> */}
                                <Button
                                  className="assign-signin-continue-button"
                                  type={ButtonType.Secondary}
                                  label="Cancel Registration"
                                  onClick={(e) =>
                                  {
                                    if(emailInputRef.current) {
                                      emailInputRef.current.value = '';
                                    }
                                    if(passwordInputRef.current) {
                                      passwordInputRef.current.value = '';
                                    }
                                    if(cfPasswordInputRef.current) {
                                      cfPasswordInputRef.current.value = '';
                                    }
                                    setActiveForm(FormList.PasswordLogin)
                                    lastFormRef.current = FormList.PasswordLogin;
                                  }
                                  }
                                />
                              </div>
                            </form>
                            {/* <div>
                              <Button
                                className="assign-signin-continue-button"
                                type={ButtonType.NoBorder}
                                label="Log in"
                                onClick={(e) =>
                                  setActiveForm(FormList.PasswordLogin)
                                }
                              />
                            </div> */}
                          </>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                    {/* <div className="assign-form-footer">
              <p>
                By continuing you agree our <NavLink text={'Terms'} />.
                <br />
                Secure access protection with LoginSign.
              </p>
            </div> */}
                  </div>
                </>
              )}
            </>
          )}
        </>
      ) : currentScreen === 'logged_in_already' ? (
        <>
          {account && <div className="assign-form-container">
            <div className="assign-navigation">
                        <div className="inner">
                          <NavLink href={loginProps.userAppUrl} icon={<BackIcon style={{position: 'relative', top: '-1px'}} />} text={`Back`} />
                          <NavLink href={"https://loginsign.com"} text={`Account`} />
                          {/* <NavLink href={loginProps.userAppUrl} text={`Back to ${loginProps.name}`} /> */}
                          {/* {activeForm === FormList.PasswordLogin ? <NavLink onClick={(e: any) =>{
                                  e.preventDefault();
                                  setActiveForm(FormList.OtpLogin)}
                                } text={'Forgot Password?'} /> : (activeForm === FormList.Signup || activeForm === FormList.OtpLogin || activeForm === FormList.OtpCode) ? (<NavLink onClick={(e: any) =>{
                                  e.preventDefault();
                                  setActiveForm(FormList.PasswordLogin)}
                                } text={'Log in'} />) : <></>} */}
                                {/* <span></span> */}
                        </div>
                      </div>
            <div className='ad-form-logo'>
              <img height={80} src="/image_login.png" />
            </div>
            <div className='ad-form-links'>
              <div className='ad-form-ac' onClick={sendLoggedInRequest}>
                <div className='inner'>
                  <div className='pic'>
                    {/* <img height={40} src={account.picture
                            ? `/p/${account.picture}`
                            : '/account.png'} /> */}
                            <div
                                  style={{
                                    backgroundImage: `url(${
                                      account.picture
                                        ? `/p/${account.picture}`
                                        : '/account.png'
                                    })`,
                                  }}
                                  className="fake-avatar"
                                ></div>
                  </div>
                  <div className='name'>
                    <BodyText>{account.firstName ? `${account.firstName} ${account.familyName}` : account.connections[0].providerUsername}</BodyText>
                  </div>
                </div>
              </div>
              {/* <div className='ad-form-ac' onClick={(e) => setCurrentScreen("login_form")}>
                <div className='inner'>
                  <div className='pic'>
                    <img height={40} src={'/account.png'} />
                  </div>
                  <div className='name'>
                    <BodyText>{'Use another account'}</BodyText>
                  </div>
                </div>
              </div> */}
              <Button
                  onClick={(e) => setCurrentScreen("login_form")}
                  className="assign-signin-continue-button"
                  type={ButtonType.Secondary}
                  label="Login with Another Account"
                  htmlType="button"
                />
            </div>
          </div>}
        </>
      ) : (
        <>
          <div className="assign-form-container">
            <div className="loading-view">
              <div className="loader"></div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default LoginForm
