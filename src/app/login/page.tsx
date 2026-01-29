import React, { useEffect } from 'react';
import LoginForm from '../LoginForm';

const LoginPage = (params: any) => {
  const { logo, name, color, sessionId, sessionType, userAppUrl, appURL, ccLogo, ccName, ccColor, ccId } = params.searchParams;

  console.log("P :: ", params)

  return (
    <LoginForm loginProps={{
      logo: logo,
      name: name,
      color: color,
      sessionId: sessionId,
      sessionType: sessionType,
      appURL: appURL,
      userAppUrl: userAppUrl,
      ccLogo: ccLogo,
      ccName: ccName,
      ccColor: ccColor,
      ccId: ccId
    }} />
  )
  // return (
  //   <div>
  //     {/* Your Next.js page content using the received props */}
  //     <p>Logo: {logo}</p>
  //     <p>Name: {name}</p>
  //     <p>Color: {color}</p>
  //     <p>Session ID: {sessionId}</p>
  //     <h1>Login page</h1>
  //   </div>
  // );
};

export default LoginPage;
