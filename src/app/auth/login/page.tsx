'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useLogin } from '@/queries/auth';
import { LoginSchema, type LoginFormData } from '@/schemas/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

export default function LoginPage() {
	const router = useRouter();
	const loginMutation = useLogin();

	const form = useForm<LoginFormData>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			username: '',
			password: '',
		},
	});

	async function onSubmit(values: LoginFormData) {
		try {
			await loginMutation.mutateAsync(values);
			router.push('/');
		} catch (error) {
			console.error('Login failed:', error);
		}
	}

	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
			<div className='max-w-md w-full space-y-8'>
				<Card>
					<CardHeader className='space-y-1'>
						<CardTitle className='text-2xl text-center'>Sign in</CardTitle>
						<CardDescription className='text-center'>
							Enter your username and password to sign in to your account
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className='space-y-4'
							>
								<FormField
									control={form.control}
									name='username'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Username</FormLabel>
											<FormControl>
												<Input placeholder='Enter your username' {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name='password'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Password</FormLabel>
											<FormControl>
												<Input
													type='password'
													placeholder='Enter your password'
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								{loginMutation.error && (
									<div className='bg-red-50 border border-red-200 rounded-md p-3'>
										<p className='text-sm text-red-600'>
											{loginMutation.error.message}
										</p>
									</div>
								)}

								<Button
									type='submit'
									className='w-full'
									disabled={loginMutation.isPending}
								>
									{loginMutation.isPending ? 'Signing in...' : 'Sign in'}
								</Button>
							</form>
						</Form>

						<div className='mt-6 text-center'>
							<p className='text-sm text-gray-600'>
								Don&apos;t have an account?{' '}
								<Link
									href='/auth/register'
									className='font-medium text-blue-600 hover:text-blue-500'
								>
									Sign up
								</Link>
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
