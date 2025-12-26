import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { login } from '@/routes';
import register from '@/routes/register';

import { Link, useForm } from '@inertiajs/react';
import { toast } from 'sonner';

export function SignupForm({ className, ...props }: React.ComponentProps<'div'>) {
    const { data, setData, post, reset } = useForm({
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
        <div className={cn('flex flex-col gap-4', className)} {...props}>
            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="space-y-1 text-left">
                    <CardTitle className="text-xl">Create your workspace</CardTitle>
                    <CardDescription className="text-sm text-slate-600">
                        This owner account will manage branches, cashiers, and billing.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="name">Full name</FieldLabel>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Jane Santos"
                                    autoComplete="name"
                                    required
                                    value={data.name}
                                    onChange={handleInputChange}
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="username">Username</FieldLabel>
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="super_admin"
                                    autoComplete="username"
                                    required
                                    value={data.username}
                                    onChange={handleInputChange}
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="password">Password</FieldLabel>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Create a strong password"
                                    autoComplete="new-password"
                                    required
                                    value={data.password}
                                    onChange={handleInputChange}
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="password_confirmation">Confirm password</FieldLabel>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    placeholder="Repeat your password"
                                    autoComplete="new-password"
                                    required
                                    value={data.password_confirmation}
                                    onChange={handleInputChange}
                                />
                            </Field>

                            <Field>
                                <Button type="submit" className="w-full">
                                    Create workspace
                                </Button>
                                <FieldDescription className="mt-3 text-center text-xs text-slate-600">
                                    Already using Merchantry POS?{' '}
                                    <Link href={login()} className="font-medium text-emerald-700 hover:text-emerald-800">
                                        Sign in instead
                                    </Link>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
            <FieldDescription className="px-2 text-center text-[11px] text-slate-500">
                You can add branches, roles, and additional users after you create this account.
            </FieldDescription>
        </div>
    );
}
