export const isLogEnabled: boolean = true
const appLog: Console | any = isLogEnabled ? console : {}
export default appLog
