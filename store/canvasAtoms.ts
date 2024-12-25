import { atom } from 'jotai'

type SaveFunction = () => Promise<void>

export const saveFunctionAtom = atom<SaveFunction | null>(null)
export const hasUnsavedChangesAtom = atom<boolean>(false) 