import { url } from 'inspector'
import Button, { ButtonType } from './Button'
import { Popup } from './Popup'
import accountStyles from './account.module.scss'
import { useRef, useState } from 'react'
import { CtxMenu } from './CtxMenu'
import { CtxMenuItem } from './CtxMenuItem'

const EditPassword = ({ account }: any) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [resetPasswordRequestSent, setResetPasswordRequestSent] =
    useState<boolean>(false)

  async function requestResetPassword() {
    //   let email = authCtx.state.user.email;
    //   if (!email) {
    //     return;
    //   }
    setResetPasswordRequestSent(false)
    setLoading(true)
    //   try {
    //     let response = await callApi({
    //       path: ApiPaths.requestResetPassword,
    //       method: "post",
    //       payload: {
    //         email: email,
    //       },
    //     });
    //     if (response.response) {
    //       response = response.response;
    //     }
    //     if (response.status === 200) {
    //       setResetPasswordRequestSent(true);
    //     } else {
    //       window.alert("Something went wrong!");
    //     }
    //   } catch (err) {
    //     window.alert("Something went wrong!");
    //   }
    setLoading(false)
  }

  return (
    <>
      <CtxMenuItem
        title={'Change password'}
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 -960 960 960"
            width="20px"
          >
            <path
              d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80ZM240-160v-400 400Z"
              className="icon-fill"
            />
          </svg>
        }
        action={requestResetPassword}
      />
      {/* {loading && (<LoadingPopup />, document.body)} */}
      {
        resetPasswordRequestSent && (
          //   createPortal(
          <Popup
            openSignal={resetPasswordRequestSent}
            closeSignal={!requestResetPassword}
            onClose={() => {}}
            strict={true}
            noHeader={true}
            noCloseBtn={true}
            pstyle="small"
            zIndex={9999999999}
          >
            <>
              <div
                style={{
                  color: 'var(--text-clr-75)',
                  padding: '10px',
                  lineHeight: '1.6',
                  marginBottom: '4px',
                }}
              >
                Password reset request was sent successfully, please check your
                email to reset your password.
              </div>
              <div style={{ padding: '10px', textAlign: 'right' }}>
                <Button
                  onClick={() => {
                    setResetPasswordRequestSent(false)
                  }}
                  // style={{ minWidth: "100px" }}
                  type={ButtonType.Primary}
                >
                  Done
                </Button>
              </div>
            </>
          </Popup>
        )
        // document.body
      }
    </>
  )
}

