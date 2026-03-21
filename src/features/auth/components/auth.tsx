import { useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import type { LinkOptions } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { LoginSchema, SignupSchema } from "@/types/schemas/auth";
import { authClient } from "@/integrations/better-auth/authClient";

export default function Auth() {
    const location = useLocation()
    if (location.pathname === "/login") {
        return (
            <CardShell title="Log into your account" description="Welcome back! Please enter your credentials to access your account.">
                <LoginForm />
            </CardShell>
        )
    }
    else if (location.pathname === "/signup") {
        return (
            <CardShell title="Create a new account" description="Join us today! Please fill out the form below to create your account.">
                <SignupForm />
            </CardShell>
        )
    }
}
function LoginForm() {
    const [submitError, setSubmitError] = useState<string | null>(null)
    const form = useForm({
        defaultValues: {
            email: '',
            password: '',
        },
        validators: {
            onSubmit: LoginSchema,
        },
        onSubmit: async ({value}) => {       
            setSubmitError(null)     
            const {email, password} = value
            const signInResult = await authClient.signIn.email({
                email,
                password,
            })
            if (signInResult.error?.message) {
                setSubmitError(signInResult.error.message)
            }

        }
    })
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                form.handleSubmit()
            }}
            className="flex flex-col gap-4"
        >
            <form.Field name="email">
                {(field) => (
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="w-full border-2 border-gray-400 p-2 rounded-lg"
                        />
                        {!field.state.meta.isValid && (
                            <span className="text-red-500 text-sm mt-1">{field.state.meta.errors.map((validationError) => validationError?.message).join(', ')}</span>
                        )}
                    </div>
                )}
            </form.Field>
            <form.Field name="password">
                {(field) => (
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="w-full border-2 border-gray-400 p-2 rounded-lg"
                        />
                        {!field.state.meta.isValid && (
                            <span className="text-red-500 text-sm mt-1">{field.state.meta.errors.map((validationError) => validationError?.message).join(', ')}</span>
                        )}
                    </div>
                )}
            </form.Field>
            {submitError && <span className="error text-red-500 text-sm mt-1 col-span-2">{submitError}</span>}
            <button
                type="submit"
                disabled={form.state.isSubmitting}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-150"
            >
                {form.state.isSubmitting ? 'Logging In...' : 'Log In'}
            </button>
        </form> 
    )
}
function SignupForm() {
    const [submitError, setSubmitError] = useState<string | null>(null)
    const form = useForm({
        defaultValues: {
            name: '',
            email: '',
            password: '',
            role: '',
            state: '',
        },
        validators: {
            onSubmit: SignupSchema,
        },
        onSubmit: async ({value}) => {
            setSubmitError(null)
            const {name, email, password, role, state} = value
            const signUpResult = await authClient.signUp.email({
                name,
                email,
                password,
                role,
                state,
            })
            if (signUpResult.error?.message) {
                setSubmitError(signUpResult.error.message)
            }
        }
    })
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                form.handleSubmit()
            }}
            className="flex flex-col gap-4"
        >
            <form.Field name="name">
                {(field) => (
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700">
                            Name
                        </label>
                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="w-full border-2 border-gray-400 p-2 rounded-lg"
                        />
                        {!field.state.meta.isValid && (
                            <span className="text-red-500 text-sm mt-1">{field.state.meta.errors.map((validationError) => validationError?.message).join(', ')}</span>
                        )}
                    </div>
                )}
            </form.Field>
            <form.Field name="email">
                {(field) => (
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="w-full border-2 border-gray-400 p-2 rounded-lg"
                        />
                        {!field.state.meta.isValid && (
                            <span className="text-red-500 text-sm mt-1">{field.state.meta.errors.map((validationError) => validationError?.message).join(', ')}</span>
                        )}
                    </div>
                )}
            </form.Field>
            <form.Field name="password">
                {(field) => (
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="w-full border-2 border-gray-400 p-2 rounded-lg"
                        />
                        {!field.state.meta.isValid && (
                            <span className="text-red-500 text-sm mt-1">{field.state.meta.errors.map((validationError) => validationError?.message).join(', ')}</span>
                        )}
                    </div>
                )}
            </form.Field>
            <div className="grid grid-cols-2 gap-4">
                <form.Field name="role">
                    {(field) => (
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">
                                Role
                            </label>
                            <select
                                required
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) => field.handleChange(e.target.value)}
                                className="w-full border-2 border-gray-400 p-2 rounded-lg"
                            >
                                <option disabled value="">Select your role</option>
                                <option value="student">Student</option>
                                <option value="mentor">Mentor</option>
                            </select>
                            {!field.state.meta.isValid && (
                                <span className="text-red-500 text-sm mt-1">{field.state.meta.errors.map((validationError) => validationError?.message).join(', ')}</span>
                            )}
                        </div>
                    )}
                </form.Field>
                <form.Field name="state">
                    {(field) => (
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">
                                State
                            </label>
                            <select
                                required
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) => field.handleChange(e.target.value)}
                                className="w-full border-2 border-gray-400 p-2 rounded-lg"
                            >
                                <option disabled value="">Select your state</option>
                                <option value="NSW">New South Wales</option>
                                <option value="VIC">Victoria</option>
                                <option value="QLD">Queensland</option>
                                <option value="WA">Western Australia</option>
                                <option value="SA">South Australia</option>
                                <option value="TAS">Tasmania</option>
                                <option value="NAT">National/Other</option>
                            </select>
                            {!field.state.meta.isValid && (
                                <span className="text-red-500 text-sm mt-1">{field.state.meta.errors.map((validationError) => validationError?.message).join(', ')}</span>
                            )}
                        </div>
                    )}
                </form.Field>
                {submitError && <span className="error text-red-500 text-sm mt-1 col-span-2">{submitError}</span>}
            </div>
            <button
                type="submit"
                disabled={form.state.isSubmitting}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-150"
            >
                {form.state.isSubmitting ? 'Creating Account...' : 'Sign Up'}
            </button>
        </form> 
    )
}
function CardShell({title, description, children}: {title?: string, description?: string, children: React.ReactNode}) {
    return (
        <div className="max-w-xl w-full h-[80vh] bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4 text-center">{title}</h1>
            {description && <p className="text-gray-600 mb-4 text-center">{description}</p>}
            <AuthNav />
            {children}
        </div>
    )
}
function AuthNav() {
    return (
        <div className="flex justify-center gap-1 mb-6 bg-gray-400/40 p-1 rounded-lg">
            <AuthLink linkOptions={{to: "/login" }}>
                Log In
            </AuthLink>
            <AuthLink linkOptions={{to: "/signup"}}>
                Sign Up
            </AuthLink>
        </div>
    )
}
function AuthLink({linkOptions, children}: { linkOptions: LinkOptions, children?: React.ReactNode }) {
    return (
        <Link
            {...linkOptions}
            activeProps={{className: "bg-white"}}
            className="py-3 rounded-lg flex-1 text-center transition duration-150"
        >
            {children}
        </Link>
    )
}