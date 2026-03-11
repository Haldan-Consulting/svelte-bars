import { writable } from 'svelte/store'

export type OEEData = {
  availability: number
  performance: number
  quality: number
}

export const factoryData = writable<OEEData>({
  availability: 94,
  performance: 84,
  quality: 99
})