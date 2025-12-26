import '../css/app.css';

import type { ComponentType, ReactNode } from 'react';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { ToastListener } from './components/ToastListener';
import { Toaster } from './components/ui/sonner';

type InertiaPage = {
    default: ComponentType & {
        layout?: (page: ReactNode) => ReactNode;
    };
};

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: async (name) => {
        const page = (await resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        )) as InertiaPage;

        const pageComponent = page.default;
        const originalLayout = pageComponent.layout;

        pageComponent.layout = (pageContent: ReactNode) => (
            <ToastListener>{originalLayout ? originalLayout(pageContent) : pageContent}</ToastListener>
        );

        return page;
    },
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <>
                <App {...props} />
                <Toaster />
            </>,
        );
    },
    progress: {
        color: '#4B5563',
    },
});
