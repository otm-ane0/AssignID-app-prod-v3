// import { useEffect, useRef, useState } from 'react'
// import accountStyles from './account.module.scss'
// import createPortal from 'react'
// import { Popup } from './Popup'
// import Button from './Button'

export default function Account({}: any) {
  return <></>
}

// export default function Account({ account }: { account: any }) {
//   // const authCtx = useAuthContext();

//   const [openConfirmRemoveAccountPopup, setOpenConfirmRemoveAccountPopup] =
//     useState<boolean>(false)
//   const [closeConfirmRemoveAccountPopup, setCloseConfirmRemoveAccountPopup] =
//     useState<boolean>(false)

//   const togglePopupButton = useRef<HTMLButtonElement>(null)
//   const [popupActive, setPopupActive] = useState(false)
//   const [popUpPos, setPopUpPos] = useState<{ x: number; y: number }>({
//     x: -1000,
//     y: -1000,
//   })

//   const onLogout = async () => {
//     //   logout();
//   }

//   const onRemoveAccountClick = (e: any) => {
//     setOpenConfirmRemoveAccountPopup(true)
//     setPopupActive(false)
//   }

//   const togglePopup = () => {
//     if (!togglePopupButton.current) {
//       return
//     }
//     setPopUpPos({
//       x: togglePopupButton.current.getBoundingClientRect().left,
//       y: togglePopupButton.current.getBoundingClientRect().top,
//     })
//     setPopupActive(!popupActive)
//   }

//   // if (!authCtx.state.initialized || !authCtx.state.user.email) {
//   //   return <></>;
//   // }

//   return (
//     <>
//       <div className={accountStyles.pageContainer}>
//         <div className={accountStyles.hdrCover}></div>
//         <div className={accountStyles.accountContainer}>
//           <div className={accountStyles.accountContainerInner}>
//             <div className={accountStyles.accountContainerAccountPreviewHdr}>
//               <UserAvatar
//                 src={account.picture ? `/p/${account.picture}` : '/account.png'}
//               />
//               <UserName account={account} />
//             </div>
//             <UserEmail account={account} />
//             {/* <AccountSection title="">
//                 <button
//                   onClick={onLogout}
//                   className={accountStyles.accountTextButton}
//                 >
//                   <span>Signout</span>
//                 </button>
//               </AccountSection> */}
//           </div>
//         </div>
//       </div>
//       {/* <ConfirmRemoveAccountPopup
//           openSignal={openConfirmRemoveAccountPopup}
//           closeSignal={closeConfirmRemoveAccountPopup}
//           onClose={() => {
//             if (!closeConfirmRemoveAccountPopup) {
//               setCloseConfirmRemoveAccountPopup(true);
//               setOpenConfirmRemoveAccountPopup(false);
//               setPopupActive(true);
//             } else {
//               setOpenConfirmRemoveAccountPopup(false);
//               setCloseConfirmRemoveAccountPopup(false);
//             }
//           }}
//         /> */}
//     </>
//   )
// }

// const UserAvatar = ({ src }: any) => {
//   // const userInfoCtx = useUserInfoContext();
//   const userAvatar = (() => {
//     //   if (userInfoCtx.state.avatar) {
//     //     try {
//     //       let url = new URL(userInfoCtx.state.avatar);
//     //       return userInfoCtx.state.avatar;
//     //     } catch (err) {
//     //       return `${apiBase}/user/picture/${userInfoCtx.state.avatar}`;
//     //     }
//     //   }
//     return '/imgs/avatar.svg'
//   })()
//   return (
//     <div
//       className={accountStyles.accountContainerAccountPreviewHdrUserImage}
//       style={{ backgroundImage: `url(${src})` }}
//     ></div>
//   )
// }

// const UserName = ({ account }: any) => {
//   const getName = () => {
//     return `${account.firstName ? account.firstName : ''} ${account.lastName ? account.lastName : ''}`.trim()
//   }

//   // const userInfoCtx = useUserInfoContext();
//   const userNameInput = useRef<HTMLInputElement>(null)
//   const lastSavedUserName = useRef<string>(getName() || '')
//   const [userName, setUserName] = useState<string>(getName() || '')
//   const [loading, setLoading] = useState<boolean>(false)

//   // useEffect(() => {
//   //   setUserName(userInfoCtx.state.name);
//   // }, [userInfoCtx.state.name]);

