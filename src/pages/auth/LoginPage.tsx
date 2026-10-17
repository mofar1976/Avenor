import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { Navigate, useSearchParams } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '@/hooks/auth/use-auth'
import { useLogin } from '@/hooks/auth/use-login'
import { useLanguage } from '@/hooks/use-language'
import { usePageMetadata } from '@/hooks/use-page-metadata'
import { FormField } from '@/components/ui/form-field'
import { Button } from '@/components/ui/button'
import { RequestError } from '@/utils/http'
import type { LoginValues } from '@/entities/auth/auth'

export function LoginPage() {
  const { t } = useTranslation('auth')
  const language = useLanguage()
  const [params] = useSearchParams()
  // Only supported internal destinations can be used after login.
  const destination =
    params.get('redirect') === 'checkout' ? 'checkout' : 'account'
  const { session } = useAuth()
  const { login, pending } = useLogin()
  const [issue, setIssue] = useState<'credentials' | 'network' | null>(null)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ defaultValues: { username: '', password: '' } })
  usePageMetadata(`${t('login')} — AVENOR`, t('description'))
  if (session) return <Navigate replace to={`/${language}/${destination}`} />
  const busy = pending || isSubmitting
  return (
    <section className="content-page" aria-labelledby="login-title">
      <div className="mx-auto max-w-md">
        <p className="eyebrow">AVENOR · {t('demoLabel')}</p>
        <h1 id="login-title" className="text-5xl sm:text-6xl">
          {t('login')}
        </h1>
        <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
          {t('demoNotice')}
        </p>
        {destination === 'checkout' && (
          <p role="status" className="mb-6 text-sm leading-relaxed">
            {t('checkoutRequired')}
          </p>
        )}
        <form
          noValidate
          onSubmit={(event) => {
            if (busy) {
              event.preventDefault()
              return
            }
            void handleSubmit(async (values) => {
              setIssue(null)
              try {
                await login({
                  username: values.username.trim(),
                  password: values.password,
                })
              } catch (error) {
                setIssue(
                  error instanceof RequestError &&
                    (error.status === 400 || error.status === 401)
                    ? 'credentials'
                    : 'network',
                )
              }
            })(event)
          }}
        >
          <fieldset disabled={busy} className="grid gap-5 disabled:opacity-70">
            <legend className="sr-only">{t('login')}</legend>
            <FormField
              label={t('username')}
              autoComplete="username"
              required
              maxLength={100}
              error={errors.username ? t('required') : undefined}
              {...register('username', {
                validate: (value) => value.trim().length > 0,
              })}
            />
            <FormField
              label={t('password')}
              type="password"
              autoComplete="current-password"
              required
              maxLength={200}
              error={errors.password ? t('required') : undefined}
              {...register('password', { required: true })}
            />
            {issue && (
              <p role="alert" className="text-sm text-destructive">
                {t(`errors.${issue}`)}
              </p>
            )}
            <Button type="submit">{t(busy ? 'submitting' : 'login')}</Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIssue(null)
                reset({ username: 'emilys', password: 'emilyspass' })
              }}
            >
              {t('fillDemo')}
            </Button>
          </fieldset>
          <p role="status" className="sr-only">
            {busy ? t('submitting') : ''}
          </p>
        </form>
        <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
          {t('sessionNotice')}
        </p>
      </div>
    </section>
  )
}
