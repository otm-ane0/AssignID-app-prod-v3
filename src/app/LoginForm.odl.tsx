'use client'

import BackIcon from './icons/Back'
import GoogleIcon from './icons/Google'
import AppleIcon from './icons/Apple'
import EmailIcon from './icons/Email'
import { useEffect, useRef, useState } from 'react'
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

const NavLink = ({ icon, text }: any) => {
  return (
    <a href="#" className="navigation-link">
      {icon && <span>{icon}</span>}
      {text && <span>{text}</span>}
    </a>
  )
}

const Navigation = () => {
  return (
    <div className="assign-navigation">
      <div className="inner">
        <NavLink icon={<BackIcon />} text={'Home'} />
        <NavLink text={'Need help?'} />
      </div>
    </div>
  )
}

function LoginForm({ loginProps }: { loginProps: any }) {
  const emailInputRef = useRef<HTMLInputElement | null>(null)
  const buttonClickRef = useRef(false)
  const buttonContinueRef = useRef<HTMLDivElement | null>(null)
  const [loginWithEmailActivated, setLoginWithEmailActivated] = useState(false)
  const [enteredEmailValue, setEnteredEmailValue] = useState<string | null>(
    null,
  )
  const [loginWithOTPEnabled, setLoginWithOTPEnabled] = useState(false)
  const [loginResponse, setLoginResponse] = useState<any>(null)
  const [moreOptionsActivated, setMoreOptionsActivated] = useState(false)
  const [redirectParams, setRedirectParams] = useState<any>(null)
  const onLoginWithEmailClicked = (e: any) => {
    setLoginWithEmailActivated(true)
  }

  const onEmailInputFocus = (e: any) => {
    buttonClickRef.current = false
  }

  const onEmailInputBlur = (e: any) => {}

  const onLoginWithOTPClicked = (e: any) => {
    sendLoginRequest('email')
    setLoginWithOTPEnabled(true)
  }

  const sendLoginRequest = async (method?: string) => {
    let url = `${loginProps.appURL}/oauth/native?sess_id=${loginProps.sessionId}`
    /** get a auth cookie too */
    // `${}/COOKIE_VAL/CHALLENGE_TYPE`

    let cookie_val = '0'
    if (JSCookie.get('assign_easy_auth')) {
      cookie_val = JSCookie.get('assign_easy_auth') || '0'
    }

    let email_val = `${enteredEmailValue}/${cookie_val}/${loginWithOTPEnabled ? 'email' : method || 'password'}`

    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email_val,
        passwd: emailInputRef.current?.value || 'null',
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
        window.alert('Wrong credentials.')
      }
    })
  }

  useEffect(() => {
    if (loginResponse && loginResponse.request_id) {
      setLoginWithOTPEnabled(true)
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

  // useEffect(() => {
  //   if (redirectParams) {
  //     setInterval(() => {
  //       window.opener.postMessage(
  //         {
  //           sess_secret: redirectParams.sessionSecret,
  //           sess_status: redirectParams.sessionStatus,
  //           access_token: redirectParams.accessToken,
  //         },
  //         '*',
  //       )
  //     }, 600)
  //     setTimeout(() => {
  //       window.close()
  //     }, 2000)
  //   }
  // }, [redirectParams])

  const onContinueButtonClick = (e: any) => {
    if (enteredEmailValue) {
      console.log('start registering...')
      if (loginWithOTPEnabled) {
        /** check for otp */
        verifyLoginOtp()
      } else {
        sendLoginRequest()
      }
    } else {
      buttonClickRef.current = true
      if (
        emailInputRef.current &&
        emailInputRef.current.value &&
        emailInputRef.current.value.length > 0
      ) {
        setEnteredEmailValue(emailInputRef.current.value)
      }
    }
  }

  useEffect(() => {
    if (enteredEmailValue) {
      if (emailInputRef.current) {
        emailInputRef.current.focus()
      }
    }
  }, [enteredEmailValue])

  useEffect(() => {
    if (loginWithOTPEnabled) {
      if (emailInputRef.current) {
        emailInputRef.current.value = ''
        emailInputRef.current.focus()
      }
    }
  }, [loginWithOTPEnabled])

  useEffect(() => {
    if (loginWithEmailActivated) {
      if (emailInputRef.current) {
        emailInputRef.current.focus()
      }
    } else {
      setEnteredEmailValue(null)
    }

    let clickListener = (e: any) => {
      if (
        (e.target as HTMLElement).parentElement?.classList.contains(
          'assign-signin-continue-button',
        )
      ) {
        // console.log('continue button')
      } else {
        if (
          (e.target as HTMLElement).parentElement?.classList.contains(
            'assign-signin-button',
          )
        ) {
          //   console.log('signin button')
        } else {
          //   console.log('not signin button')
          if ((e.target as HTMLElement).tagName === 'INPUT') {
            // console.log('signin input')
          } else {
            if (loginWithEmailActivated) {
              setLoginWithEmailActivated(false)
              setLoginWithOTPEnabled(false)
            }
          }
        }
      }
    }
    document.body.addEventListener('click', clickListener)
    return () => {
      document.body.removeEventListener('click', clickListener)
    }
  }, [loginWithEmailActivated])

  const handleOnLoginWithGoogle = (e: any) => {
    window.location.href = `${loginProps.appURL}/oauth/google?sess_id=${loginProps.sessionId}`
  }

  const handleOnLoginWithFacebook = (e: any) => {
    window.location.href = `${loginProps.appURL}/oauth/google?sess_id=${loginProps.sessionId}`
  }

  const handleOnLoginWithX = (e: any) => {
    window.location.href = `${loginProps.appURL}/oauth/google?sess_id=${loginProps.sessionId}`
  }

  return (
    <>
      {redirectParams ? (
        <RedirectForm loginProps={{
          ...redirectParams,
          logo: loginProps.logo
        }} />
      ) : (
        <>
          <div className="assign-form-container">
            <Navigation />
            <div className="assign-form-body">
              <div className="assign-form-hdr">
                <img src={loginProps.logo || '/static/faqnationlogo.png'} />
              </div>
              <div className="assign-form-body">
                {enteredEmailValue ? (
                  <></>
                ) : (
                  <>
                    <Button
                      className="assign-signin-button"
                      type={ButtonType.Secondary}
                      icon={<GoogleIcon />}
                      label="Sign in with Google"
                      onClick={handleOnLoginWithGoogle}
                    />
                    <Button
                      className="assign-signin-button"
                      type={ButtonType.Secondary}
                      icon={<AppleIcon style={{ marginRight: 4 }} />}
                      label="Sign in with Apple"
                    />
                  </>
                )}
                <>
                  {loginWithEmailActivated ? (
                    <>
                      {enteredEmailValue ? (
                        <>
                          <div>
                            <BodyText>{enteredEmailValue}</BodyText>
                          </div>
                          <Input
                            ref={emailInputRef}
                            htmlType={loginWithOTPEnabled ? 'text' : 'password'}
                            className={'assign-signin-input'}
                            placeholder={
                              loginWithOTPEnabled
                                ? 'Enter one time passphrase'
                                : 'Password'
                            }
                            onBlur={onEmailInputBlur}
                            onFocus={onEmailInputFocus}
                          />
                        </>
                      ) : (
                        <Input
                          ref={emailInputRef}
                          htmlType="email"
                          className={'assign-signin-input'}
                          placeholder="Sign in with Email"
                          onBlur={onEmailInputBlur}
                          onFocus={onEmailInputFocus}
                        />
                      )}
                    </>
                  ) : (
                    <Button
                      className="assign-signin-button"
                      type={ButtonType.Secondary}
                      icon={<EmailIcon style={{ marginRight: 3 }} />}
                      label="Sign in with Email"
                      onClick={onLoginWithEmailClicked}
                    />
                  )}
                  {loginWithEmailActivated ? (
                    <>
                      <Button
                        className="assign-signin-continue-button"
                        type={ButtonType.Primary}
                        onClick={onContinueButtonClick}
                        label="Continue"
                      />
                      {enteredEmailValue && !loginWithOTPEnabled && (
                        <Button
                          className="assign-signin-continue-button"
                          type={ButtonType.NoBorder}
                          onClick={onLoginWithOTPClicked}
                          label="Login with Email verification"
                        />
                      )}
                    </>
                  ) : (
                    <>
                      {moreOptionsActivated ? (
                        <>
                          <div className="assign-form-more-option">
                            <div>Sign in with</div>
                            <div>
                              <Button
                                onClick={handleOnLoginWithFacebook}
                                className="assign-more-login-option"
                                icon={<FacebookIcon />}
                              />
                              <Button
                                onClick={handleOnLoginWithX}
                                className="assign-more-login-option"
                                icon={<XIcon />}
                              />
                              <Button
                                className="assign-more-login-option"
                                icon={<MicrosoftIcon />}
                              />
                              <Button
                                className="assign-more-login-option"
                                icon={<GithubIcon />}
                              />
                            </div>
                          </div>
                        </>
                      ) : (
                        <Button
                          onClick={(e) => setMoreOptionsActivated(true)}
                          type={ButtonType.NoBorder}
                          label="More Options"
                        />
                      )}
                    </>
                  )}
                </>
              </div>
            </div>
            <div className="assign-form-footer">
              <p>
                By continuing you agree our <NavLink text={'Terms'} />.
                <br />
                Secure access protection with AssignKey.
              </p>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default LoginForm
