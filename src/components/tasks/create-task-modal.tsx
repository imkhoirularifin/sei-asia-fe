'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useCreateTask } from '@/queries/task';
import { CreateTaskSchema, type CreateTaskFormData } from '@/schemas/task';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

const statusOptions = [
	{ value: 'not_started', label: 'Not Started' },
	{ value: 'in_progress', label: 'In Progress' },
	{ value: 'done', label: 'Done' },
];

interface CreateTaskModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function CreateTaskModal({ open, onOpenChange }: CreateTaskModalProps) {
	const createTaskMutation = useCreateTask();

	const form = useForm<CreateTaskFormData>({
		resolver: zodResolver(CreateTaskSchema),
		defaultValues: {
			title: '',
			description: '',
			status: 'not_started',
			dueDate: '',
		},
	});

	const onSubmit = async (data: CreateTaskFormData) => {
		try {
			// Remove empty strings and convert to proper format
			const taskData = {
				title: data.title,
				...(data.description && { description: data.description }),
				status: data.status,
				...(data.dueDate && { dueDate: data.dueDate }),
			};

			await createTaskMutation.mutateAsync(taskData);
			form.reset();
			onOpenChange(false);
		} catch (error) {
			console.error('Failed to create task:', error);
		}
	};

	const handleClose = () => {
		form.reset();
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>Create New Task</DialogTitle>
					<DialogDescription>
						Add a new task to your task list. Fill in the details below.
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
						{/* Title */}
						<FormField
							control={form.control}
							name='title'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Title</FormLabel>
									<FormControl>
										<Input placeholder='Enter task title...' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Description */}
						<FormField
							control={form.control}
							name='description'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description (Optional)</FormLabel>
									<FormControl>
										<textarea
											className='flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
											placeholder='Enter task description...'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Status */}
						<FormField
							control={form.control}
							name='status'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Status</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder='Select status' />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{statusOptions.map((option) => (
												<SelectItem key={option.value} value={option.value}>
													{option.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Due Date */}
						<FormField
							control={form.control}
							name='dueDate'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Due Date (Optional)</FormLabel>
									<FormControl>
										<Input type='date' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<DialogFooter>
							<Button type='button' variant='outline' onClick={handleClose}>
								Cancel
							</Button>
							<Button type='submit' disabled={createTaskMutation.isPending}>
								{createTaskMutation.isPending ? 'Creating...' : 'Create Task'}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
