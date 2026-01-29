import express from 'express';
import passport from 'passport';
import { Strategy as NativeStrategy } from 'passport-local';
import { Runtime } from '../runtime';

passport.use(
    new NativeStrategy(
        {
            usernameField: 'email',
            passwordField: 'passwd'
        },
        function (username, password, done) {
            console.log("username ::: ", username, "password ::: ", password);

            /**
             * if account found and have logined in this browser ever then just login.
             * if account found and have never logine din this browser ask email otp.
             * if new user ask password + otp.
             */
            
            let parsed = username.split("/");

            const user = {
                email: parsed[0],
                password: password,
                login_cookie: parsed[1] === "0" ? null : parsed[1],
                challenge_type: parsed[2]
            }

            console.log('user ::: ', user);

            done(null, user);

        }
    )
)

export default passport