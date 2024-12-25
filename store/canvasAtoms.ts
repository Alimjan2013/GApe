import { atom } from 'jotai'

type SaveFunction = () => Promise<void>

export const saveFunctionAtom = atom<SaveFunction | null>(null)
export const hasUnsavedChangesAtom = atom<boolean>(false)
export const columnCountAtom = atom<number>(3) // Default to PC view (3 columns) 