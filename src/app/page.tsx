'use client'

import React, { useEffect, useRef, useState } from 'react'
import LoginForm, { LoginSignLogo } from './LoginForm'
import RedirectForm from './RedirectForm'
import AssignSession from 'assign-login'
import { SessionType } from 'assign-login/dist/lib/requestSession'
import JSCookie from 'js-cookie'
import Button, { ButtonType } from './components/Button'
import Input from './components/Input'
import { useOnClickOutside } from './hooks/useOnClickOutside'
import { BodyText } from './components/Text'
import Account from './components/account'
import AccountPage from './components/account_page'
import { CtxMenu } from './components/CtxMenu'
import { CtxMenuItem } from './components/CtxMenuItem'
import { Popup } from './components/Popup'
import { DashboardHeader } from './components/DashboardHeader'

const NavLink = ({ icon, text, onClick, href }: any) => {
  return (
    <a href={href || '#'} onClick={onClick} className="navigation-link">
      {icon && <span>{icon}</span>}
      {text && <span>{text}</span>}
    </a>
  )
}

const Switch = ({ defaultValue = false, onChange }: any) => {
  const [isOn, setIsOn] = useState<boolean>(defaultValue)

  const toggleSwitch = () => {
    setIsOn((prevState) => !prevState)
  }

  useEffect(() => {
    if (onChange) {
      onChange(isOn) // Send the updated state whenever it changes
    }
  }, [isOn])

  return (
    <label className="switch">
      <input type="checkbox" checked={isOn} onChange={toggleSwitch} />
      <span className="slider" />
    </label>
  )
}

const Checkbox = ({ defaultValue = false, onChange, label }: any) => {
  const [isChecked, setIsChecked] = useState<boolean>(defaultValue)

  const handleCheckboxChange = () => {
    setIsChecked((prev) => !prev)
  }

  useEffect(() => {
    if (onChange) {
      onChange(isChecked) // Return the current state when checkbox is toggled
    }
  }, [isChecked])

  return (
    <label className="styled-checkbox">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleCheckboxChange}
      />
      <span className="checkmark"></span>
      {label && <span className="label">{label}</span>}
    </label>
  )
}

