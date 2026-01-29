export class Runtime {
  static getTwitterClientID() {
    return process.env['TWITTER_CLIENT_ID'] || ''
  }

  static getTwitterClientSecret() {
    return process.env['TWITTER_CLIENT_SECRET'] || ''
  }

  static getTwitterCallbackURL() {
    return `${Runtime.getAppURL()}/oauth/x_callback`
  }

  static getGoogleClientID() {
    return process.env['GOOGLE_CLIENT_ID'] || ''
  }

  static getGoogleClientSecret() {
    return process.env['GOOGLE_CLIENT_SECRET'] || ''
  }

  static getAppURL() {
    return process.env['APP_URI'] || ''
  }

  static getGoogleCallbackURL() {
    return `${Runtime.getAppURL()}/oauth/google_callback`
  }

  static getFacebookClientID() {
    return process.env['FACEBOOK_CLIENT_ID'] || ''
  }

  static getFacebookClientSecret() {
    return process.env['FACEBOOK_CLIENT_SECRET'] || ''
  }

  static getFacebookCallbackURL() {
    return `${Runtime.getAppURL()}/oauth/facebook_callback`
  }
}
