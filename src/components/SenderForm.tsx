import { useEffect, useState, useRef, type FormEvent } from 'react'
import { Link } from './Link'
import { getCookie, setCookie } from '../utils/cookies'
import styles from './SenderForm.module.css'

const SENDER_API_KEY = import.meta.env.PUBLIC_SENDER_API_KEY
const SENDER_GROUP_ID = import.meta.env.PUBLIC_SENDER_GROUP_ID

type FormState = {
    isSubscribing: boolean,
    message: string,
    isError: boolean,
}

type SenderFormProps = {
    isHidden: boolean,
}

export const SenderForm = ({ isHidden, }: SenderFormProps) => {
    const formRef = useRef<HTMLFormElement>(null)
    const [formState, setFormState] = useState<FormState>({
        isSubscribing: false,
        message: '',
        isError: false,
    })

    const validateEmail = (email: string): boolean => {
        return Boolean(email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
    }

    const showMessage = (message: string, isError = false) => {
        setFormState(prev => ({ ...prev, message, isError }))
    }

    const toggleLoading = (loading: boolean) => {
        setFormState(prev => ({ ...prev, isSubscribing: loading }))
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        e.stopPropagation()

        if (formState.isSubscribing) {
            return false
        }

        const formData = new FormData(e.currentTarget)
        const name = formData.get('name') as string
        const email = formData.get('email') as string

        if (!validateEmail(email)) {
            showMessage('Proszę podać prawidłowy adres email', true)
            return
        }

        if (name.length < 2) {
            showMessage('Imię musi mieć co najmniej 2 znaki', true)
            return
        }

        toggleLoading(true)

        try {
            const response = await fetch('https://api.sender.net/v2/subscribers', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${SENDER_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    firstname: name,
                    groups: [SENDER_GROUP_ID],
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Błąd subskrypcji')
            }

            showMessage('Dzięki za zapisanie się do newslettera!')
            formRef.current?.reset()
            setCookie('senderSubscribed', 'true', 365)
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);

            console.error(message)
            showMessage(
                message === 'Extension context invalidated'
                    ? 'Przepraszamy, wystąpił błąd. Odśwież stronę i spróbuj ponownie.'
                    : 'Coś poszło nie tak. Spróbuj ponownie.',
                true,
            )
        } finally {
            toggleLoading(false)
        }
    }

    if (isHidden) return null

    return (
        <div className="w-96 mx-auto mt-8 p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-black dark:text-white mb-2">
                    Bądź na bieżąco!
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                    Zapisz się, aby otrzymywać najnowsze artykuły prosto na swoją skrzynkę.
                </p>
            </div>
            <form ref={formRef} id="senderForm" className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                    <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        minLength={2}
                        placeholder="Twoje imię"
                        className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-md focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-slate-900 text-black dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                        aria-label="Twoje imię"
                    />
                </div>
                <div className="space-y-2">
                    <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        placeholder="twoj@email.pl"
                        className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-md focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-slate-900 text-black dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                        aria-label="Twój adres email"
                    />
                </div>
                <div className="space-y-4 flex flex-col items-center">
                    <button
                        type="submit"
                        disabled={formState.isSubscribing}
                        className="button bg-primary hover:bg-primary/80 py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center space-x-2 border border-slate-200 dark:border-slate-800"
                    >
                        <span>Zapisz się</span>
                        {formState.isSubscribing && (
                            <span className={`${styles.loadingSpinner} h-4 w-4 border-2 border-white border-t-transparent rounded-full`} />
                        )}
                    </button>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
                    Zapisując się akceptujesz{' '}
                    <Link href="/privacy">Politykę Prywatności</Link>
                </p>
                {
                    formState.message && (
                        <div
                            className={`message text-center font-medium ${formState.isError
                                ? 'text-red-500 dark:text-red-400'
                                : 'text-primary dark:text-primary'
                                }`}
                            aria-live="polite"
                        >
                            {formState.message}
                        </div>
                    )
                }
            </form >
        </div >
    )
}

export const SenderFormWrapper = () => {
    const [isHidden, setIsHidden] = useState<boolean>(true)

    useEffect(() => {
        setIsHidden(Boolean(getCookie('senderSubscribed')))
    }, [])

    return <SenderForm isHidden={isHidden} />
}


