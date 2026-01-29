import next from "next";
// const dev = true
const dev = process.env["APP_MODE"] === "dev"
export const nextApp = next({ dev })
