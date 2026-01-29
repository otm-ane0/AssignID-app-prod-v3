import React from 'react';
import RedirectForm from '../RedirectForm';

const RedirectPage = (params: any) => {
  const { logo, name, color, sessionId, appURL } = params.searchParams;
  return (
    <RedirectForm loginProps={params.searchParams} />
  )
};

export default RedirectPage;
