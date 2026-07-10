import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// RTL's automatic cleanup only registers itself when vitest globals are
// enabled; with explicit imports we wire it up manually.
afterEach(cleanup)
