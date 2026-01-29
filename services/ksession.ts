// ksession.js

import { NextFunction, Request, Response } from 'express'

const sessions: {
  [key: string]: any
} = {} // In-memory storage for session data

// Function to generate a random session ID
function generateSessionId() {
  return Math.random().toString(36).substr(2, 10)
}

// Middleware to create and manage sessions
function ksessionMiddleware(
  req: Request & any,
  res: Response & any,
  next: NextFunction & any,
) {
  // Check if the user has a session ID cookie
  if (!req.cookies.ksessionId) {
    // If not, create a new session
    const ksessionId = generateSessionId()
    req.cookies.ksessionId = ksessionId // Store session ID in a cookie
    sessions[ksessionId] = {} // Initialize an empty session object
  }

  // Attach session data to the request object
  req.ksession = sessions[req.cookies.ksessionId]

  // Middleware for session cleanup (e.g., expiration)
  // You can implement this based on your needs

  next()
}

export default ksessionMiddleware