//   function saveUserName() {
//     if (!userNameInput.current) {
//       return
//     }
//     let newUserName = userNameInput.current.value.trim()
//     if (lastSavedUserName.current === newUserName) {
//       return
//     }
//     if (newUserName.length === 0) {
//       setUserName(lastSavedUserName.current)
//       return
//     }
//     setLoading(true)
//     //   callApi({ method: "patch", path: apiBase + "/user", payload: { name: newUserName } })
//     //     .then((res) => {
//     //       if (res.status === 200) {
//     //         lastSavedUserName.current = newUserName;
//     //       } else {
//     //         alert("Error updating user name!");
//     //       }
//     //     })
//     //     .catch((err) => {
//     //       alert("Error updating user name!");
//     //     })
//     //     .finally(() => {
//     //       setLoading(false);
//     //     });
//   }

//   return (
//     <form
//       onSubmit={(evnt) => {
//         evnt.preventDefault()
//         saveUserName()
//       }}
//     >
//       <input
//         ref={userNameInput}
//         tabIndex={-1}
//         className={accountStyles.accountContainerAccountPreviewHdrUserName}
//         value={userName}
//         disabled={loading}
//         onChange={(evnt) => {
//           setUserName(evnt.target.value.substring(0, 20))
//         }}
//         onBlur={(evnt) => {
//           saveUserName()
//         }}
//         onFocus={(evnt) => {
//           evnt.target.setSelectionRange(0, evnt.target.value.length)
//         }}
//       />
//       <input type="submit" style={{ display: 'none' }} />
//     </form>
//   )
// }

//   const UpdateUserAvatar = ({ closeCtxMenu }: { closeCtxMenu: () => void }) => {
//     // const userInfoCtx = useUserInfoContext();
//     const inputFileLabel = useRef<HTMLLabelElement>(null);
//     const inputFile = useRef<HTMLInputElement>(null);
//     const [uploading, setUploading] = useState<boolean>(false);

//     function updateAvatar() {
//       if (!inputFileLabel.current) {
//         return;
//       }
//       inputFileLabel.current.click();
//     }

//     function updloadAvatar() {
//       if (!inputFile.current || !inputFile.current.files) {
//         return;
//       }
//       if (inputFile.current.files.length > 1) {
//         alert("please select just one file ");
//         return;
//       } else if (inputFile.current.files.length === 0) {
//         alert("please select a file ");
//         return;
//       }
//       var fd = new FormData();
//       fd.append("file", inputFile.current.files[0]);
//       setUploading(true);
//     //   callApi({
//     //     method: "patch",
//     //     headers: { "content-type": "multipart/form-data" },
//     //     path: apiBase + "/user/picture",
//     //     payload: fd,
//     //   })
//     //     .then((r) => {
//     //       if (r.status === 200) {
//     //         userInfoCtx.methods.setAvatar(r.data.picture);
//     //       } else if (r.status === 415) {
//     //         alert("file type not supported, Please select another file!");
//     //       } else {
//     //         alert("Error uploading file, please try again!");
//     //       }
//     //     })
//     //     .catch((e) => {
//     //       //alert('ERROR')
//     //       alert("Error uploading file, please try again!");
//     //       console.log(e);
//     //     })
//     //     .finally(() => {
//     //       setUploading(false);
//     //       if (!inputFile.current) {
//     //         return;
//     //       }
//     //       inputFile.current.value = "";
//     //       closeCtxMenu();
//     //     });
//     }

//     return (
//       <>
//         <CtxMenuItem
//           title={"Change Picture"}
//           icon={<Icons.AvatarIcon />}
//           action={updateAvatar}
//         />
//         {createPortal(
//           <div style={{ display: "none" }}>
//             <label
//               ref={inputFileLabel}
//               htmlFor="user-avatar-file-input"
//             />
//             <input
//               ref={inputFile}
//               type="file"
//               id="user-avatar-file-input"
//               accept="image/png, image/jpg, image/jpeg, image/gif, image/svg"
//               tabIndex={-1}
//               onChange={(evnt) => {
//                 updloadAvatar();
//               }}
//             />
//           </div>,
//           document.body
//         )}
//         {/* {uploading && <LoadingPopup />, document.body)} */}
//       </>
//     );
//   };

// //   const EditPassword = () => {
// //     const authCtx = useAuthContext();
// //     const [loading, setLoading] = useState<boolean>(false);
// //     const [resetPasswordRequestSent, setResetPasswordRequestSent] = useState<boolean>(false);

