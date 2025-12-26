import { ArrowLeft, ShoppingBag } from 'lucide-react';

import { SignupForm } from '@/components/signup-form';
import { Link } from '@inertiajs/react';

export default function SignupPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900">
            <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-6 md:px-10 md:py-10">
                <header className="flex items-center justify-between gap-4">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-100">
                            <ShoppingBag className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold tracking-tight">Merchantry POS</span>
                            <span className="text-xs text-slate-500">Create your workspace</span>
                        </div>
                    </Link>

                    <Link href="/" className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900">
                        <ArrowLeft className="h-3.5 w-3.5" />
                        Back to home
                    </Link>
                </header>

                <main className="mt-10 flex flex-1 flex-col items-center justify-center md:mt-16">
                    <div className="grid w-full max-w-4xl gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:items-center">
                        <div className="space-y-4">
                            <p className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700 ring-1 ring-emerald-100">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                Start a new POS workspace
                            </p>
                            <h1 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
                                Create your Merchantry POS account.
                            </h1>
                            <p className="max-w-md text-sm leading-relaxed text-slate-600">
                                Set up your owner account so you can invite branch managers and cashiers, connect
                                branches, and go live in under a day.
                            </p>
                            <ul className="mt-4 grid gap-2 text-xs text-slate-600 md:grid-cols-2">
                                <li className="flex items-center gap-2">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                    Unlimited branches on day one
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                    Invite cashiers and managers later
                                </li>
                            </ul>
                        </div>

                        <div className="w-full">
                            <SignupForm />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
