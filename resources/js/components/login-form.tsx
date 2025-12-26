import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { register } from '@/routes';
import login from '@/routes/login';
import { Link, useForm } from '@inertiajs/react';
import { toast } from 'sonner';

export function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
    const { data, setData, post, reset } = useForm({
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
        <div className={cn('flex flex-col gap-4', className)} {...props}>
            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="space-y-1 text-left">
                    <CardTitle className="text-xl">Sign in</CardTitle>
                    <CardDescription className="text-sm text-slate-600">Enter your username and password to open your POS workspace.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="username">Username</FieldLabel>
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="branch_manager"
                                    autoComplete="username"
                                    required
                                    value={data.username}
                                    onChange={handleInputChange}
                                />
                            </Field>
                            <Field>
                                <div className="flex items-center">
                                    <FieldLabel htmlFor="password">Password</FieldLabel>
                                    <span className="ml-auto text-xs text-slate-500">
                                        Default demo password is <span className="font-medium">password</span>
                                    </span>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    required
                                    value={data.password}
                                    onChange={handleInputChange}
                                />
                            </Field>
                            <Field>
                                <Button type="submit" className="w-full">
                                    Continue to dashboard
                                </Button>
                                <FieldDescription className="mt-3 text-center text-xs text-slate-600">
                                    Don&apos;t have an account?{' '}
                                    <Link href={register()} className="font-medium text-emerald-700 hover:text-emerald-800">
                                        Create one
                                    </Link>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
            <FieldDescription className="px-2 text-center text-[11px] text-slate-500">
                Use your assigned username. Super admins, branch managers, and cashiers share the same login screen.
            </FieldDescription>
        </div>
    );
}