// //     async function requestResetPassword() {
// //       let email = authCtx.state.user.email;
// //       if (!email) {
// //         return;
// //       }
// //       setResetPasswordRequestSent(false);
// //       setLoading(true);
// //       try {
// //         let response = await callApi({
// //           path: ApiPaths.requestResetPassword,
// //           method: "post",
// //           payload: {
// //             email: email,
// //           },
// //         });
// //         if (response.response) {
// //           response = response.response;
// //         }
// //         if (response.status === 200) {
// //           setResetPasswordRequestSent(true);
// //         } else {
// //           window.alert("Something went wrong!");
// //         }
// //       } catch (err) {
// //         window.alert("Something went wrong!");
// //       }
// //       setLoading(false);
// //     }

// //     return (
// //       <>
// //         <CtxMenuItem
// //           title={"Change password"}
// //           icon={<Icons.LockIcon />}
// //           action={requestResetPassword}
// //         />
// //         {loading && createPortal(<LoadingPopup />, document.body)}
// //         {resetPasswordRequestSent &&
// //           createPortal(
// //             <Popup
// //               openSignal={resetPasswordRequestSent}
// //               closeSignal={!requestResetPassword}
// //               onClose={() => {}}
// //               strict={true}
// //               noHeader={true}
// //               noCloseBtn={true}
// //               pstyle="small"
// //               zIndex={9999999999}
// //             >
// //               <>
// //                 <div style={{ color: "var(--text-clr-75)", padding: "10px", lineHeight: "1.6", marginBottom: "4px" }}>
// //                   Password reset request was sent successfully, please check your email to reset your password.
// //                 </div>
// //                 <div style={{ padding: "10px", textAlign: "right" }}>
// //                   <Button
// //                     onClick={() => {
// //                       setResetPasswordRequestSent(false);
// //                     }}
// //                     style={{ minWidth: "100px" }}
// //                     color="primary"
// //                   >
// //                     Done
// //                   </Button>
// //                 </div>
// //               </>
// //             </Popup>,
// //             document.body
// //           )}
// //       </>
// //     );
// //   };

// const UserEmail = ({ account }: any) => {
//   const newEmailInput = useRef<HTMLInputElement>(null)
//   const passwordInput = useRef<HTMLInputElement>(null)
//   const [editEmailPopupVisible, setEditEmailPopupVisible] =
//     useState<boolean>(false)
//   const [loading, setLoading] = useState<boolean>(false)

//   async function updateUserEmail() {
//     if (!newEmailInput.current || !passwordInput.current) {
//       return
//     }
//     let newEmail = newEmailInput.current.value.trim()
//     let password = passwordInput.current.value.trim()
//     if (!newEmail || !password) {
//       return
//     }
//     setLoading(true)
//     //   callApi({
//     //     path: apiBase + "/user/update-email",
//     //     method: "patch",
//     //     payload: {
//     //       email: newEmail,
//     //       code: password,
//     //     },
//     //   })
//     //     .then((res) => {
//     //       if (res.response) {
//     //         res = res.response;
//     //       }
//     //       if (res.status === 200) {
//     //         userInfoCtx.methods.setEmail(newEmail);
//     //         setEditEmailPopupVisible(false);
//     //         document.location.reload();
//     //       } else {
//     //         if (res.data.message === "invalid password") {
//     //           alert("Incorrect password!");
//     //         } else if (res.data.message === "email exist") {
//     //           alert("Email already exist!");
//     //         } else {
//     //           alert("Something went wrong!");
//     //         }
//     //       }
//     //     })
//     //     .catch((err) => {
//     //       alert("Something went wrong!");
//     //     })
//     //     .finally(() => {
//     //       setLoading(false);
//     //     });
//   }

//   // if (userInfoCtx.state.email === DEMO_USER_EMAIL) {
//   //   return <></>;
//   // }

