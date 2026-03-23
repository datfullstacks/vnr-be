import { spawn } from 'node:child_process'

const port = process.env.PORT || '3001'

const child = spawn('npx', ['next', 'start', '-p', port], {
  env: process.env,
  shell: true,
  stdio: 'inherit',
})

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal)
    return
  }

  process.exit(code ?? 0)
})
