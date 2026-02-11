import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { login } from '@/routes';
import register from '@/routes/register';

import { Link, useForm } from '@inertiajs/react';
import { toast } from 'sonner';

export function SignupForm({ className, ...props }: React.ComponentProps<'div'>) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        username: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(register.post.url(), {
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
                        <h1 className="text-2xl font-bold">Create an account</h1>
                        <p className="text-muted-foreground text-sm text-balance">
                            Enter your details below to create your account
                        </p>
                    </div>
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" type="text" placeholder="John Doe" required value={data.name} onChange={handleInputChange} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="username">Username</Label>
                            <Input id="username" type="text" placeholder="johndoe" required value={data.username} onChange={handleInputChange} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                required
                                value={data.password}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation">Confirm Password</Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                placeholder="Confirm your password"
                                required
                                value={data.password_confirmation}
                                onChange={handleInputChange}
                            />
                        </div>

                        <Button type="submit" className="w-full">
                            Create Account
                        </Button>
                    </div>
                    <div className="text-center text-sm">
                        Already have an account?{" "}
                        <Link href={login()} className="underline underline-offset-4">
                            Sign in
                        </Link>
                    </div>
                </div>
            </form>
            <div className="text-muted-foreground px-6 text-center text-xs text-balance [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
                By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
            </div>
        </div>
    );
}