//   return (
//     <>
//       <div className={accountStyles.userEmailForm}>
//         <label>Email</label>
//         <br />
//         <span className={accountStyles.userEmailInputContainer}>
//           <input
//             type={'email'}
//             value={account.connections[0].providerUsername || ''}
//             className={accountStyles.userEmailInput}
//             disabled={true}
//           />
//           <span
//             className={accountStyles.editUserEmailBtn}
//             onClick={() => {
//               setEditEmailPopupVisible(true)
//             }}
//           >
//             {/* <Icons.EditIcon /> */}
//           </span>
//         </span>
//         <br />
//       </div>
//       {editEmailPopupVisible && (
//         <Popup
//           openSignal={editEmailPopupVisible}
//           closeSignal={!editEmailPopupVisible}
//           onClose={() => {
//             setEditEmailPopupVisible(false)
//           }}
//           strict={true}
//           pstyle="small"
//           noCloseBtn={true}
//           title="Edit email"
//         >
//           <>
//             <form
//               onSubmit={(evnt) => {
//                 evnt.preventDefault()
//                 updateUserEmail()
//               }}
//               className={accountStyles.editUserEmailForm}
//               style={{ color: 'var(--text-clr-75)' }}
//             >
//               <label>New email</label>
//               <br />
//               <input
//                 ref={newEmailInput}
//                 type="email"
//                 placeholder="Email"
//                 required
//                 disabled={loading}
//               />
//               <input
//                 tabIndex={-1}
//                 type="password"
//                 style={{ position: 'fixed', top: '-100vh' }}
//                 /*this input is just for browser password auto fill */
//               />
//               <label>Enter you password</label>
//               <br />
//               <input
//                 ref={passwordInput}
//                 type={'password'}
//                 placeholder="Password"
//                 disabled={loading}
//                 required
//               />
//               <br />
//               <div style={{ textAlign: 'right', marginBottom: '10px' }}>
//                 <Button
//                       htmlType="button"
//                     //   style={{ minWidth: "100px", margin: "0 10px" }}
//                     //   color="neutral"
//                     //   disabled={loading}
//                       onClick={() => {
//                         setEditEmailPopupVisible(false);
//                       }}
//                       label='Cancel'
//                     >

//                     </Button>
//                     <Button
//                       htmlType="submit"
//                     //   style={{ minWidth: "100px" }}
//                     //   color="primary"
//                     //   loading={loading}
//                     //   disabled={loading}
//                       label='Update'
//                     >
//                     </Button>
//               </div>
//             </form>
//           </>
//         </Popup>
//       )}
//     </>
//   )
// }

//   const AccountSection = ({
//     title,
//     children,
//     rightItem,
//   }: {
//     title?: string;
//     children: JSX.Element | Array<JSX.Element>;
//     rightItem?: JSX.Element;
//   }) => {
//     return (
//       <div className={accountStyles.accountContainerSectionContainer}>
//         {title && (
//           <div className={accountStyles.accountContainerSectionTitle}>
//             <span>{title}</span>
//             {rightItem && <span>{rightItem}</span>}
//           </div>
//         )}
//         <div className={accountStyles.accountContainerSectionContent}>{children}</div>
//       </div>
//     );
//   };

//   const ConfirmRemoveAccountPopup = ({
//     closeSignal,
//     openSignal,
//     onClose,
//   }: {
//     closeSignal: boolean;
//     openSignal: boolean;
//     onClose: Function;
//   }) => {
//     const [loading, setLoading] = useState<boolean>(false);
//     function closeAccount() {
//     //   callApi({ method: "delete", path: apiBase + "/user/close-account" })
//     //     .then(() => {
//     //       try {
//     //         localStorage.clear();
//     //       } catch (e) {}
//     //       document.cookie = CookiesList.accessToken + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
//     //       document.location = "/";
//     //     })
//     //     .catch(() => {
//     //       alert("We couldn't remove your account, please  try again");
//     //     });
//     }
//     return (
//       <>
//         <Popup
//           closeSignal={closeSignal}
//           onClose={onClose}
//           openSignal={openSignal}
//           fixedSize={true}
//           strict={true}
//           title={"Delete account"}
//           icon={<Icons.GppBadIcon />}
//         >
//           <>
//             <p className={accountStyles.confirmDeleteAccountDescription}>
//               Are you sure you want to continue with this step? You will not be able to undo this action. Please note that
//               deleting your account will also delete all public links. You will lose all your bookmarks and data.
//             </p>
//             <div className={accountStyles.confirmDeleteAccountActions}>
//               <div
//                 className={accountStyles.confirmRemoveAccountBtn}
//                 onClick={() => {
//                   setLoading(true);
//                   closeAccount();
//                 }}
//               >
//                 Yes, delete account
//               </div>
//               <div
//                 className={accountStyles.cancelRemoveAccountBtn}
//                 onClick={() => {
//                   onClose();
//                 }}
//               >
//                 No, go back
//               </div>
//             </div>
//           </>
//           {loading && createPortal(<LoadingPopup />, document.getElementById("popups-container") || document.body)}
//         </Popup>
//       </>
//     );
//   };
