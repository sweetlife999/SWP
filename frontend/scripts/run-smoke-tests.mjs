import { spawnSync } from 'node:child_process'

const args = ['playwright', 'test']

if (process.env.CI) {
  args.push('--reporter=github')
}

const result = spawnSync('npx', args, {
  stdio: 'inherit',
  shell: true,
})

process.exit(result.status ?? 1)