const LsignLandingLogo = (props: any) => {
  return (
    <svg
      width={326}
      height={129}
      viewBox="0 0 326 129"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M9.24383 87V42.9058H16.9288V79.315H35.2909V87H9.24383ZM53.4906 87.8189C50.593 87.8189 47.9473 87.0735 45.5536 85.5827C43.1809 84.0919 41.2807 82.0971 39.8529 79.5985C38.4461 77.0788 37.7427 74.2967 37.7427 71.2521C37.7427 68.9424 38.1521 66.7902 38.971 64.7954C39.7899 62.7797 40.9132 61.0159 42.3411 59.5041C43.7899 57.9713 45.4696 56.7745 47.3804 55.9136C49.2911 55.0527 51.3279 54.6223 53.4906 54.6223C56.3882 54.6223 59.0234 55.3677 61.396 56.8585C63.7897 58.3493 65.69 60.3545 67.0968 62.8742C68.5246 65.3938 69.2385 68.1865 69.2385 71.2521C69.2385 73.5408 68.8291 75.6825 68.0102 77.6772C67.1913 79.672 66.0574 81.4357 64.6086 82.9685C63.1808 84.4803 61.5115 85.6667 59.6008 86.5276C57.711 87.3884 55.6743 87.8189 53.4906 87.8189ZM53.4906 80.1339C55.0234 80.1339 56.3987 79.7245 57.6165 78.9056C58.8344 78.0867 59.7898 77.0053 60.4827 75.6615C61.1966 74.3177 61.5535 72.8479 61.5535 71.2521C61.5535 69.6143 61.1861 68.1235 60.4512 66.7797C59.7373 65.4148 58.7609 64.3335 57.5221 63.5356C56.3042 62.7167 54.9604 62.3072 53.4906 62.3072C51.9788 62.3072 50.614 62.7167 49.3961 63.5356C48.1783 64.3545 47.2124 65.4463 46.4985 66.8112C45.7846 68.176 45.4276 69.6563 45.4276 71.2521C45.4276 72.9109 45.7951 74.4122 46.53 75.756C47.2649 77.0998 48.2413 78.1707 49.4591 78.9686C50.698 79.7455 52.0418 80.1339 53.4906 80.1339ZM97.6355 55.5041H105.32V87.5984C105.32 89.8661 104.859 91.9239 103.935 93.7716C103.011 95.6404 101.751 97.2362 100.155 98.559C98.5593 99.9028 96.7326 100.932 94.6749 101.646C92.6171 102.38 90.4544 102.748 88.1867 102.748C85.982 102.748 83.8613 102.296 81.8245 101.394C79.7878 100.491 77.9821 99.2519 76.4073 97.6771C74.8535 96.1233 73.6671 94.349 72.8482 92.3543L79.8718 89.1732C80.2917 90.3281 80.9217 91.3359 81.7616 92.1968C82.6224 93.0787 83.6093 93.7611 84.7222 94.244C85.835 94.748 86.9899 94.9999 88.1867 94.9999C89.4045 94.9999 90.5699 94.832 91.6828 94.496C92.8166 94.1601 93.835 93.6666 94.7378 93.0157C95.6407 92.3858 96.3441 91.6089 96.8481 90.685C97.373 89.7821 97.6355 88.7533 97.6355 87.5984V83.1575C96.6486 84.5433 95.4098 85.6667 93.919 86.5276C92.4282 87.3884 90.7064 87.8189 88.7536 87.8189C86.4859 87.8189 84.3652 87.3884 82.3915 86.5276C80.4177 85.6667 78.675 84.4803 77.1632 82.9685C75.6724 81.4357 74.4965 79.672 73.6356 77.6772C72.7957 75.6825 72.3758 73.5408 72.3758 71.2521C72.3758 68.9634 72.7957 66.8217 73.6356 64.8269C74.4965 62.8322 75.6724 61.0789 77.1632 59.5671C78.675 58.0343 80.4177 56.8375 82.3915 55.9766C84.3652 55.1157 86.4859 54.6853 88.7536 54.6853C90.7064 54.6853 92.4282 55.1157 93.919 55.9766C95.4098 56.8165 96.6486 57.9293 97.6355 59.3151V55.5041ZM88.8481 80.4174C90.4649 80.4174 91.8927 80.0079 93.1316 79.189C94.3914 78.3491 95.3783 77.2363 96.0922 75.8505C96.8061 74.4437 97.163 72.9109 97.163 71.2521C97.163 69.5723 96.7956 68.0395 96.0607 66.6537C95.3468 65.2679 94.3599 64.155 93.1001 63.3151C91.8612 62.4752 90.4439 62.0553 88.8481 62.0553C87.2733 62.0553 85.835 62.4752 84.5332 63.3151C83.2314 64.134 82.192 65.2364 81.4151 66.6222C80.6382 68.008 80.2498 69.5513 80.2498 71.2521C80.2498 72.9528 80.6382 74.4961 81.4151 75.882C82.192 77.2678 83.2314 78.3701 84.5332 79.189C85.835 80.0079 87.2733 80.4174 88.8481 80.4174ZM112.159 55.5041H119.844V87H112.159V55.5041ZM116.064 51.4412C114.931 51.4412 113.975 51.0737 113.198 50.3388C112.421 49.5829 112.033 48.638 112.033 47.5042C112.033 46.3913 112.421 45.457 113.198 44.7011C113.975 43.9452 114.92 43.5672 116.033 43.5672C117.146 43.5672 118.08 43.9452 118.836 44.7011C119.613 45.457 120.001 46.3913 120.001 47.5042C120.001 48.638 119.624 49.5829 118.868 50.3388C118.112 51.0737 117.177 51.4412 116.064 51.4412ZM156.019 67.0946V87H148.334V69.1104C148.334 67.8715 148.029 66.7482 147.421 65.7403C146.812 64.7114 145.993 63.903 144.964 63.3151C143.956 62.7062 142.833 62.4017 141.594 62.4017C140.355 62.4017 139.221 62.7062 138.192 63.3151C137.184 63.903 136.376 64.7114 135.767 65.7403C135.179 66.7482 134.885 67.8715 134.885 69.1104V87H127.2L127.169 55.5041H134.854L134.885 58.3073C135.956 57.1734 137.237 56.281 138.728 55.6301C140.219 54.9582 141.825 54.6223 143.547 54.6223C145.835 54.6223 147.925 55.1892 149.814 56.323C151.704 57.4359 153.205 58.9372 154.318 60.8269C155.452 62.6957 156.019 64.7849 156.019 67.0946Z"
        fill="#0E273D"
      />
      <path
        d="M223.82 29.0139C223.849 29.0717 223.907 29.2163 223.994 29.4476C224.08 29.65 224.167 29.8957 224.254 30.1849C224.34 30.4451 224.413 30.7198 224.471 31.0089C224.557 31.2691 224.601 31.4571 224.601 31.5727C224.601 32.5558 224.398 33.7412 223.994 35.1291C223.589 36.488 223.025 37.9337 222.302 39.4661C221.608 40.9985 220.784 42.5599 219.83 44.1501C218.876 45.7404 217.864 47.2583 216.794 48.704C215.724 50.1208 214.611 51.4219 213.455 52.6073C212.327 53.7639 211.214 54.6891 210.115 55.383C209.71 55.0072 209.219 54.559 208.64 54.0386C208.091 53.5181 207.498 52.9688 206.862 52.3905C206.226 51.7833 205.59 51.1761 204.954 50.5689C204.318 49.9617 203.725 49.369 203.176 48.7907C204.014 48.1257 204.954 47.2583 205.995 46.1885C207.065 45.0898 208.134 43.8754 209.204 42.5454C210.303 41.2154 211.373 39.842 212.414 38.4252C213.455 37.0085 214.351 35.6495 215.103 34.3484C215.883 33.0184 216.49 31.8185 216.924 30.7487C217.358 29.6789 217.517 28.8259 217.401 28.1898C217.314 27.8718 217.17 27.6549 216.968 27.5393C216.794 27.3947 216.462 27.3224 215.97 27.3224C214.206 27.3224 212.168 27.6694 209.855 28.3633C207.542 29.0573 205.127 30.0692 202.612 31.3992C200.096 32.7004 197.552 34.3051 194.979 36.2134C192.434 38.1216 190.035 40.2757 187.779 42.6755C185.553 45.0754 183.558 47.7065 181.794 50.5689C180.059 53.4314 178.729 56.4818 177.804 59.7201C179.828 59.6912 181.751 59.6189 183.572 59.5032C185.394 59.3586 187.129 59.2141 188.777 59.0695C190.425 58.9249 192.001 58.7948 193.504 58.6792C195.008 58.5635 196.468 58.5057 197.885 58.5057C198.636 58.5057 199.446 58.9105 200.313 59.7201C201.181 60.5296 201.99 61.4983 202.742 62.6259C203.494 63.7535 204.115 64.91 204.607 66.0955C205.099 67.281 205.344 68.2351 205.344 68.9579C205.344 71.0108 204.809 73.0781 203.74 75.1599C202.699 77.2128 201.282 79.2078 199.489 81.145C197.726 83.0533 195.673 84.8459 193.331 86.5229C190.989 88.171 188.517 89.6022 185.914 90.8166C183.341 92.0599 180.71 93.0285 178.021 93.7224C175.332 94.4452 172.773 94.8067 170.344 94.8067C170.026 94.5464 169.607 94.1416 169.087 93.5923C168.566 93.0718 168.002 92.4791 167.395 91.8141C166.817 91.178 166.21 90.4985 165.574 89.7757C164.967 89.0529 164.403 88.3589 163.882 87.6939C163.333 87.0289 162.856 86.4217 162.451 85.8724C162.046 85.323 161.772 84.9038 161.627 84.6146C163.217 84.8459 165.126 84.9038 167.352 84.7881C169.607 84.6725 171.978 84.3544 174.465 83.834C176.951 83.3135 179.452 82.5762 181.968 81.6221C184.512 80.639 186.883 79.4102 189.08 77.9356C191.278 76.461 193.215 74.7117 194.892 72.6878C196.569 70.6349 197.783 68.264 198.535 65.5751C196.858 65.604 195.34 65.6907 193.981 65.8353C192.622 65.9509 191.307 66.0955 190.035 66.269C188.762 66.4136 187.461 66.5437 186.131 66.6593C184.801 66.775 183.327 66.8328 181.707 66.8328C181.187 66.8328 180.623 66.8328 180.016 66.8328C179.409 66.8039 178.802 66.7605 178.194 66.7027C177.587 66.6159 177.009 66.4858 176.46 66.3124C175.91 66.1389 175.462 65.8931 175.115 65.5751C174.335 64.91 173.583 64.2161 172.86 63.4933C172.137 62.7415 171.487 61.9898 170.908 61.238C170.33 60.4574 169.867 59.6767 169.52 58.896C169.173 58.1154 169 57.3636 169 56.6408C169 54.4433 169.549 52.0002 170.648 49.3112C171.747 46.5933 173.265 43.861 175.202 41.1142C177.168 38.3674 179.481 35.7074 182.141 33.1341C184.801 30.5318 187.693 28.2188 190.815 26.1948C193.967 24.1709 197.277 22.5517 200.747 21.3373C204.217 20.123 207.73 19.5158 211.286 19.5158C212.529 19.5158 213.657 19.7037 214.669 20.0796C215.71 20.4555 216.649 20.947 217.488 21.5542C218.326 22.1614 219.078 22.8408 219.743 23.5926C220.408 24.3154 221.001 25.0238 221.521 25.7177C222.042 26.4117 222.49 27.0622 222.866 27.6694C223.242 28.2477 223.56 28.6958 223.82 29.0139ZM222.47 89.3854C222.037 89.3854 221.487 89.2263 220.822 88.9083C220.157 88.6192 219.521 88.2433 218.914 87.7807C218.307 87.347 217.786 86.8554 217.353 86.3061C216.919 85.7567 216.702 85.2218 216.702 84.7014C216.991 83.4292 217.382 81.969 217.873 80.321C218.365 78.6729 218.9 76.9959 219.478 75.29C220.027 73.5841 220.62 71.9216 221.256 70.3024C221.863 68.6544 222.413 67.1942 222.904 65.922C223.424 64.6498 223.873 63.6234 224.249 62.8427C224.624 62.0621 224.87 61.6717 224.986 61.6717C225.159 61.6717 225.593 61.8597 226.287 62.2355C226.981 62.6114 227.704 63.074 228.455 63.6234C229.236 64.1438 229.93 64.7077 230.537 65.3148C231.144 65.8931 231.448 66.3991 231.448 66.8328C231.448 66.9195 231.434 67.0352 231.405 67.1798C231.376 67.2954 231.332 67.4544 231.275 67.6568C231.043 68.3797 230.74 69.2326 230.364 70.2157C230.017 71.1987 229.641 72.2252 229.236 73.295C228.831 74.3359 228.427 75.3912 228.022 76.461C227.617 77.5019 227.256 78.485 226.937 79.4102C226.619 80.3354 226.359 81.145 226.157 81.8389C225.954 82.5329 225.853 83.0388 225.853 83.3569C225.853 83.5304 225.94 83.6171 226.113 83.6171C226.432 83.6171 226.909 83.4292 227.545 83.0533C228.181 82.6774 228.904 82.1859 229.713 81.5787C230.552 80.9715 231.419 80.3065 232.315 79.5837C233.212 78.8608 234.065 78.1525 234.874 77.4585C235.713 76.7357 236.465 76.0851 237.13 75.5069C237.795 74.9286 238.301 74.4949 238.647 74.2058C238.908 74.466 239.211 74.7985 239.558 75.2033C239.934 75.6081 240.281 75.9839 240.599 76.3309C239.963 76.967 239.168 77.7477 238.214 78.6729C237.26 79.5692 236.219 80.4945 235.091 81.4486C233.992 82.4027 232.836 83.3569 231.621 84.311C230.436 85.2652 229.279 86.1181 228.152 86.8699C227.024 87.6216 225.969 88.2288 224.986 88.6914C224.003 89.1541 223.164 89.3854 222.47 89.3854ZM239.645 48.4438C239.616 48.5594 239.5 48.8486 239.298 49.3112C239.125 49.7449 238.908 50.2653 238.647 50.8725C238.387 51.4508 238.084 52.0724 237.737 52.7374C237.419 53.3735 237.101 53.9663 236.783 54.5156C236.465 55.065 236.161 55.5276 235.872 55.9035C235.583 56.2504 235.351 56.4239 235.178 56.4239C234.657 56.395 234.021 56.236 233.27 55.9468C232.547 55.6577 231.838 55.3397 231.144 54.9927C230.479 54.6168 229.901 54.2554 229.41 53.9084C228.947 53.5615 228.716 53.3157 228.716 53.1711C228.716 52.564 228.889 51.7833 229.236 50.8292C229.583 49.8461 229.988 48.9064 230.45 48.0101C230.913 47.0848 231.376 46.2897 231.838 45.6247C232.33 44.9597 232.706 44.6272 232.966 44.6272C233.486 44.6272 234.123 44.8007 234.874 45.1476C235.626 45.4657 236.349 45.8416 237.043 46.2753C237.766 46.709 238.373 47.1427 238.864 47.5764C239.385 47.9812 239.645 48.2703 239.645 48.4438ZM279.497 76.3309C277.011 78.8753 274.51 81.2173 271.994 83.3569C269.507 85.4676 267.035 87.4482 264.578 89.2986C264.115 90.6287 263.609 91.9731 263.06 93.3321C262.539 94.7199 261.99 96.1078 261.412 97.4956C260.573 99.4039 259.59 101.225 258.463 102.96C257.364 104.724 256.193 106.343 254.95 107.818C253.706 109.321 252.434 110.666 251.133 111.851C249.832 113.066 248.574 114.092 247.36 114.93C246.174 115.769 245.076 116.42 244.064 116.882C243.023 117.345 242.141 117.576 241.418 117.576C240.926 117.576 240.348 117.359 239.683 116.926C239.018 116.492 238.397 115.942 237.818 115.277C237.211 114.641 236.705 113.933 236.3 113.152C235.867 112.401 235.65 111.678 235.65 110.984C235.65 109.48 236.17 108.006 237.211 106.56C238.223 105.114 239.64 103.625 241.461 102.093C243.254 100.56 245.365 98.9413 247.793 97.2354C250.222 95.5584 252.853 93.7369 255.687 91.7707C256.323 90.1227 257.031 88.171 257.812 85.9157C258.622 83.6316 259.576 80.827 260.674 77.5019C259.634 78.9476 258.419 80.3788 257.031 81.7956C255.643 83.1834 254.212 84.4267 252.738 85.5254C251.263 86.6241 249.788 87.506 248.314 88.171C246.868 88.8649 245.538 89.2119 244.324 89.2119C244.006 89.2119 243.601 89.0529 243.109 88.7348C242.589 88.4457 242.083 88.0553 241.591 87.5638C241.071 87.0723 240.637 86.494 240.29 85.829C239.914 85.164 239.727 84.4556 239.727 83.7039C239.727 82.7497 239.958 81.6076 240.42 80.2776C240.883 78.9187 241.563 77.4874 242.459 75.9839C243.326 74.4804 244.382 72.948 245.625 71.3867C246.897 69.8254 248.314 68.3652 249.875 67.0063C251.465 65.6184 253.186 64.3896 255.036 63.3198C256.916 62.2211 258.911 61.3826 261.021 60.8043C261.339 60.8043 261.788 60.9344 262.366 61.1947C262.944 61.426 263.508 61.7006 264.057 62.0187C264.636 62.3078 265.127 62.597 265.532 62.8861C265.966 63.1752 266.182 63.3632 266.182 63.4499C266.182 63.5077 266.139 63.58 266.052 63.6668C265.994 63.6957 265.951 63.7101 265.922 63.7101C265.257 64.1149 264.404 64.6787 263.363 65.4016C262.322 66.1244 261.224 66.9485 260.067 67.8737C258.911 68.77 257.754 69.7386 256.598 70.7795C255.441 71.8204 254.386 72.8613 253.432 73.9022C252.506 74.9141 251.755 75.8972 251.176 76.8513C250.598 77.7766 250.309 78.6151 250.309 79.3668C250.309 79.627 250.367 79.8584 250.482 80.0607C250.627 80.2342 250.829 80.321 251.09 80.321C251.812 80.321 252.622 80.0752 253.518 79.5837C254.444 79.0632 255.383 78.3982 256.337 77.5886C257.292 76.7791 258.246 75.8827 259.2 74.8997C260.154 73.8877 261.05 72.9046 261.889 71.9505C262.756 70.9674 263.522 70.0567 264.187 69.2182C264.852 68.3797 265.373 67.7002 265.749 67.1798C265.807 67.1219 265.85 67.0641 265.879 67.0063C265.937 66.9485 266.009 66.8906 266.096 66.8328C266.327 66.8906 266.631 67.1798 267.006 67.7002C267.411 68.2207 267.802 68.8278 268.177 69.5218C268.553 70.1868 268.871 70.8518 269.132 71.5168C269.421 72.1818 269.565 72.6589 269.565 72.948V73.0348C269.565 73.0637 269.536 73.1649 269.479 73.3383C269.161 74.3503 268.756 75.7671 268.264 77.5886C267.773 79.4102 267.151 81.5064 266.399 83.8773C268.25 82.4027 270.1 80.8559 271.951 79.2367C273.83 77.6176 275.695 75.8827 277.545 74.0323L279.497 76.3309ZM240.767 111.764C241.346 111.764 242.184 111.316 243.283 110.42C244.353 109.553 245.495 108.425 246.709 107.037C247.924 105.678 249.109 104.16 250.266 102.483C251.451 100.835 252.434 99.2304 253.215 97.6691C251.335 99.028 249.615 100.3 248.054 101.486C246.492 102.7 245.162 103.871 244.064 104.999C242.936 106.126 242.069 107.211 241.461 108.251C240.825 109.321 240.507 110.377 240.507 111.417C240.507 111.649 240.594 111.764 240.767 111.764ZM294.888 66.0521C294.541 66.9774 294.194 67.9171 293.847 68.8712C293.501 69.8254 293.154 70.8084 292.807 71.8204C294.628 69.7386 296.189 68.0472 297.491 66.7461C298.821 65.416 299.934 64.3751 300.83 63.6234C301.755 62.8716 302.493 62.3657 303.042 62.1054C303.62 61.8163 304.068 61.6717 304.386 61.6717C304.762 61.6717 305.326 61.8597 306.078 62.2355C306.83 62.6114 307.581 63.074 308.333 63.6234C309.114 64.1728 309.779 64.7366 310.328 65.3148C310.906 65.8931 311.196 66.3991 311.196 66.8328C311.196 66.9195 311.181 67.0352 311.152 67.1798C311.123 67.2954 311.08 67.4544 311.022 67.6568C310.791 68.3797 310.487 69.2326 310.111 70.2157C309.764 71.1987 309.389 72.2252 308.984 73.295C308.579 74.3359 308.174 75.3912 307.769 76.461C307.365 77.5019 307.003 78.485 306.685 79.4102C306.367 80.3354 306.107 81.145 305.904 81.8389C305.702 82.5329 305.601 83.0388 305.601 83.3569C305.601 83.5304 305.688 83.6171 305.861 83.6171C306.179 83.6171 306.656 83.4292 307.292 83.0533C307.928 82.6774 308.651 82.1859 309.461 81.5787C310.299 80.9715 311.167 80.3065 312.063 79.5837C312.959 78.8608 313.812 78.1525 314.622 77.4585C315.46 76.7357 316.212 76.0851 316.877 75.5069C317.542 74.9286 318.048 74.4949 318.395 74.2058C318.684 74.466 319.002 74.7985 319.349 75.2033C319.696 75.6081 320.029 75.9839 320.347 76.3309C319.711 76.967 318.916 77.7477 317.961 78.6729C317.007 79.5692 315.966 80.4945 314.839 81.4486C313.74 82.4027 312.583 83.3569 311.369 84.311C310.184 85.2652 309.027 86.1181 307.899 86.8699C306.772 87.6216 305.717 88.2288 304.733 88.6914C303.75 89.1541 302.926 89.3854 302.261 89.3854C301.828 89.3854 301.278 89.2263 300.613 88.9083C299.948 88.6192 299.298 88.2433 298.662 87.7807C298.054 87.347 297.534 86.8554 297.1 86.3061C296.667 85.7567 296.45 85.2218 296.45 84.7014C296.71 83.5159 297.057 82.1714 297.491 80.6679C297.953 79.1644 298.445 77.632 298.965 76.0707C299.486 74.4804 300.021 72.9191 300.57 71.3867C301.148 69.8254 301.698 68.3941 302.218 67.093L302.131 67.1798C301.582 67.8448 300.787 68.7266 299.746 69.8254C298.734 70.8952 297.577 72.283 296.276 73.9889C294.975 75.6659 293.602 77.7043 292.156 80.1041C290.71 82.475 289.294 85.2941 287.906 88.5613C287.732 88.9661 287.573 89.2842 287.429 89.5155C287.284 89.7468 287.009 89.8624 286.605 89.8624C286.113 89.8624 285.549 89.7179 284.913 89.4287C284.306 89.1685 283.684 88.8071 283.048 88.3445C282.383 87.9108 281.733 87.4192 281.097 86.8699C280.432 86.3205 279.839 85.7712 279.318 85.2218C279.318 85.0483 279.405 84.5568 279.579 83.7472C279.723 82.9376 279.94 81.9257 280.229 80.7113C280.518 79.468 280.88 78.0657 281.313 76.5044C281.747 74.9141 282.239 73.2516 282.788 71.5168C283.337 69.782 283.945 68.0183 284.61 66.2256C285.246 64.4041 285.94 62.6548 286.691 60.9778C287.906 61.5561 289.25 62.2645 290.725 63.103C292.228 63.9414 293.616 64.9245 294.888 66.0521Z"
        fill="#055491"
      />
    </svg>
  )
}

