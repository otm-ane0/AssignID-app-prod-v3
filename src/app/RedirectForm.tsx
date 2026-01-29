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

function RedirectForm({
  selfApp = false,
  loginProps,
}: {
  selfApp?: boolean
  loginProps: any
}) {
  const getTokenAndLogin = async (
    actoken: string,
    session: string,
    is_popup: boolean,
  ) => {
    let t = (actoken || '').split('|')
    let r = await fetch(`${loginProps.appURL}/api/auth/get_accss_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: '*/*',
      },
      body: JSON.stringify({
        authcode: t[0],
        sessionId: loginProps.sessionId,
      }),
    })
    if (r && r.status === 200) {
      let k = await r.json()
      await JSCookie.set('loginsign_', k.token)
      // setTimeout(() => {
      //   window.location.href = '/';
      // }, 1000);
      // setTimeout(() => {
      //   window.close()
      // }, 2000)
      if (is_popup) {
        // setTimeout(() => {
        //   window.close()
        // }, 2000)
        if (loginProps) {
          console.log('LOGINNNNN PROPS :: ', loginProps)
          if (loginProps.name.toLowerCase().includes('shortkey')) {
            console.log('NAB :: SHORTKEY')
            window.location.href = `https://shortkey.org/auth?token=${loginProps.accessToken}`
          }
          else if (loginProps.name.toLowerCase().includes('bookmarker')) {
            console.log('NAB :: BOOKMARKER')
            // window.location.href = `http://localhost:3000/applogin?autht=${loginProps.accessToken}`
            window.location.href = `https://bookmarker.me/applogin?autht=${loginProps.accessToken}`
          } else {
            console.log('NAB :: NOTES')
            // window.location.href = `https://notes.bookmarker.me/auth?secure_tk=${loginProps.accessToken}&secure_rf=${loginProps.accessToken}`
            window.location.href = `https://notes.bookmer.com/auth?secure_tk=${loginProps.accessToken}&secure_rf=${loginProps.accessToken}`

            // window.location.href = `https://notes.bookmarker.me/auth?token=${loginProps.accessToken}`;
          }
        }
      } else {
        setTimeout(() => {
          window.location.href = '/'
        }, 1000)
      }
    } else {
      console.log('error')
    }
  }

  useEffect(() => {
    if (selfApp) {
      if (loginProps) {
        getTokenAndLogin(
          loginProps.accessToken,
          loginProps.sessionSecret,
          false,
        )
        // JSCookie.set('assign_', )
        return
      }
    } else {
      if (loginProps) {
        getTokenAndLogin(loginProps.accessToken, loginProps.sessionSecret, true)
      }
    }

    /** @TODO redirect to app auth url provided while creating the app., update database for it. */
    // window.location.href = `http://localhost:3000/auth?secret=${loginProps.accessToken}`;

    /** FOR NOW */
    // if(loginProps) {
    //   console.log("LOGINNNNN PROPS :: ", loginProps)
    //   if(loginProps.name.toLowerCase().includes("shortkey")) {
    //     console.log("NAB :: SHORTKEY")
    //     // window.location.href = `https://shortkey.org/auth?token=${loginProps.accessToken}`;
    //   }
    //   else {
    //     console.log("NAB :: NOTES")
    //     // window.location.href = `https://notes.bookmarker.me/auth?secure_tk=${loginProps.accessToken}&secure_rf=${loginProps.accessToken}`;
    //     // window.location.href = `https://notes.bookmarker.me/auth?token=${loginProps.accessToken}`;
    //   }
    // }

    // setInterval(() => {
    //   window.opener.postMessage(
    //     {
    //       sess_secret: loginProps.sessionSecret,
    //       sess_status: loginProps.sessionStatus,
    //       access_token: loginProps.accessToken,
    //     },
    //     '*',
    //   )
    // }, 600)
    // setTimeout(() => {
    //   window.close()
    // }, 2000)
  }, [])

  return (
    <div className="assign-form-container">
      {/* <Navigation />
      <div className="assign-form-body">
        <div className="assign-form-hdr">
          <img src={loginProps.logo || '/static/faqnationlogo.png'} />
        </div>
        <div className="assign-form-body">
          <h1>A moment please...</h1>
        </div>
      </div>
      <div className="assign-form-footer">
        <p>
          By continuing you agree our <NavLink text={'Terms'} />.
          <br />
          Secure access protection with AssignKey.
        </p>
      </div> */}
      <div className="loading-view">
        <div className="loader"></div>
      </div>
    </div>
  )
}

export default RedirectForm
