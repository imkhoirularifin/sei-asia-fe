'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRegister } from '@/queries/auth';
import {
	RegisterWithConfirmSchema,
	type RegisterWithConfirmFormData,
} from '@/schemas/auth';
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

export default function RegisterPage() {
	const router = useRouter();
	const registerMutation = useRegister();

	const form = useForm<RegisterWithConfirmFormData>({
		resolver: zodResolver(RegisterWithConfirmSchema),
		defaultValues: {
			username: '',
			password: '',
			confirmPassword: '',
		},
	});

	async function onSubmit(values: RegisterWithConfirmFormData) {
		try {
			const { username, password } = values;
			await registerMutation.mutateAsync({ username, password });
			router.push('/');
		} catch (error) {
			console.error('Registration failed:', error);
		}
	}

	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
			<div className='max-w-md w-full space-y-8'>
				<Card>
					<CardHeader className='space-y-1'>
						<CardTitle className='text-2xl text-center'>
							Create account
						</CardTitle>
						<CardDescription className='text-center'>
							Enter your information to create a new account
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
												<Input placeholder='Choose a username' {...field} />
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
													placeholder='Create a password (min. 6 characters)'
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name='confirmPassword'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Confirm Password</FormLabel>
											<FormControl>
												<Input
													type='password'
													placeholder='Confirm your password'
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								{registerMutation.error && (
									<div className='bg-red-50 border border-red-200 rounded-md p-3'>
										<p className='text-sm text-red-600'>
											{registerMutation.error.message}
										</p>
									</div>
								)}

								<Button
									type='submit'
									className='w-full'
									disabled={registerMutation.isPending}
								>
									{registerMutation.isPending
										? 'Creating account...'
										: 'Create account'}
								</Button>
							</form>
						</Form>

						<div className='mt-6 text-center'>
							<p className='text-sm text-gray-600'>
								Already have an account?{' '}
								<Link
									href='/auth/login'
									className='font-medium text-blue-600 hover:text-blue-500'
								>
									Sign in
								</Link>
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
