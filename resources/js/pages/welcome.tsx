import { Head, Link } from '@inertiajs/react';
import { ArrowRight, BarChart3, CreditCard, Monitor, ShoppingBag, Store, Users } from 'lucide-react';

export default function Welcome() {
    return (
        <>
            <Head title="Point of sale">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>

            <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900">
                <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-6 md:px-10 md:py-10">
                    <header className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/40">
                                <ShoppingBag className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold tracking-tight">Merchantry POS</p>
                                <p className="text-xs text-slate-400">Modern point of sale for growing teams</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                            <nav className="hidden items-center gap-6 text-xs font-medium text-slate-300 md:flex">
                                <a href="#features" className="hover:text-white">
                                    Features
                                </a>
                                <a href="#workflow" className="hover:text-white">
                                    Workflow
                                </a>
                                <a href="#insights" className="hover:text-white">
                                    Analytics
                                </a>
                            </nav>

                            <div className="flex items-center gap-2">
                                <Link
                                    href="/login"
                                    className="rounded-md px-3 py-1.5 text-xs font-medium text-slate-300 ring-1 ring-transparent hover:text-white hover:ring-slate-700"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href="/register"
                                    className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500 px-3.5 py-1.5 text-xs font-semibold text-slate-950 shadow-sm transition hover:bg-emerald-400"
                                >
                                    Start free
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </Link>
                            </div>
                        </div>
                    </header>

                    <main className="mt-10 flex flex-1 flex-col gap-16 pb-10 md:mt-16 md:gap-20">
                        <section className="grid flex-1 items-center gap-12 md:grid-cols-[1.1fr_minmax(0,1fr)]">
                            <div>
                                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700 ring-1 ring-emerald-100">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                    Live sales, inventory, and branches in one place
                                </div>

                                <h1 className="mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-4xl md:text-5xl">
                                    The point of sale that feels like your online dashboard.
                                </h1>

                                <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-600">
                                    Run branches, counters, and cashiers from a single screen. Track inventory in real time, sync online and in‑store
                                    sales, and get the metrics you actually look at every day.
                                </p>

                                <div className="mt-6 flex flex-wrap items-center gap-3">
                                    <Link
                                        href="/login"
                                        className="inline-flex items-center gap-2 rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-400"
                                    >
                                        Open POS
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                    <a
                                        href="#insights"
                                        className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-xs font-medium text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
                                    >
                                        See analytics preview
                                    </a>
                                </div>

                                <dl className="mt-8 grid max-w-lg grid-cols-3 gap-4 text-xs text-slate-500">
                                    <div>
                                        <dt className="text-[11px] text-slate-400">Average monthly time saved</dt>
                                        <dd className="mt-1 text-lg font-semibold text-emerald-400">32 hrs</dd>
                                    </div>
                                    <div>
                                        <dt className="text-[11px] text-slate-400">Retail locations</dt>
                                        <dd className="mt-1 text-lg font-semibold">1–50+ branches</dd>
                                    </div>
                                    <div>
                                        <dt className="text-[11px] text-slate-400">Go live in</dt>
                                        <dd className="mt-1 text-lg font-semibold">under 1 day</dd>
                                    </div>
                                </dl>
                            </div>

                            <div className="relative">
                                <div className="absolute -inset-6 rounded-3xl bg-emerald-100/60 blur-2xl" />
                                <div className="relative rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
                                    <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                                        <div>
                                            <p className="text-xs font-medium text-slate-900">Downtown Branch</p>
                                            <p className="text-[11px] text-slate-500">Today • 9:41 AM</p>
                                        </div>
                                        <div className="flex items-center gap-2 text-[11px] text-slate-600">
                                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700 ring-1 ring-emerald-100">
                                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                                Online
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-4 grid gap-4 md:grid-cols-[1.35fr_minmax(0,1fr)]">
                                        <div className="rounded-2xl border border-slate-100 bg-white p-3">
                                            <div className="flex items-center justify-between text-[11px] text-slate-500">
                                                <span>Cart • 3 items</span>
                                                <span>Cashier: Nina</span>
                                            </div>

                                            <div className="mt-3 space-y-2.5 text-xs">
                                                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                                                    <div>
                                                        <p className="font-medium text-slate-900">Cold brew (12oz)</p>
                                                        <p className="text-[11px] text-slate-500">1 × ₱180.00</p>
                                                    </div>
                                                    <p className="font-semibold text-slate-900">₱180</p>
                                                </div>
                                                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                                                    <div>
                                                        <p className="font-medium text-slate-900">Almond croissant</p>
                                                        <p className="text-[11px] text-slate-500">2 × ₱95.00</p>
                                                    </div>
                                                    <p className="font-semibold text-slate-900">₱190</p>
                                                </div>
                                                <div className="flex items-center justify-between rounded-xl border border-dashed border-emerald-200 bg-emerald-50 px-3 py-2">
                                                    <div>
                                                        <p className="font-medium text-emerald-700">Loyalty discount</p>
                                                        <p className="text-[11px] text-emerald-600">–10% on food</p>
                                                    </div>
                                                    <p className="font-semibold text-emerald-700">–₱19</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="rounded-2xl border border-slate-100 bg-white p-3 text-xs">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[11px] font-medium tracking-wide text-slate-500 uppercase">
                                                        Order summary
                                                    </span>
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2 py-0.5 text-[10px] text-slate-700 ring-1 ring-slate-200">
                                                        <CreditCard className="h-3 w-3" />
                                                        Card
                                                    </span>
                                                </div>

                                                <dl className="mt-3 space-y-1.5">
                                                    <div className="flex items-center justify-between">
                                                        <dt className="text-slate-500">Subtotal</dt>
                                                        <dd className="font-medium text-slate-900">₱370.00</dd>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <dt className="text-slate-500">Discounts</dt>
                                                        <dd className="font-medium text-emerald-700">–₱19.00</dd>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <dt className="text-slate-500">Tax</dt>
                                                        <dd className="font-medium text-slate-900">₱42.12</dd>
                                                    </div>
                                                    <div className="flex items-center justify-between border-t border-slate-100 pt-2">
                                                        <dt className="text-[11px] font-semibold tracking-wide text-slate-600 uppercase">Total</dt>
                                                        <dd className="text-lg font-semibold text-emerald-600">₱393.12</dd>
                                                    </div>
                                                </dl>

                                                <button className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-400">
                                                    Charge customer
                                                    <ArrowRight className="h-3.5 w-3.5" />
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3 text-[11px]">
                                                <div className="rounded-xl border border-slate-100 bg-white p-3">
                                                    <p className="text-slate-500">Today&apos;s sales</p>
                                                    <p className="mt-1 text-base font-semibold text-slate-900">₱48,920</p>
                                                    <p className="mt-1 text-emerald-600">+18.3% vs yesterday</p>
                                                </div>
                                                <div className="rounded-xl border border-slate-100 bg-white p-3">
                                                    <p className="text-slate-500">Active branches</p>
                                                    <p className="mt-1 text-base font-semibold text-slate-900">7</p>
                                                    <p className="mt-1 text-slate-500">3 branches above target</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section id="features" className="space-y-6">
                            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
                                <div>
                                    <h2 className="text-sm font-semibold tracking-wide text-emerald-400">Built for POS</h2>
                                    <p className="mt-2 text-lg font-semibold tracking-tight md:text-xl">
                                        Everything your cashiers, managers, and finance team need in one place.
                                    </p>
                                </div>
                                <p className="max-w-xl text-xs leading-relaxed text-slate-600">
                                    From quick checkouts to multi-branch stock transfers and end-of-day reports, your dashboard is designed around how
                                    retail teams actually work.
                                </p>
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                                        <Store className="h-4 w-4" />
                                    </div>
                                    <h3 className="text-sm font-semibold">Multi-branch aware</h3>
                                    <p className="text-xs text-slate-600">
                                        Switch between branches in one click, sync stock levels, and see which locations are carrying your day.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400">
                                        <Monitor className="h-4 w-4" />
                                    </div>
                                    <h3 className="text-sm font-semibold">Counter-first interface</h3>
                                    <p className="text-xs text-slate-600">
                                        Optimised for keyboard shortcuts and touch screens so your team can move fast even during rush hours.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
                                        <Users className="h-4 w-4" />
                                    </div>
                                    <h3 className="text-sm font-semibold">Roles that match your store</h3>
                                    <p className="text-xs text-slate-600">
                                        Give super admins, branch managers, and cashiers exactly what they should see and nothing they should not.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section id="workflow" className="grid gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
                            <div className="space-y-4">
                                <h2 className="text-sm font-semibold tracking-wide text-emerald-400">Day‑to‑day flow</h2>
                                <p className="text-lg font-semibold tracking-tight md:text-xl">
                                    From opening shift to closing reports without leaving one screen.
                                </p>
                                <ol className="space-y-3 text-xs text-slate-600">
                                    <li className="flex gap-3">
                                        <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-[11px] font-semibold text-slate-100 ring-1 ring-slate-700">
                                            1
                                        </span>
                                        <div>
                                            <p className="font-semibold text-slate-900">Open branches and assign cashiers</p>
                                            <p className="mt-1">
                                                Start the day by opening all active branches, assigning cashiers to counters, and loading starting
                                                cash drawers.
                                            </p>
                                        </div>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-[11px] font-semibold text-slate-100 ring-1 ring-slate-700">
                                            2
                                        </span>
                                        <div>
                                            <p className="font-semibold text-slate-900">Sell, refund, and transfer stock</p>
                                            <p className="mt-1">
                                                Scan items, apply discounts, park orders, and move inventory between branches while keeping stock in
                                                sync.
                                            </p>
                                        </div>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-[11px] font-semibold text-slate-100 ring-1 ring-slate-700">
                                            3
                                        </span>
                                        <div>
                                            <p className="font-semibold text-slate-900">Close shifts with clean numbers</p>
                                            <p className="mt-1">
                                                Reconcile cash, compare expected vs counted totals, and export reports for accounting in a few clicks.
                                            </p>
                                        </div>
                                    </li>
                                </ol>
                            </div>

                            <section id="insights" className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-xs">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
                                            <BarChart3 className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-medium text-slate-900">Today&apos;s overview</p>
                                            <p className="text-[11px] text-slate-500">Live across all branches</p>
                                        </div>
                                    </div>
                                    <span className="rounded-full bg-slate-50 px-2 py-0.5 text-[10px] text-slate-700 ring-1 ring-slate-200">
                                        Auto-refresh · 15s
                                    </span>
                                </div>

                                <div className="mt-3 grid gap-3 md:grid-cols-3">
                                    <div className="rounded-xl border border-slate-200 bg-white p-3">
                                        <p className="text-[11px] text-slate-500">Gross sales</p>
                                        <p className="mt-1 text-base font-semibold text-slate-900">₱312,480</p>
                                        <p className="mt-1 text-[11px] text-emerald-600">+24.1% vs last week</p>
                                    </div>
                                    <div className="rounded-xl border border-slate-200 bg-white p-3">
                                        <p className="text-[11px] text-slate-500">Average basket size</p>
                                        <p className="mt-1 text-base font-semibold text-slate-900">₱612</p>
                                        <p className="mt-1 text-[11px] text-emerald-600">+8.3% from campaigns</p>
                                    </div>
                                    <div className="rounded-xl border border-slate-200 bg-white p-3">
                                        <p className="text-[11px] text-slate-500">Payment mix</p>
                                        <div className="mt-2 flex items-center gap-2 text-[11px]">
                                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700">
                                                <CreditCard className="h-3 w-3" />
                                                68% cards
                                            </span>
                                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2 py-0.5 text-slate-700 ring-1 ring-slate-200">
                                                24% cash
                                            </span>
                                            <span className="text-slate-400">8% wallets</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-3 grid gap-3 md:grid-cols-2">
                                    <div className="rounded-xl border border-slate-200 bg-white p-3">
                                        <p className="text-[11px] text-slate-500">Top branch</p>
                                        <p className="mt-1 text-sm font-semibold text-slate-900">Greenbelt Flagship</p>
                                        <p className="mt-1 text-[11px] text-slate-600">₱92,440 • 28% of today&apos;s sales</p>
                                    </div>
                                    <div className="rounded-xl border border-slate-200 bg-white p-3">
                                        <p className="text-[11px] text-slate-500">Top cashier</p>
                                        <p className="mt-1 text-sm font-semibold text-slate-900">Marco Santos</p>
                                        <p className="mt-1 text-[11px] text-slate-600">187 orders • 0 variances</p>
                                    </div>
                                </div>

                                <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-[11px] text-slate-600">
                                    <div className="flex items-center gap-2">
                                        <Monitor className="h-3.5 w-3.5 text-emerald-400" />
                                        <span>Connect your own hardware, printers, and barcode scanners.</span>
                                    </div>
                                    <span className="hidden text-[10px] text-slate-500 md:inline">Works on macOS, Windows, and iPadOS</span>
                                </div>
                            </section>
                        </section>
                    </main>

                    <footer className="mt-6 border-t border-slate-200 pt-4 text-[11px] text-slate-500">
                        <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
                            <p>
                                Ready to turn this template into your own POS like merchantry.io?{' '}
                                <span className="text-slate-300">Start by wiring it to your products and branches.</span>
                            </p>
                            <div className="flex items-center gap-3">
                                <Link href="/login" className="text-xs font-medium text-emerald-400 hover:text-emerald-300">
                                    Go to dashboard
                                </Link>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        </>
    );
}
