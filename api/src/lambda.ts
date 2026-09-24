import { handle } from 'hono/aws-lambda'

const { app } = await import('./index.js')

export const handler = handle(app)