const UpdateUserAvatar = ({ closeCtxMenu }: { closeCtxMenu: () => void }) => {
  // const userInfoCtx = useUserInfoContext();
  const inputFileLabel = useRef<HTMLLabelElement>(null)
  const inputFile = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState<boolean>(false)

  function updateAvatar() {
    if (!inputFileLabel.current) {
      return
    }
    inputFileLabel.current.click()
  }

  function updloadAvatar() {
    if (!inputFile.current || !inputFile.current.files) {
      return
    }
    if (inputFile.current.files.length > 1) {
      alert('please select just one file ')
      return
    } else if (inputFile.current.files.length === 0) {
      alert('please select a file ')
      return
    }
    var fd = new FormData()
    fd.append('file', inputFile.current.files[0])
    setUploading(true)
    //   callApi({
    //     method: "patch",
    //     headers: { "content-type": "multipart/form-data" },
    //     path: apiBase + "/user/picture",
    //     payload: fd,
    //   })
    //     .then((r) => {
    //       if (r.status === 200) {
    //         userInfoCtx.methods.setAvatar(r.data.picture);
    //       } else if (r.status === 415) {
    //         alert("file type not supported, Please select another file!");
    //       } else {
    //         alert("Error uploading file, please try again!");
    //       }
    //     })
    //     .catch((e) => {
    //       //alert('ERROR')
    //       alert("Error uploading file, please try again!");
    //       console.log(e);
    //     })
    //     .finally(() => {
    //       setUploading(false);
    //       if (!inputFile.current) {
    //         return;
    //       }
    //       inputFile.current.value = "";
    //       closeCtxMenu();
    //     });
  }

  return (
    <>
      <CtxMenuItem
        title={'Change Picture'}
        icon={
          <svg
            width="18"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.95038 10.2497C3.54984 9.82783 4.19144 9.51396 4.87518 9.3081C5.55838 9.10277 6.26664 9.0001 6.99998 9.0001C7.73331 9.0001 8.44158 9.10277 9.12478 9.3081C9.80851 9.51396 10.4501 9.82783 11.0496 10.2497C11.4389 9.79423 11.728 9.2889 11.9168 8.7337C12.1056 8.17796 12.2 7.6001 12.2 7.0001C12.2 5.55583 11.6944 4.3281 10.6832 3.3169C9.67198 2.3057 8.44424 1.8001 6.99998 1.8001C5.55571 1.8001 4.32798 2.3057 3.31678 3.3169C2.30558 4.3281 1.79998 5.55583 1.79998 7.0001C1.79998 7.6001 1.89438 8.17796 2.08318 8.7337C2.27198 9.2889 2.56104 9.79423 2.95038 10.2497ZM6.99998 8.2001C6.33331 8.2001 5.76664 7.96676 5.29998 7.5001C4.83331 7.03343 4.59998 6.46676 4.59998 5.8001C4.59998 5.13343 4.83331 4.56676 5.29998 4.1001C5.76664 3.63343 6.33331 3.4001 6.99998 3.4001C7.66664 3.4001 8.23331 3.63343 8.69998 4.1001C9.16664 4.56676 9.39998 5.13343 9.39998 5.8001C9.39998 6.46676 9.16664 7.03343 8.69998 7.5001C8.23331 7.96676 7.66664 8.2001 6.99998 8.2001ZM6.99998 13.4001C6.12211 13.4001 5.29438 13.2334 4.51678 12.9001C3.73918 12.5668 3.05864 12.1084 2.47518 11.5249C1.89171 10.9414 1.43331 10.2609 1.09998 9.4833C0.766642 8.7057 0.599976 7.87796 0.599976 7.0001C0.599976 6.11103 0.766642 5.28036 1.09998 4.5081C1.43331 3.73636 1.89171 3.05876 2.47518 2.4753C3.05864 1.89183 3.73918 1.43343 4.51678 1.1001C5.29438 0.766764 6.12211 0.600098 6.99998 0.600098C7.88904 0.600098 8.71971 0.766764 9.49198 1.1001C10.2637 1.43343 10.9413 1.89183 11.5248 2.4753C12.1082 3.05876 12.5666 3.73636 12.9 4.5081C13.2333 5.28036 13.4 6.11103 13.4 7.0001C13.4 7.87796 13.2333 8.7057 12.9 9.4833C12.5666 10.2609 12.1082 10.9414 11.5248 11.5249C10.9413 12.1084 10.2637 12.5668 9.49198 12.9001C8.71971 13.2334 7.88904 13.4001 6.99998 13.4001ZM6.99998 12.2001C7.57758 12.2001 8.13304 12.1084 8.66638 11.9249C9.19971 11.7414 9.69971 11.4721 10.1664 11.1169C9.68851 10.8166 9.18291 10.5889 8.64958 10.4337C8.11624 10.278 7.56638 10.2001 6.99998 10.2001C6.43358 10.2001 5.88078 10.275 5.34158 10.4249C4.80291 10.5748 4.30024 10.8054 3.83358 11.1169C4.30024 11.4721 4.80024 11.7414 5.33358 11.9249C5.86691 12.1084 6.42238 12.2001 6.99998 12.2001ZM6.99998 7.0001C7.33331 7.0001 7.61651 6.8833 7.84958 6.6497C8.08318 6.41663 8.19998 6.13343 8.19998 5.8001C8.19998 5.46676 8.08318 5.18356 7.84958 4.9505C7.61651 4.7169 7.33331 4.6001 6.99998 4.6001C6.66664 4.6001 6.38344 4.7169 6.15038 4.9505C5.91678 5.18356 5.79998 5.46676 5.79998 5.8001C5.79998 6.13343 5.91678 6.41663 6.15038 6.6497C6.38344 6.8833 6.66664 7.0001 6.99998 7.0001Z"
              className="icon-fill"
            />
          </svg>
        }
        action={updateAvatar}
      />
      {
        <div style={{ display: 'none' }}>
          <label ref={inputFileLabel} htmlFor="user-avatar-file-input" />
          <input
            ref={inputFile}
            type="file"
            id="user-avatar-file-input"
            accept="image/png, image/jpg, image/jpeg, image/gif, image/svg"
            tabIndex={-1}
            onChange={(evnt) => {
              updloadAvatar()
            }}
          />
        </div>
      }
      {/* {uploading && <LoadingPopup />, document.body)} */}
    </>
  )
}

