import { spawn } from 'node:child_process'

const children = [
  spawn(process.execPath, ['server/index.mjs'], { env: process.env, stdio: 'inherit' }),
  spawn(process.execPath, ['node_modules/vite/bin/vite.js'], { env: process.env, stdio: 'inherit' }),
]

let shuttingDown = false

const stop = (signal = 'SIGTERM') => {
  if (shuttingDown) return
  shuttingDown = true
  for (const child of children) child.kill(signal)
}

for (const child of children) {
  child.on('exit', (code) => {
    if (!shuttingDown && code !== 0) {
      stop()
      process.exitCode = code || 1
    }
  })
}

process.on('SIGINT', () => stop('SIGINT'))
process.on('SIGTERM', () => stop('SIGTERM'))
