import type { DefineCursor } from 'ani-cursor'
declare module 'ani-cursor' {
  export const defineCursor: DefineCursor
  interface CursorConfig {
    basePath: string
    default: string
    pointer: string
    hover: string[]
    interval?: number
  }
}
interface CursorConfig {
  basePath: string
  default: string
  pointer: string
  hover: string[]
}
