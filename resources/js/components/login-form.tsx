import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { register } from '@/routes';
import login from '@/routes/login';
import { Link, useForm } from '@inertiajs/react';
import { toast } from 'sonner';

export function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
    const { data, setData, post, processing, errors, reset } = useForm({
        username: '',
        password: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(login.post.url(), {
            onSuccess: (response: { props: FlashProps }) => {
                toast.success(response.props.flash?.success);
                reset();
            },
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setData(id as keyof typeof data, value);
    };
    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col items-center gap-2 text-center">
                        <h1 className="text-2xl font-bold">Login to your account</h1>
                        <p className="text-muted-foreground text-sm text-balance">
                            Enter your username below to login to your account
                        </p>
                    </div>
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <Label >Username</Label>
                            <Input id="username" type="text" placeholder="johndoe" required value={data.username} onChange={handleInputChange} />
                        </div>
                        <div className="grid gap-2">

                            <Input id="password" type="password" required value={data.password} onChange={handleInputChange} />
                        </div>
                        <Button type="submit" className="w-full">
                            Login
                        </Button>
                    </div>
                    <div className="text-center text-sm">
                        Don&apos;t have an account?{" "}
                        <Link href={register()} className="underline underline-offset-4">
                            Sign up
                        </Link>
                    </div>
                </div>
            </form>
            <div className="text-muted-foreground px-6 text-center text-xs text-balance [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
                By clicking continue, you agree to our <a href="#">Terms of Service</a> and <Link href="#">Privacy Policy</Link>.
            </div>
        </div>
    );
}
