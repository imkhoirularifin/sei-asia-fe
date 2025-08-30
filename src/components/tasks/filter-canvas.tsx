'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import type { TaskFilters, TaskSort, TaskStatus } from '@/types/task';

const statusOptions = [
	{ value: 'all', label: 'All Statuses' },
	{ value: 'not_started', label: 'Not Started' },
	{ value: 'in_progress', label: 'In Progress' },
	{ value: 'done', label: 'Done' },
];

const sortOptions = [
	{ value: 'createdAt', label: 'Created Date' },
	{ value: 'dueDate', label: 'Due Date' },
	{ value: 'title', label: 'Title' },
	{ value: 'status', label: 'Status' },
];

const sortOrderOptions = [
	{ value: 'desc', label: 'Descending' },
	{ value: 'asc', label: 'Ascending' },
];

interface FilterCanvasProps {
	onFiltersChange: (
		filters: TaskFilters,
		sort: TaskSort,
		resetPagination?: boolean
	) => void;
}

export function FilterCanvas({ onFiltersChange }: FilterCanvasProps) {
	const router = useRouter();
	const searchParams = useSearchParams();

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

	// Local state for search inputs
	const [titleSearch, setTitleSearch] = useState(filters.title);
	const [descriptionSearch, setDescriptionSearch] = useState(
		filters.description
	);

	// Update URL with current state
	const updateURL = (
		newFilters: TaskFilters,
		newSort: TaskSort,
		resetPagination = false
	) => {
		const params = new URLSearchParams();

		// Add non-empty filters to URL
		Object.entries(newFilters).forEach(([key, value]) => {
			if (value && value.trim() !== '' && value !== 'all') {
				params.set(key, value);
			}
		});

		// Add sort parameters
		if (newSort.sortBy !== 'createdAt') params.set('sortBy', newSort.sortBy);
		if (newSort.sortOrder !== 'desc')
			params.set('sortOrder', newSort.sortOrder);

		// Keep pagination params if not resetting
		if (!resetPagination) {
			const currentPage = searchParams.get('page');
			const currentLimit = searchParams.get('limit');
			if (currentPage && currentPage !== '1') params.set('page', currentPage);
			if (currentLimit && currentLimit !== '10')
				params.set('limit', currentLimit);
		}

		const queryString = params.toString();
		const newURL = queryString ? `/?${queryString}` : '/';
		router.replace(newURL);

		// Notify parent component
		onFiltersChange(newFilters, newSort, resetPagination);
	};

	// Handle filter changes
	const handleFilterChange = (field: keyof TaskFilters, value: string) => {
		const newFilters = { ...filters, [field]: value };
		setFilters(newFilters);
		updateURL(newFilters, sort, true); // Reset pagination when filtering
	};

	// Handle sort changes
	const handleSortChange = (field: 'sortBy' | 'sortOrder', value: string) => {
		const newSort = { ...sort, [field]: value };
		setSort(newSort);
		updateURL(filters, newSort, true); // Reset pagination when sorting
	};

	// Reset filters
	const resetFilters = () => {
		const resetFilters = {
			title: '',
			description: '',
			status: 'all' as const,
			dueDate: '',
			createdAt: '',
		};
		const resetSort = {
			sortBy: 'createdAt' as const,
			sortOrder: 'desc' as const,
		};

		setFilters(resetFilters);
		setSort(resetSort);
		setTitleSearch('');
		setDescriptionSearch('');

		// Clear URL completely
		router.replace('/');
		onFiltersChange(resetFilters, resetSort, true);
	};

	// Handle search button click
	const handleSearch = () => {
		const newFilters = {
			...filters,
			title: titleSearch,
			description: descriptionSearch,
		};
		setFilters(newFilters);
		updateURL(newFilters, sort, true); // Reset pagination when searching
	};

	// Handle Enter key press in search inputs
	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleSearch();
		}
	};

	// Update local state when URL changes externally
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

		setFilters(newFilters);
		setSort(newSort);
		setTitleSearch(newFilters.title);
		setDescriptionSearch(newFilters.description);
	}, [searchParams]);
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant='outline'>
					<Filter className='mr-2 h-4 w-4' />
					Filters
				</Button>
			</SheetTrigger>
			<SheetContent className='overflow-y-auto px-4 w-full sm:max-w-lg'>
				<SheetHeader className='pb-4'>
					<SheetTitle>Filters & Search</SheetTitle>
				</SheetHeader>
				<div className='space-y-6 px-1 pb-6'>
					<div className='space-y-4'>
						{/* Title Search */}
						<div className='space-y-2'>
							<Label htmlFor='title-search'>Search Title</Label>
							<div className='relative'>
								<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
								<Input
									id='title-search'
									placeholder='Search by title...'
									value={titleSearch}
									onChange={(e) => setTitleSearch(e.target.value)}
									onKeyPress={handleKeyPress}
									className='pl-9'
								/>
							</div>
						</div>

						{/* Description Search */}
						<div className='space-y-2'>
							<Label htmlFor='description-search'>Search Description</Label>
							<div className='relative'>
								<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
								<Input
									id='description-search'
									placeholder='Search by description...'
									value={descriptionSearch}
									onChange={(e) => setDescriptionSearch(e.target.value)}
									onKeyPress={handleKeyPress}
									className='pl-9'
								/>
							</div>
						</div>

						{/* Search Button */}
						<Button onClick={handleSearch} className='w-full' variant='default'>
							<Search className='mr-2 h-4 w-4' />
							Search
						</Button>

						{/* Status Filter */}
						<div className='space-y-2'>
							<Label>Status</Label>
							<Select
								value={filters.status}
								onValueChange={(value) => handleFilterChange('status', value)}
							>
								<SelectTrigger>
									<SelectValue placeholder='Select status' />
								</SelectTrigger>
								<SelectContent>
									{statusOptions.map((option) => (
										<SelectItem key={option.value} value={option.value}>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Due Date Filter */}
						<div className='space-y-2'>
							<Label htmlFor='due-date'>Due Date</Label>
							<Input
								id='due-date'
								type='date'
								value={filters.dueDate}
								onChange={(e) => handleFilterChange('dueDate', e.target.value)}
							/>
						</div>

						{/* Created Date Filter */}
						<div className='space-y-2'>
							<Label htmlFor='created-date'>Created Date</Label>
							<Input
								id='created-date'
								type='date'
								value={filters.createdAt}
								onChange={(e) =>
									handleFilterChange('createdAt', e.target.value)
								}
							/>
						</div>
					</div>

					<div className='space-y-4 pt-4 border-t'>
						{/* Sort By */}
						<div className='space-y-2'>
							<Label>Sort by</Label>
							<Select
								value={sort.sortBy}
								onValueChange={(value) => handleSortChange('sortBy', value)}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{sortOptions.map((option) => (
										<SelectItem key={option.value} value={option.value}>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Sort Order */}
						<div className='space-y-2'>
							<Label>Order</Label>
							<Select
								value={sort.sortOrder}
								onValueChange={(value) => handleSortChange('sortOrder', value)}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{sortOrderOptions.map((option) => (
										<SelectItem key={option.value} value={option.value}>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<Button variant='outline' onClick={resetFilters} className='w-full'>
							Reset Filters
						</Button>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