const AcFormsList = {
  Account: 'ac',
  EditPassword: 'ed',
  EditEmail: 'em',
  EditName: 'en',
}

// let appURL = 'http://localhost:6127'
let appURL = 'https://loginsign.com';
var sessionRef: any = null
const LoginLayout = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<{ id: string; url: string } | null>(
    null,
  )
  const [initialized, setInitialized] = useState('none')
  const [account, setAccount] = useState<any | null>(null)
  const [tab, setTab] = useState<'account' | 'connections'>('account')
  const bkmenuRef = useRef<any | null>(null)
  const [showBkMenu, setShowBkMenu] = useState(false)

  const [enabledForm, setEnabledForm] = useState(AcFormsList.Account)

  const [deleteActive, setDeleteActive] = useState(false)

  const chatRef = useRef(false)

  const firstNameRef = useRef<HTMLInputElement | null>(null)
  const lastNameRef = useRef<HTMLInputElement | null>(null)
  const passwordNameRef = useRef<HTMLInputElement | null>(null)
  const newEmailRef = useRef<HTMLInputElement | null>(null)
  const confirmEmailRef = useRef<HTMLInputElement | null>(null)
  const newPwdRef = useRef<HTMLInputElement | null>(null)
  const confirmPwdRef = useRef<HTMLInputElement | null>(null)
  const nameInputNewRef = useRef<HTMLInputElement | null>(null)
  const fnameInputNewRef = useRef<HTMLInputElement | null>(null)
  const lnameInputNewRef = useRef<HTMLInputElement | null>(null)

  const newNewsletterRef = useRef<boolean>(true)
  const termsRef = useRef<boolean>(false)

  const [menuPopup, setMenuPopup] = useState(false)
  const togglePopupButton = useRef<HTMLSpanElement | null>(null)
  const [popUpPos, setPopUpPos] = useState({ x: -1000, y: -1000 })

  const [deleteAssured, setDeleteAssured] = useState(false)
  const [terms, setTerms] = useState(false)

  useEffect(() => {
    if (!document.querySelector('script[src="/faqwidget.js"]')) {
      const script = document.createElement('script');
      script.src = "/faqwidget.js";
      script.setAttribute('data-src', 'https://faqnation.com/embed/floating-button.js');
      script.setAttribute('data-project', 'tp_YQGcHgXd');
      script.setAttribute('data-user', 'tuLdk7uHkSoyjeIHffeky');
      script.setAttribute('data-id', 'wd3A9JDnIzdX4VJdAAkWnU2VaovDXSS0ipbn');
      script.setAttribute('data-hidetopics', 'true');
      script.defer = true; // defer instead of async
      document.body.appendChild(script);
    }
  }, []); // Empty dependency array so it runs only once after first render


  const [error, setError] = useState<{
    field: string | null
    err: string
  }>({
    field: null,
    err: '',
  })

  const togglePopup = () => {
    if (!togglePopupButton.current) {
      return
    }
    setPopUpPos({
      x: togglePopupButton.current.getBoundingClientRect().left,
      y: togglePopupButton.current.getBoundingClientRect().top + 30,
    })
    setMenuPopup(!menuPopup)
  }

  const initLogin = () => {
    console.log(
      'Assign client id :: ',
      process.env['NEXT_APP_ASSIGN_CLIENT_ID'],
    )
    AssignSession.createSession(
      {
        clientId: "183f00bf-771c-43b9-b1b3-ef32c5f8ef78"/* || process.env["NEXT_APP_PUBLIC_ASSIGN_CLIENT_ID"] || "30ea6f3c-b292-4215-a9ac-9e3bae38d36f"*/
        
        /** LCOAL */
        // clientId: '30ea6f3c-b292-4215-a9ac-9e3bae38d36f',
      },
      {
        sessionType: SessionType.PopupLogin,
      },
    ).then((r) => {
      sessionRef = r
      if (r) {
        setSession({
          id: (r as any).getSessionId(),
          url: (r as any).getSessionUrl(),
        })
        setInitialized('login')
      }
    })
  }

  const authToken = async (tk: string) => {
    let r = await fetch(`${appURL}/api/auth/ls_me`, {
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
      setInitialized('signed')
      setAccount(k.account)
    } else {
      initLogin()
      console.log('error')
    }
  }

  useEffect(() => {
    let ck = JSCookie.get('loginsign_')

    if (ck) {
      authToken(ck)
    } else {
      initLogin()
    }

    if (!document.body.classList.contains('--main-page')) {
      document.body.classList.add('--main-page')
    }

    return () => {
      if (document.body.classList.contains('--main-page')) {
        document.body.classList.remove('--main-page')
      }
    }
  }, [])

  const getName = () => {
    if (!account) {
      return ''
    }
    let fname = account.firstName ? account.firstName : ''
    let lname = account.familyName ? account.familyName : ''
    return `${fname} ${lname}`
  }

  useOnClickOutside(
    bkmenuRef,
    (e) => {
      setShowBkMenu(false)
    },
    () => {},
    showBkMenu,
  )

  const [selectedFile, setSelectedFile] = useState(null)

  const updateAccount = async ({
    name,
    name_w,
    email,
    password,
    new_password,
    newsletter,
    delete_account,
    setted_up,
  }: any) => {
    setError({
      field: null,
      err: '',
    })
    let ck = JSCookie.get('loginsign_')
    const resp = await fetch('/api/auth/ls_me', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: '*/*',
        authorization: ck,
      } as any,
      body: JSON.stringify({
        name: name,
        name_w: name_w,
        email: email,
        password: password,
        new_password: new_password,
        newsletter: newsletter,
        delete_account: delete_account,
        setted_up: setted_up,
      }),
    })
    if (resp.status === 200) {
      setEnabledForm(AcFormsList.Account)
    } else {
      if (resp.status) {
        let j = await resp.json()
        console.log('K :: ', j)
        setError({
          field: j.error.field,
          err: j.error.message,
        })
      }
      console.log('error')
    }
  }

  // useEffect(() => {
  //   console.log("CE ::: ", error);
  // }, [error]);

  // Handle file selection
  const handleFileChange = (event: any) => {
    setSelectedFile(event.target.files[0])
  }

  const handleUpload = (e: any) => {
    document.getElementById('fileInput')?.click()
  }

  const handleUploadX = async () => {
    if (!selectedFile) {
      alert('Please select a file first.')
      return
    }

    // Create a FormData object to send the file
    const formData = new FormData()
    formData.append('file', selectedFile)

    let ck = JSCookie.get('loginsign_')
    const resp = await fetch('/api/auth/ls_picture', {
      method: 'PUT',
      headers: {
        // 'Content-Type': 'application/x',
        Accept: '*/*',
        authorization: ck,
      } as any,
      body: formData,
    })
    if (resp.status === 200) {
      setSelectedFile(null)
      authToken(ck || '')
    } else {
      console.log('error')
      setSelectedFile(null)
    }
  }

  useEffect(() => {
    if (selectedFile) {
      handleUploadX()
    }
  }, [selectedFile])

  const handleRemove = async (e: any) => {
    let ck = JSCookie.get('loginsign_')
    const resp = await fetch('/api/auth/ls_picture', {
      method: 'DELETE',
      headers: {
        // 'Content-Type': 'application/x',
        Accept: '*/*',
        authorization: ck,
      } as any,
    })
    if (resp.status === 200) {
      setSelectedFile(null)
      authToken(ck || '')
    } else {
      console.log('error')
      setSelectedFile(null)
    }
  }

  const handleUpdateName = async (e: any) => {
    let v = e.target.value.trim()
    if (v && v.length > 0) {
      await updateAccount({
        name: v,
      })
    }
  }

  const handleEmail = async (e: any) => {
    let v = e.target.value.trim()
    if (v && v.length > 0) {
      await updateAccount({
        email: v,
      })
    }
  }

  const handleUpdatePassword = async (e: any) => {
    let v = e.target.value.trim()
    if (v && v.length > 0) {
      await updateAccount({
        password: v,
      })
    }
  }

  const handleRemoveAccount = async (e: any) => {
    if (deleteActive) {
      setDeleteAssured(true)
      return;
    }
    setDeleteActive(true)
  }

  const [currentForm, setCurrentForm] = useState('login')

  const updateD = async (data: any) => {
    let resp = await updateAccount(data)
    console.log('respxxx ::: ', resp)
    let ck = JSCookie.get('loginsign_')
    await authToken(ck || '')
  }

  const handleSubmitForm = (e: any) => {
    e.preventDefault()
    if (enabledForm === AcFormsList.EditName) {
      const fname = firstNameRef.current?.value
      const lname = lastNameRef.current?.value
      const password = passwordNameRef.current?.value
      updateD({
        name: `${fname} ${lname}`,
        password: password,
      })
    } else if (enabledForm === AcFormsList.EditEmail) {
      const newEmail = newEmailRef.current?.value
      const cnewemail = confirmEmailRef.current?.value
      const password = passwordNameRef.current?.value
      if (newEmail?.trim() !== cnewemail?.trim()) {
        setError({
          field: 'cemail',
          err: "Email didn't match.",
        })
        return
      }
      updateD({
        email: newEmail,
        password: password,
      })
    } else if (enabledForm === AcFormsList.EditPassword) {
      const password = passwordNameRef.current?.value
      const npassword = newPwdRef.current?.value
      const cpassword = confirmPwdRef.current?.value
      if (npassword?.trim() !== cpassword?.trim()) {
        setError({
          field: 'cpwd',
          err: "New password didn't match.",
        })
        return
      }
      updateD({
        password: password,
        new_password: npassword,
      })
    }
  }

  const handleRemoveAccountForm = async (e: any) => {
    const pwd = passwordNameRef.current?.value
    await updateAccount({
      delete_account: true,
      password: pwd,
    })
  }

  const handleNewAccountForm = async (e: any) => {
    e.preventDefault()
    // let name = nameInputNewRef.current?.value
    let name = `${fnameInputNewRef.current?.value} ${lnameInputNewRef.current?.value}`.trim() || "";
    let newsletter = newNewsletterRef.current
    console.log('NEwsletter :: ', newsletter)
    let terms = termsRef.current

    // if(!terms) {
    // }

    await updateAccount({
      name_w: name,
      newsletter: newsletter,
      setted_up: true,
    })
    let ck = JSCookie.get('loginsign_')
    await authToken(ck || '')
  }

  const handleLogout = () => {
    JSCookie.remove('loginsign_')
    setTimeout(() => {
      window.location.href = '/'
    }, 100)
  }

  return (
    <>
      {initialized === 'login' ? (
        <>
          <div className="assign-navigation-landing">
            <div className="inner">
              <span>
                <a href="#">
                  <img height={34} src="/nav_icon.png" />
                </a>
              </span>
              {currentForm === 'login' ? (
                <NavLink
                  onClick={(e: any) => {
                    e.preventDefault()
                    // const customEvent = new CustomEvent('change_form', {
                    //   detail: { new_form: 'otp' },
                    // })
                    const customEvent: CustomEvent<{ new_form: string }> =
                      new CustomEvent('change_form', {
                        detail: { new_form: 'otp' },
                      })
                    window.dispatchEvent(customEvent)
                  }}
                  text={'One-Time Password'}
                />
              ) : currentForm === 'otp' ? (
                <NavLink
                  onClick={(e: any) => {
                    e.preventDefault()
                    const customEvent: CustomEvent<{ new_form: string }> =
                      new CustomEvent('change_form', {
                        detail: { new_form: 'login' },
                      })
                    window.dispatchEvent(customEvent)
                  }}
                  text={'Use Password'}
                />
              ) : currentForm === 'otp_code' ? (
                <NavLink
                  onClick={(e: any) => {
                    e.preventDefault()
                    const customEvent: CustomEvent<{ new_form: string }> =
                      new CustomEvent('change_form', {
                        detail: { new_form: 'otp' },
                      })
                    window.dispatchEvent(customEvent)
                  }}
                  text={'Switch Email'}
                />
              ) : currentForm === 'signup' ? (
                <NavLink
                  onClick={(e: any) => {
                    e.preventDefault()
                    const customEvent: CustomEvent<{ new_form: string }> =
                      new CustomEvent('change_form', {
                        detail: { new_form: 'login' },
                      })
                    window.dispatchEvent(customEvent)
                  }}
                  text={'Log in'}
                />
              ) : (
                <></>
              )}
            </div>
          </div>
          <div className="landing_page">
            <div className="inner">
              <div className="left-section section">
                <div className="inner">
                  <div className="ct">
                    <div className="heading">
                      {/* <img src="/ad_logo.png" /> */}
                      <LsignLandingLogo />
                    </div>
                    <div className="desc">
                      <p>
                        Sign to the world around you while maintaining privacy
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="right-section section">
                <div className="inner">
                  <LoginForm
                    onFormChange={(e: any) => setCurrentForm(e)}
                    showLogo={false}
                    style={{ width: 'fit-content', height: 'fit-content' }}
                    loginProps={
                      session
                        ? {
                            logo: 'https://loginsign.com/image.png',
                            name: 'LoginSign',
                            color: '#164C78',
                            sessionId: session.id,
                            sessionType: SessionType.PopupLogin,
                            appURL: appURL || 'https://loginsign.com',
                          }
                        : {}
                    }
                    selfApp={true}
                  />
                </div>
              </div>
            </div>
          </div>
          <footer>
            <div className="inner">
              <div className="col hide-in-mobile">
                <p>
                LoginSign allows you to log in to web applications and provides security by sharing anonymous login information while keeping your online privacy.
                </p>
              </div>
              <div className="col copy show-in-mobile">
                <div className="links">
                  <a href="#">About</a>
                  <a href="#">Support</a>
                  <a href="#">More</a>
                </div>
              </div>
              <div className="col copy hide-in-mobile">
                <div className="links">
                  <a href="#">About</a>
                  <a href="#">Terms</a>
                  <a href="#">Privacy</a>
                  <a href="#">SSO</a>
                  <a href="#">FAQ</a>
                  <a href="#">Support</a>
                </div>
              </div>
              <div
                className="col copy hide-in-mobile"
                style={{ textAlign: 'center', justifyContent: 'center' }}
              >
                <p>&copy; 2024 LoginSign</p>
              </div>
            </div>
          </footer>
        </>
      ) : initialized === 'signed' ? (
        <>
          {account.setted_up ? (
            <>
              {deleteAssured ? (
                <>
                  <div className="assign-form-container">
                    <div className="assign-navigation"></div>
                    <div className="assign-form-body">
                      <div className="assign-form-hdr new">
                        <img src="/image.png" />
                      </div>
                      <div className="assign-form-body">
                        <form onSubmit={handleRemoveAccountForm}>
                          <div className="inner">
                            <Input
                              ref={passwordNameRef}
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
                              className="assign-signin-continue-button --red"
                              type={ButtonType.Primary}
                              label="Remove account"
                              htmlType="submit"
                            />
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <DashboardHeader
                    activeTab={tab === 'account' ? 'account' : 'profile'}
                    onTabChange={(newTab) => setTab(newTab === 'account' ? 'account' : 'connections')}
                    userName={getName()}
                    userEmail={account.connections[0]?.providerUsername || ''}
                    userAvatar={account.picture ? `/p/${account.picture}` : undefined}
                    onLogout={handleLogout}
                  />
                  <div className="signed-body-form">
                    <Popup
                      openSignal={enabledForm !== AcFormsList.Account}
                      closeSignal={enabledForm === AcFormsList.Account}
                      onClose={() => {
                        setEnabledForm(AcFormsList.Account)
                      }}
                      pstyle="larg"
                      noHeader={true}
                    >
                      {enabledForm === AcFormsList.EditPassword ? (
                        <form
                          onSubmit={handleSubmitForm}
                          className="popup---inner no-padding"
                        >
                          <div className="col no-col">
                            <Input
                              ref={newPwdRef}
                              placeholder="New password"
                              label="New password"
                              htmlType="password"
                              error={error.field === 'npwd' ? error.err : null}
                            />
                          </div>
                          <div className="col no-col">
                            <Input
                              ref={confirmPwdRef}
                              placeholder="Confirm password"
                              label="Confirm password"
                              htmlType="password"
                              error={error.field === 'cpwd' ? error.err : null}
                            />
                          </div>
                          <div className="col no-col btn-col">
                            <Button
                              type={ButtonType.SecondaryWithBorder}
                              label="Cancel"
                              htmlType="button"
                              onClick={() =>
                                setEnabledForm(AcFormsList.Account)
                              }
                            />
                            <Button
                              type={ButtonType.Primary}
                              label="Update"
                              htmlType="submit"
                            />
                          </div>
                        </form>
                      ) : enabledForm === AcFormsList.EditEmail ? (
                        <>
                          <form
                            onSubmit={handleSubmitForm}
                            className="popup---inner no-padding"
                          >
                            <div className="col no-col">
                              <Input
                                ref={newEmailRef}
                                placeholder="john@mail.com"
                                label="New email"
                                htmlType="email"
                                error={
                                  error.field === 'nemail' ? error.err : null
                                }
                              />
                            </div>
                            <div className="col no-col">
                              <Input
                                ref={confirmEmailRef}
                                placeholder="john@mail.com"
                                label="Confirm new email"
                                htmlType="email"
                                error={
                                  error.field === 'cemail' ? error.err : null
                                }
                              />
                            </div>
                            <div className="col no-col btn-col">
                              <Button
                                type={ButtonType.SecondaryWithBorder}
                                label="Cancel"
                                htmlType="button"
                                onClick={() =>
                                  setEnabledForm(AcFormsList.Account)
                                }
                              />
                              <Button
                                type={ButtonType.Primary}
                                label="Update"
                                htmlType="submit"
                              />
                            </div>
                          </form>
                        </>
                      ) : enabledForm === AcFormsList.EditName ? (
                        <>
                          <form
                            onSubmit={handleSubmitForm}
                            className="popup---inner no-padding"
                          >
                            <div className="col no-col">
                              <Input
                                ref={firstNameRef}
                                placeholder="First name"
                                label="First name"
                                htmlType="text"
                                defaultValue={account.firstName}
                              />
                            </div>
                            <div className="col no-col">
                              <Input
                                ref={lastNameRef}
                                placeholder="Last name"
                                label="Last name"
                                htmlType="text"
                                defaultValue={account.familyName}
                              />
                            </div>
                            <div className="col no-col btn-col">
                              <Button
                                type={ButtonType.SecondaryWithBorder}
                                label="Cancel"
                                htmlType="button"
                                onClick={() =>
                                  setEnabledForm(AcFormsList.Account)
                                }
                              />
                              <Button
                                type={ButtonType.Primary}
                                label="Update"
                                htmlType="submit"
                              />
                            </div>
                          </form>
                        </>
                      ) : (
                        <></>
                      )}
                    </Popup>
                    {tab === 'account' ? (
                      <form onSubmit={handleSubmitForm}>
                        <div className="inner">
                          <div className="col">
                            <div
                              className="form-img ac-pfp-image"
                              style={{ width: '100%' }}
                            >
                              <input
                                id="fileInput"
                                type="file"
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                              />
                              <div
                                style={{
                                  backgroundImage: `url(${
                                    account.picture
                                      ? `/p/${account.picture}`
                                      : '/account.png'
                                  })`,
                                }}
                                className="fake-avatar"
                              >
                              </div>
                            </div>
                          </div>
                          <div className="col">
                            <div className="left">
                              <BodyText>Profile image</BodyText>
                            </div>
                            <div className="right">
                              {account.picture && (
                                <Button
                                  type={ButtonType.TextButton}
                                  onClick={handleRemove}
                                  label="Remove"
                                ></Button>
                              )}
                              <Button
                                type={ButtonType.TextButton}
                                onClick={handleUpload}
                                label="Upload"
                              ></Button>
                            </div>
                          </div>
                          <div className="col">
                            <div className="left">
                              <BodyText>{getName()}</BodyText>
                            </div>
                            <div className="right">
                              {/* <BodyText>{getName()}</BodyText> */}
                              <Button
                                type={ButtonType.TextButton}
                                onClick={() =>
                                  setEnabledForm(AcFormsList.EditName)
                                }
                                label="Edit username"
                              ></Button>
                            </div>
                          </div>
                          <div className="col">
                            <div className="left">
                              <BodyText>
                                {account.connections[0].providerUsername}
                              </BodyText>
                            </div>
                            <div className="right">
                              {/* <BodyText>
                                  {account.connections[0].providerUsername}
                                </BodyText> */}
                              <Button
                                type={ButtonType.TextButton}
                                onClick={() =>
                                  setEnabledForm(AcFormsList.EditEmail)
                                }
                                label="Edit email"
                              ></Button>
                            </div>
                          </div>
                          <div className="col">
                            <div className="left">
                              <BodyText>*********</BodyText>
                            </div>
                            <div className="right">
                              {/* <BodyText>{'*********'}</BodyText> */}
                              <Button
                                type={ButtonType.TextButton}
                                onClick={() =>
                                  setEnabledForm(AcFormsList.EditPassword)
                                }
                                label="Edit password"
                              ></Button>
                            </div>
                          </div>
                          <div className="col">
                            <div className="left">
                              <BodyText>Newsletter</BodyText>
                            </div>
                            <div className="right">
                              <BodyText>
                                {account.newsletter ? 'on' : 'off'}
                              </BodyText>
                              <Switch
                                defaultValue={account.newsletter}
                                onChange={(status: boolean) =>
                                  updateD({
                                    newsletter: status,
                                  })
                                }
                              />
                            </div>
                          </div>
                          <div className="col">
                            <div className="left">
                              <BodyText>You want to leave us?</BodyText>
                            </div>
                            <div className="right">
                              <Button
                                type={ButtonType.TextButton}
                                className={deleteActive ? ' --rd' : ''}
                                label={
                                  deleteActive
                                    ? 'Are you sure?'
                                    : 'Remove account'
                                }
                                htmlType="button"
                                onClick={handleRemoveAccount}
                              ></Button>
                            </div>
                          </div>
                        </div>
                      </form>
                    ) : (
                      <></>
                    )}
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              <>
                <div className="assign-form-container">
                  <div className="assign-navigation"></div>
                  <div className="assign-form-body">
                    <div className="assign-form-body">
                      <form onSubmit={handleNewAccountForm}>
                        <div className="inner">
                          <div className="form-img" style={{ width: '100%' }}>
                            <input
                              id="fileInput"
                              type="file"
                              style={{ display: 'none' }}
                              onChange={handleFileChange}
                            />
                            <div
                              style={{
                                backgroundImage: `url(${
                                  account.picture
                                    ? `/p/${account.picture}`
                                    : '/upload_.png'
                                })`,
                              }}
                              className="fake-avatar"
                            ></div>
                          </div>
                          <div className="form-img-controls">
                            {!account.picture ? (
                              <>
                                <Button
                                  type={ButtonType.TextButton}
                                  onClick={handleUpload}
                                  label="Upload profile image"
                                ></Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  type={ButtonType.TextButton}
                                  onClick={handleUpload}
                                  label="Upload"
                                ></Button>
                                <Button
                                  type={ButtonType.TextButton}
                                  onClick={handleRemove}
                                  label="Remove"
                                ></Button>
                              </>
                            )}
                          </div>
                          <div className="x" style={{ height: 20 }}></div>
                          {/* <Input
                            ref={nameInputNewRef}
                            htmlType={'text'}
                            className={'assign-signin-input'}
                            placeholder={'Name'}
                          /> */}
                          <Input
                            ref={fnameInputNewRef}
                            htmlType={'text'}
                            className={'assign-signin-input'}
                            placeholder={'First name'}
                          />
                          <Input
                            ref={lnameInputNewRef}
                            htmlType={'text'}
                            className={'assign-signin-input'}
                            placeholder={'Last name'}
                          />
                          {/* <div className="colf">
                            <Checkbox
                              onChange={(s: boolean) => {
                                newNewsletterRef.current = s
                              }}
                              label={
                                <BodyText>
                                  Unsubscribe me from all newsletters
                                </BodyText>
                              }
                            />
                          </div> */}
                          <div className="colf" style={{ marginBottom: 10 }}>
                            <Checkbox
                              onChange={(s: boolean) => {
                                termsRef.current = s
                                setTerms(s)
                              }}
                              label={
                                <BodyText>
                                  I agree Terms of Service & Privacy Policy
                                </BodyText>
                              }
                            />
                          </div>
                          <Button
                            className="assign-signin-continue-button"
                            type={ButtonType.Primary}
                            label="Complete registration"
                            disabled={!terms}
                            htmlType="submit"
                          />
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </>
            </>
          )}
        </>
      ) : (
        <div className="loading-view">
          <div className="loader"></div>
        </div>
      )}
    </>
  )
}

export default function Page() {
  const props = {}
  return <LoginLayout children={<></>} />
  // return (
  //   <LoginForm loginProps={props} />
  // )
}

// export default function Page() {
//   const props = {};
//   return (
//       <RedirectForm loginProps={props} />
//   )
// }
