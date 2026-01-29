const VERIFICATION_EMAIL_TEMPLATE = (code: string, link_id: string) => {
  return `
  <!DOCTYPE html>
<html lang="en">
<body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
    <div style="padding: 20px; text-align: left;">
        Verification Code: ${code}        
    </div>
    
</body>
</html>`;
//   return `
//   <!DOCTYPE html>
// <html lang="en">
// <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
//     <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
//         <h2>LoginSign Verification Code</h2>
        
//         Verification Code: ${code}
        
//         <p>Click the button below to confirm the code automatically.</p>
        
//         <a href="https://loginsign.com/oauth/verify_code?code=${code}&reqd=${link_id}" style="display: inline-block; padding: 12px 24px; background-color: #055491; color: #fff; text-decoration: none; border-radius: 9px; font-size: 16px;">Confirm Code</a>
//     </div>
// </body>
// </html>`;
  return `
        <!DOCTYpe html>
        <html>
            <head>
                <title>LoginSign account verification</title>
                <style>
                  body{
                    margin: 0;
                    padding: 0;
                  }
                  .container{
                    width: 100%;
                    min-height: 100vh;
                    background: transparent;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-start;
                    align-items: flex-start;
                    gap: 10px;
                    padding: 30px;
                  }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="msg">
                        <h1>Confirmation code:</h1>
                    </div>
                    <div class="otp">
                        <span>${code}</span>
                    </div>
                    
                </div>
            </body>
        </html>
    `
}

export default VERIFICATION_EMAIL_TEMPLATE
