'use client'

import { useEffect } from 'react'
import { useAtomValue } from 'jotai'
import { hasUnsavedChangesAtom } from '@/store/canvasAtoms'

export default function UnsavedChangesHandler() {
    const hasUnsavedChanges = useAtomValue(hasUnsavedChangesAtom)

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (hasUnsavedChanges) {
                e.preventDefault()
                const message = 'Changes you made may not be saved.'
                e.preventDefault()
                return message
            }
        }

        window.addEventListener('beforeunload', handleBeforeUnload)
        return () => window.removeEventListener('beforeunload', handleBeforeUnload)
    }, [hasUnsavedChanges])

    return null
} 