import { usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

export function ToastListener({ children }: { children: React.ReactNode }) {
    const { props } = usePage();
    const flash = props.flash as { success?: string; error?: string };

    const lastSuccessRef = useRef<string | null>(null);
    const lastErrorRef = useRef<string | null>(null);

    useEffect(() => {
        if (flash?.success && flash.success !== lastSuccessRef.current) {
            lastSuccessRef.current = flash.success;
            toast.success(flash.success);
        }
    }, [flash?.success]);

    useEffect(() => {
        if (flash?.error && flash.error !== lastErrorRef.current) {
            lastErrorRef.current = flash.error;
            toast.error(flash.error);
        }
    }, [flash?.error]);

    return <>{children}</>;
}
