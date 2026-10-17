import { useEffect, useRef } from 'react'
import { useMutation } from '@tanstack/react-query'
import { authenticate } from '@/services/auth/auth'
import { useAuth } from '@/hooks/auth/use-auth'
import type { LoginValues } from '@/entities/auth/auth'

export function useLogin() {
  const { signIn } = useAuth()
  const request = useRef<AbortController | null>(null)
  useEffect(() => () => request.current?.abort(), [])
  const mutation = useMutation({
    mutationFn: async (values: LoginValues) => {
      request.current?.abort()
      const controller = new AbortController()
      request.current = controller
      const session = await authenticate(values, controller.signal)
      if (controller.signal.aborted)
        throw new DOMException('Aborted', 'AbortError')
      signIn(session)
    },
    retry: false,
    networkMode: 'always',
    gcTime: 0,
  })
  return {
    login: mutation.mutateAsync,
    pending: mutation.isPending,
  }
}