const AccountPage = ({ account }: any) => {
  const newEmailInput = useRef<HTMLInputElement>(null)
  const passwordInput = useRef<HTMLInputElement>(null)
  const [editEmailPopupVisible, setEditEmailPopupVisible] =
    useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const [openConfirmRemoveAccountPopup, setOpenConfirmRemoveAccountPopup] =
    useState<boolean>(false)
  const [closeConfirmRemoveAccountPopup, setCloseConfirmRemoveAccountPopup] =
    useState<boolean>(false)

  const togglePopupButton = useRef<HTMLDivElement>(null)
  const [popupActive, setPopupActive] = useState(false)
  const [popUpPos, setPopUpPos] = useState<{ x: number; y: number }>({
    x: -1000,
    y: -1000,
  })

  const onRemoveAccountClick = (e: any) => {
    setOpenConfirmRemoveAccountPopup(true)
    setPopupActive(false)
  }

  const togglePopup = () => {
    if (!togglePopupButton.current) {
      return
    }
    setPopUpPos({
      x: togglePopupButton.current.getBoundingClientRect().left,
      y: togglePopupButton.current.getBoundingClientRect().top,
    })
    setPopupActive(!popupActive)
  }

  const getName = () => {
    if (!account) {
      return ''
    }
    let fname = account.firstName ? account.firstName : ''
    let lname = account.familyName ? account.familyName : ''
    return `${fname} ${lname}`
  }

  return (
    <>
      <div className="account-hero"></div>
      <div className="account-form">
        <div className="inner">
          <div className="ac-picture">
            <div className="inner">
              <div className="ac-pic">
                <div
                  style={{ backgroundImage: `url('/account.png')` }}
                  className="img-pic"
                ></div>
              </div>
              <div
                ref={togglePopupButton}
                onClick={() => {
                  togglePopup()
                }}
                className="ctx-menu-btn"
              >
                <span>
                  <svg
                    width="5"
                    viewBox="0 0 5 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.41683 14.2503C4.41683 14.7774 4.229 15.2285 3.85333 15.6035C3.4783 15.9792 3.02725 16.167 2.50016 16.167C1.97308 16.167 1.5217 15.9792 1.14604 15.6035C0.77101 15.2285 0.583496 14.7774 0.583496 14.2503C0.583496 13.7232 0.77101 13.2722 1.14604 12.8972C1.5217 12.5215 1.97308 12.3337 2.50016 12.3337C3.02725 12.3337 3.4783 12.5215 3.85333 12.8972C4.229 13.2722 4.41683 13.7232 4.41683 14.2503ZM4.41683 8.50033C4.41683 9.02741 4.229 9.47846 3.85333 9.85349C3.4783 10.2292 3.02725 10.417 2.50016 10.417C1.97308 10.417 1.5217 10.2292 1.14604 9.85349C0.77101 9.47846 0.583496 9.02741 0.583496 8.50033C0.583496 7.97324 0.77101 7.52187 1.14604 7.1462C1.5217 6.77117 1.97308 6.58366 2.50016 6.58366C3.02725 6.58366 3.4783 6.77117 3.85333 7.1462C4.229 7.52187 4.41683 7.97324 4.41683 8.50033ZM4.41683 2.75033C4.41683 3.27741 4.229 3.72878 3.85333 4.10445C3.4783 4.47948 3.02725 4.66699 2.50016 4.66699C1.97308 4.66699 1.5217 4.47948 1.14604 4.10445C0.77101 3.72878 0.583496 3.27741 0.583496 2.75033C0.583496 2.22324 0.77101 1.77187 1.14604 1.3962C1.5217 1.02117 1.97308 0.833658 2.50016 0.833658C3.02725 0.833658 3.4783 1.02117 3.85333 1.3962C4.229 1.77187 4.41683 2.22324 4.41683 2.75033Z"
                      className="icon-fill"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </div>
          <div className="ac-name">
            <span contentEditable={true}>{getName()}</span>
          </div>
          <div className="ac-email">
            <div>Email</div>
            <div>
              <div className="ct">
                <input
                  disabled={true}
                  className="ac-in"
                  placeholder="Your email"
                  defaultValue={account.connections[0].providerUsername}
                />
                <span
                  onClick={(e) => {
                    setEditEmailPopupVisible(true)
                  }}
                >
                  <svg
                    width={21}
                    height={21}
                    viewBox="0 0 21 21"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <mask
                      id="mask0_2652_3560"
                      style={{
                        maskType: 'alpha',
                      }}
                      maskUnits="userSpaceOnUse"
                      x={0}
                      y={0}
                      width={21}
                      height={21}
                    >
                      <rect width={21} height={21} fill="#9CA3AF" />
                    </mask>
                    <g mask="url(#mask0_2652_3560)">
                      <path
                        d="M4.4625 16.5379H5.75312L13.1031 9.18789L11.8125 7.89727L4.4625 15.2473V16.5379ZM16.9969 7.91914L13.0813 4.00352L14.1531 2.93164C14.5177 2.56706 14.9516 2.38477 15.4547 2.38477C15.9578 2.38477 16.3917 2.56706 16.7563 2.93164L18.0688 4.24414C18.4187 4.59414 18.5938 5.02799 18.5938 5.5457C18.5938 6.06341 18.4187 6.49727 18.0688 6.84727L16.9969 7.91914ZM15.7063 9.20977L6.54062 18.3754H2.625V14.4598L11.7906 5.29414L15.7063 9.20977Z"
                        fill="#9CA3AF"
                      />
                    </g>
                  </svg>
                </span>
              </div>
            </div>
          </div>
          <div className="ac-signout">
            {/* <button>Signout</button> */}
            <Button type={ButtonType.Primary}>Signout</Button>
          </div>
        </div>
      </div>
      <Popup
        openSignal={editEmailPopupVisible}
        closeSignal={!editEmailPopupVisible}
        onClose={() => {
          setEditEmailPopupVisible(false)
        }}
        strict={true}
        noHeader={false}
        noCloseBtn={true}
        pstyle="small"
        zIndex={9999999999}
        title="Edit email"
      >
        <form
          onSubmit={(evnt) => {
            evnt.preventDefault()
            //   updateUserEmail();
          }}
          className={accountStyles.editUserEmailForm}
          style={{ color: 'var(--text-clr-75)' }}
        >
          <label>New email</label>
          <br />
          <input
            ref={newEmailInput}
            type="email"
            placeholder="Email"
            required
            className="ac-in"
            disabled={loading}
          />
          <input
            tabIndex={-1}
            type="password"
            className="ac-in"
            style={{ position: 'fixed', top: '-100vh' }}
            /*this input is just for browser password auto fill */
          />
          <label>Enter you password</label>
          <br />
          <input
            ref={passwordInput}
            type={'password'}
            placeholder="Password"
            className="ac-in"
            disabled={loading}
            required
          />
          <br />
          <div
            style={{
              textAlign: 'right',
              marginBottom: '10px',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 14,
            }}
          >
            <Button
              htmlType="button"
              // style={{ minWidth: "100px", margin: "0 10px" }}
              // color="neutral"
              disabled={loading}
              onClick={() => {
                setEditEmailPopupVisible(false)
              }}
            >
              Cancel
            </Button>
            <Button
              htmlType="submit"
              type={ButtonType.Primary}
              // style={{ minWidth: "100px" }}
              // color="primary"
              // loading={loading}
              disabled={loading}
            >
              Update
            </Button>
          </div>
        </form>
      </Popup>
      {popupActive && (
        <CtxMenu
          closeSignal={false}
          openSignal={popupActive}
          onCloseCallback={() => {
            setPopupActive(false)
          }}
          unid="assignAccount"
          ctxMenuPosition={popUpPos}
        >
          <UpdateUserAvatar
            closeCtxMenu={() => {
              setPopupActive(false)
            }}
          />
          <EditPassword />
          <CtxMenuItem
            action={onRemoveAccountClick}
            title="Remove Account"
            icon={
              <>
                <svg
                  width="21"
                  viewBox="0 0 21 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.6625 13.5625L10.5 11.725L12.3375 13.5625L13.5625 12.3375L11.725 10.5L13.5625 8.6625L12.3375 7.4375L10.5 9.275L8.6625 7.4375L7.4375 8.6625L9.275 10.5L7.4375 12.3375L8.6625 13.5625ZM10.5 19.25C8.47292 18.7396 6.79948 17.5766 5.47969 15.7609C4.1599 13.9453 3.5 11.9292 3.5 9.7125V4.375L10.5 1.75L17.5 4.375V9.7125C17.5 11.9292 16.8401 13.9453 15.5203 15.7609C14.2005 17.5766 12.5271 18.7396 10.5 19.25ZM10.5 17.4125C12.0167 16.9312 13.2708 15.9688 14.2625 14.525C15.2542 13.0813 15.75 11.4771 15.75 9.7125V5.57812L10.5 3.60938L5.25 5.57812V9.7125C5.25 11.4771 5.74583 13.0813 6.7375 14.525C7.72917 15.9688 8.98333 16.9312 10.5 17.4125Z"
                    fill="#9CA3AF"
                    className="icon-fill"
                  />
                </svg>
              </>
            }
          />
        </CtxMenu>
      )}
    </>
  )
}

export default AccountPage
