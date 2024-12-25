import { atom } from 'jotai'

type SaveFunction = () => Promise<void>

export const saveFunctionAtom = atom<SaveFunction | null>(null)