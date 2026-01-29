import React from 'react';
import LoginForm from '../LoginForm';

const LoginPage = (params: any) => {
  const { logo, name, color, sessionId, sessionType, userAppUrl, appURL, ccLogo, ccName, ccColor, ccId, firstName, lastName, picture, email } = params.searchParams;
  return (
    <LoginForm loginProps={{
      logo: logo,
      name: name,
      color: color,
      sessionId: sessionId,
      sessionType: sessionType,
      userAppUrl: userAppUrl,
      appURL: appURL,
      ccLogo: ccLogo,
      ccName: ccName,
      ccColor: ccColor,
      ccId: ccId,
      firstName: firstName,
      lastName: lastName,
      picture: picture,
      email: email
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
