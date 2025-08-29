'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
	Plus,
	LogOut,
	CheckCircle2,
	Clock,
	AlertCircle,
	ListTodo,
} from 'lucide-react';

import { useTasks } from '@/queries/task';
import type {
	TaskQueryParams,
	TaskSort,
	TaskPagination,
	TaskStatus,
	TaskFilters,
} from '@/types/task';
import type { User } from '@/types/auth';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

import { FilterCanvas } from '@/components/tasks/filter-canvas';
import { TaskList } from '@/components/tasks/task-list';
import { CreateTaskModal } from '@/components/tasks/create-task-modal';

export default function Page() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [user, setUser] = useState<Partial<User>>({});
	const [isLoading, setIsLoading] = useState(true);

	// Initialize state from URL params
	const [filters, setFilters] = useState<TaskFilters>({
		title: searchParams.get('title') || '',
		description: searchParams.get('description') || '',
		status: (searchParams.get('status') as TaskStatus) || 'all',
		dueDate: searchParams.get('dueDate') || '',
		createdAt: searchParams.get('createdAt') || '',
	});

	const [sort, setSort] = useState<TaskSort>({
		sortBy:
			(searchParams.get('sortBy') as
				| 'createdAt'
				| 'dueDate'
				| 'title'
				| 'status') || 'createdAt',
		sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
	});

	const [pagination, setPagination] = useState<TaskPagination>({
		page: parseInt(searchParams.get('page') || '1'),
		limit: parseInt(searchParams.get('limit') || '10'),
	});

	// Modal states
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

	useEffect(() => {
		// Check if user is authenticated
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

	// Sync state with URL changes
	useEffect(() => {
		const newFilters = {
			title: searchParams.get('title') || '',
			description: searchParams.get('description') || '',
			status: (searchParams.get('status') as TaskStatus) || 'all',
			dueDate: searchParams.get('dueDate') || '',
			createdAt: searchParams.get('createdAt') || '',
		};
		const newSort = {
			sortBy:
				(searchParams.get('sortBy') as
					| 'createdAt'
					| 'dueDate'
					| 'title'
					| 'status') || 'createdAt',
			sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
		};
		const newPagination = {
			page: parseInt(searchParams.get('page') || '1'),
			limit: parseInt(searchParams.get('limit') || '10'),
		};

		setFilters(newFilters);
		setSort(newSort);
		setPagination(newPagination);
	}, [searchParams]);

	// Build query parameters
	const queryParams = useMemo((): TaskQueryParams => {
		const params: TaskQueryParams = {
			...sort,
			...pagination,
		};

		// Add non-empty filters
		Object.entries(filters).forEach(([key, value]) => {
			if (value && value.trim() !== '' && value !== 'all') {
				if (key === 'status') {
					params[key] = value as TaskStatus;
				} else {
					params[key as keyof TaskFilters] = value;
				}
			}
		});

		return params;
	}, [filters, sort, pagination]);

	// Fetch tasks
	const {
		data: tasksResponse,
		isLoading: tasksLoading,
		error,
	} = useTasks(queryParams);

	// Handle filter changes from FilterCanvas
	const handleFiltersChange = (
		newFilters: TaskFilters,
		newSort: TaskSort,
		resetPagination?: boolean
	) => {
		setFilters(newFilters);
		setSort(newSort);

		if (resetPagination) {
			setPagination({ page: 1, limit: 10 });
		}
	};

	// Handle pagination
	const handlePageChange = (page: number) => {
		const newPagination = { ...pagination, page };
		setPagination(newPagination);

		// Update URL for pagination
		const params = new URLSearchParams();

		// Add current filters
		Object.entries(filters).forEach(([key, value]) => {
			if (value && value.trim() !== '' && value !== 'all') {
				params.set(key, value);
			}
		});

		// Add sort parameters
		if (sort.sortBy !== 'createdAt') params.set('sortBy', sort.sortBy);
		if (sort.sortOrder !== 'desc') params.set('sortOrder', sort.sortOrder);

		// Add pagination parameters
		if (newPagination.page !== 1)
			params.set('page', newPagination.page.toString());
		if (newPagination.limit !== 10)
			params.set('limit', newPagination.limit.toString());

		const queryString = params.toString();
		const newURL = queryString ? `/?${queryString}` : '/';
		router.replace(newURL);
	};

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

	if (error) {
		return (
			<div className='container mx-auto py-8'>
				<Card>
					<CardHeader>
						<CardTitle>Error</CardTitle>
						<CardDescription>
							Failed to load tasks: {error.message}
						</CardDescription>
					</CardHeader>
				</Card>
			</div>
		);
	}

	const tasks = tasksResponse?.data?.tasks || [];
	const totalPages = tasksResponse?.data?.totalPages || 0;
	const currentPage = tasksResponse?.data?.page || 1;
	const total = tasksResponse?.data?.total || 0;

	return (
		<div className='min-h-screen bg-gray-50 py-8'>
			<div className='container mx-auto space-y-8 max-w-5xl'>
				{/* Header */}
				<div className='flex items-center justify-between'>
					<div>
						<h1 className='text-3xl font-bold tracking-tight'>
							Welcome back, {user.username || 'User'}!
						</h1>
						<p className='text-muted-foreground'>
							Manage your tasks and track your progress
						</p>
					</div>
					<div className='flex items-center gap-2'>
						<FilterCanvas onFiltersChange={handleFiltersChange} />
						<Button onClick={() => setIsCreateModalOpen(true)}>
							<Plus className='mr-2 h-4 w-4' />
							Create Task
						</Button>
						<Button onClick={handleLogout} variant='outline'>
							<LogOut className='mr-2 h-4 w-4' />
							Logout
						</Button>
					</div>
				</div>

				{/* Task Summary */}
				{!tasksLoading && (
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
						<Card>
							<CardContent className='p-6'>
								<div className='flex items-center space-x-2'>
									<ListTodo className='h-5 w-5 text-blue-600' />
									<div>
										<p className='text-2xl font-bold'>{total}</p>
										<p className='text-sm text-muted-foreground'>Total Tasks</p>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardContent className='p-6'>
								<div className='flex items-center space-x-2'>
									<Clock className='h-5 w-5 text-yellow-600' />
									<div>
										<p className='text-2xl font-bold'>
											{
												tasks.filter((task) => task.status === 'not_started')
													.length
											}
										</p>
										<p className='text-sm text-muted-foreground'>Not Started</p>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardContent className='p-6'>
								<div className='flex items-center space-x-2'>
									<AlertCircle className='h-5 w-5 text-orange-600' />
									<div>
										<p className='text-2xl font-bold'>
											{
												tasks.filter((task) => task.status === 'in_progress')
													.length
											}
										</p>
										<p className='text-sm text-muted-foreground'>In Progress</p>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardContent className='p-6'>
								<div className='flex items-center space-x-2'>
									<CheckCircle2 className='h-5 w-5 text-green-600' />
									<div>
										<p className='text-2xl font-bold'>
											{tasks.filter((task) => task.status === 'done').length}
										</p>
										<p className='text-sm text-muted-foreground'>Completed</p>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				)}

				{/* Tasks Table */}
				<TaskList
					tasks={tasks}
					total={total}
					currentPage={currentPage}
					totalPages={totalPages}
					isLoading={tasksLoading}
					onPageChange={handlePageChange}
				/>

				{/* Create Task Modal */}
				<CreateTaskModal
					open={isCreateModalOpen}
					onOpenChange={setIsCreateModalOpen}
				/>
			</div>
		</div>
	);
}
