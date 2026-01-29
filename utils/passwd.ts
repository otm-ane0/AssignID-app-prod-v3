import bcrypt from 'bcrypt'
import JWT from 'jsonwebtoken'
/**
 * encrypt account passcode
 */
export async function encryptPasscode(raw: string) {
    const salt = await bcrypt.genSalt(10)
    const passcode = await bcrypt.hash(raw, salt)
    return passcode
}

/** BOokaekr */
// const verifyJwt = async (token: string) => {
//     try {
//         console.log("X :: ", process.env["BK_PWD_ENV"])
//     //   const publicKey = process.env["BK_PWD_ENV"] || "";
//     //   const decoded = JWT.verify(token, publicKey);
//     //   return decoded;
//     return await bcrypt.compare();
//     } catch (error) {
//       console.log(error);
//       return null;
//     }
//   };

/**
 * validate/verify account passcode
 */
export async function verifyPasscode(raw: string, encrypted: string) {
    let pwd = encrypted;
    if(encrypted.startsWith('bk:')){
        pwd = encrypted.slice(3, encrypted.length);
    }
    return await bcrypt.compare(raw, pwd)
}
