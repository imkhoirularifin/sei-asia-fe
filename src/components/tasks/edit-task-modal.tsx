'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useTask, useUpdateTask } from '@/queries/task';
import { UpdateTaskSchema, type UpdateTaskFormData } from '@/schemas/task';

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

interface EditTaskModalProps {
	taskId: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function EditTaskModal({
	taskId,
	open,
	onOpenChange,
}: EditTaskModalProps) {
	const { data: taskResponse, isLoading } = useTask(taskId);
	const updateTaskMutation = useUpdateTask();

	const form = useForm<UpdateTaskFormData>({
		resolver: zodResolver(UpdateTaskSchema),
		defaultValues: {
			title: '',
			description: '',
			status: 'not_started',
			dueDate: '',
		},
	});

	// Update form when task data is loaded
	useEffect(() => {
		if (taskResponse?.data && open) {
			const task = taskResponse.data;
			const formData = {
				title: task.title,
				description: task.description || '',
				status: task.status,
				dueDate: task.dueDate
					? new Date(task.dueDate).toISOString().split('T')[0]
					: '',
			};
			console.log('Resetting form with data:', formData); // Debug log
			form.reset(formData);
		}
	}, [taskResponse, form, open]);

	const onSubmit = async (data: UpdateTaskFormData) => {
		try {
			// Only include changed fields and remove empty strings
			const updateData: UpdateTaskFormData = {};

			if (data.title && data.title !== taskResponse?.data?.title) {
				updateData.title = data.title;
			}

			if (
				data.description !== undefined &&
				data.description !== (taskResponse?.data?.description || '')
			) {
				updateData.description = data.description || undefined;
			}

			if (data.status && data.status !== taskResponse?.data?.status) {
				updateData.status = data.status;
			}

			if (data.dueDate !== undefined) {
				const currentDueDate = taskResponse?.data?.dueDate
					? new Date(taskResponse.data.dueDate).toISOString().split('T')[0]
					: '';
				if (data.dueDate !== currentDueDate) {
					updateData.dueDate = data.dueDate || undefined;
				}
			}

			// Only update if there are changes
			if (Object.keys(updateData).length > 0) {
				await updateTaskMutation.mutateAsync({ id: taskId, data: updateData });
			}

			onOpenChange(false);
		} catch (error) {
			console.error('Failed to update task:', error);
		}
	};

	const handleClose = () => {
		onOpenChange(false);
	};

	if (isLoading) {
		return (
			<Dialog open={open} onOpenChange={handleClose}>
				<DialogContent className='sm:max-w-[425px]'>
					<DialogHeader>
						<DialogTitle>Loading Task...</DialogTitle>
					</DialogHeader>
					<div className='flex items-center justify-center py-8'>
						<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
					</div>
				</DialogContent>
			</Dialog>
		);
	}

	if (!taskResponse?.data) {
		return (
			<Dialog open={open} onOpenChange={handleClose}>
				<DialogContent className='sm:max-w-[425px]'>
					<DialogHeader>
						<DialogTitle>Error</DialogTitle>
						<DialogDescription>
							Failed to load task data. Please try again.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button onClick={handleClose}>Close</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>Edit Task</DialogTitle>
					<DialogDescription>Update the task details below.</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form
						key={taskResponse?.data?.id}
						onSubmit={form.handleSubmit(onSubmit)}
						className='space-y-4'
					>
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
							render={({ field }) => {
								console.log('Status field value:', field.value); // Debug log
								return (
									<FormItem>
										<FormLabel>Status</FormLabel>
										<Select
											onValueChange={(value) => {
												console.log('Status changing to:', value); // Debug log
												field.onChange(value);
											}}
											value={field.value}
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
								);
							}}
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
							<Button type='submit' disabled={updateTaskMutation.isPending}>
								{updateTaskMutation.isPending ? 'Updating...' : 'Update Task'}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
