"use client"

// Inspired by react-hot-toast library
import * as React from "react"

import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 5000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_VALUE
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: string
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: string
    }

interface State {
  toasts: ToasterToast[]
}

const ToastContext = React.createContext<{
  toasts: ToasterToast[]
  toast: (props: ToastProps) => void
  dismiss: (toastId?: string) => void
} | undefined>(undefined)

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      if (toastId) {
        return {
          ...state,
          toasts: state.toasts.map((t) =>
            t.id === toastId
              ? {
                  ...t,
                  open: false,
                }
              : t
          ),
        }
      }
      
      return {
        ...state,
        toasts: state.toasts.map((t) => ({
          ...t,
          open: false,
        })),
      }
    }
    
    case "REMOVE_TOAST": {
      const { toastId } = action

      if (toastId) {
        return {
          ...state,
          toasts: state.toasts.filter((t) => t.id !== toastId),
        }
      }

      return {
        ...state,
        toasts: [],
      }
    }
  }
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<State>({ toasts: [] })

  const toast = (props: ToastProps) => {
    const id = genId()
    const newToast: ToasterToast = { ...props, id, open: true }
    
    setState((state) => ({
      ...state,
      toasts: [newToast, ...state.toasts].slice(0, TOAST_LIMIT),
    }))
    
    setTimeout(() => {
      setState((state) => ({
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === id ? { ...t, open: false } : t
        ),
      }))
      
      setTimeout(() => {
        setState((state) => ({
          ...state,
          toasts: state.toasts.filter((t) => t.id !== id),
        }))
      }, 1000)
    }, TOAST_REMOVE_DELAY)
    
    return id
  }
  
  const dismiss = (toastId?: string) => {
    setState((state) => ({
      ...state,
      toasts: state.toasts.map((t) =>
        toastId === undefined || t.id === toastId
          ? { ...t, open: false }
          : t
      ),
    }))
  }

  return React.createElement(
    ToastContext.Provider, 
    { value: { toasts: state.toasts, toast, dismiss } },
    children
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  
  return context
}
