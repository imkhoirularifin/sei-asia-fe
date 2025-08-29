'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import type { User } from '@/types/auth';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

export default function DashboardPage() {
	const router = useRouter();
	const [user, setUser] = useState<Partial<User>>({});
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Check if user is authenticated and load user data
		const token = localStorage.getItem('access_token');
		if (!token) {
			router.push('/auth/login');
			return;
		}

		// Load user data safely
		try {
			const userStr = localStorage.getItem('user');
			if (userStr) {
				const userData = JSON.parse(userStr);
				setUser(userData);
			}
		} catch (error) {
			console.error('Failed to parse user data from localStorage:', error);
			// Clear invalid data and redirect to login
			localStorage.removeItem('access_token');
			localStorage.removeItem('user');
			router.push('/auth/login');
			return;
		}

		setIsLoading(false);
	}, [router]);

	const handleLogout = () => {
		localStorage.removeItem('access_token');
		localStorage.removeItem('user');
		router.push('/auth/login');
	};

	if (isLoading) {
		return (
			<div className='min-h-screen flex items-center justify-center'>
				<div className='text-center'>
					<h2 className='text-lg font-medium text-gray-900'>Loading...</h2>
				</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
			<div className='max-w-4xl mx-auto'>
				<div className='flex justify-between items-center mb-8'>
					<div>
						<h1 className='text-3xl font-bold text-gray-900'>Dashboard</h1>
						<p className='text-gray-600'>
							Welcome back, {user.username || 'User'}!
						</p>
					</div>
					<Button onClick={handleLogout} variant='outline'>
						Logout
					</Button>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
					<Card>
						<CardHeader>
							<CardTitle>Tasks</CardTitle>
							<CardDescription>Manage your tasks</CardDescription>
						</CardHeader>
						<CardContent>
							<p className='text-sm text-gray-600'>
								Task management features will be implemented here.
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Profile</CardTitle>
							<CardDescription>Your account information</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='space-y-2'>
								<p className='text-sm'>
									<span className='font-medium'>Username:</span> {user.username}
								</p>
								<p className='text-sm'>
									<span className='font-medium'>User ID:</span> {user.id}
								</p>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Settings</CardTitle>
							<CardDescription>Account settings</CardDescription>
						</CardHeader>
						<CardContent>
							<p className='text-sm text-gray-600'>
								Settings panel coming soon.
							</p>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
