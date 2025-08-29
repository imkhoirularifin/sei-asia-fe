'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Page() {
	const router = useRouter();

	useEffect(() => {
		// Redirect to login if not authenticated, otherwise to dashboard
		const token = localStorage.getItem('access_token');
		if (token) {
			router.push('/dashboard');
		} else {
			router.push('/auth/login');
		}
	}, [router]);

	return (
		<div className='min-h-screen flex items-center justify-center'>
			<div className='text-center'>
				<h2 className='text-lg font-medium text-gray-900'>Loading...</h2>
			</div>
		</div>
	);
}
