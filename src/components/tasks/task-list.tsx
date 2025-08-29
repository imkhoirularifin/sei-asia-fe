'use client';

import { useState } from 'react';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { CreateTaskModal } from '@/components/tasks/create-task-modal';
import { EditTaskModal } from '@/components/tasks/edit-task-modal';
import { useDeleteTask } from '@/queries/task';
import type { Task } from '@/types/task';

const getStatusBadgeColor = (status: string) => {
	switch (status) {
		case 'not_started':
			return 'bg-yellow-100 text-yellow-800 border-yellow-300';
		case 'in_progress':
			return 'bg-blue-100 text-blue-800 border-blue-300';
		case 'done':
			return 'bg-green-100 text-green-800 border-green-300';
		default:
			return 'bg-gray-100 text-gray-800 border-gray-300';
	}
};

const getStatusLabel = (status: string) => {
	switch (status) {
		case 'not_started':
			return 'Not Started';
		case 'in_progress':
			return 'In Progress';
		case 'done':
			return 'Done';
		default:
			return status;
	}
};

interface TaskListProps {
	tasks: Task[];
	total: number;
	currentPage: number;
	totalPages: number;
	isLoading: boolean;
	onPageChange: (page: number) => void;
}

export function TaskList({
	tasks,
	total,
	currentPage,
	totalPages,
	isLoading,
	onPageChange,
}: TaskListProps) {
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [editingTask, setEditingTask] = useState<string | null>(null);
	const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

	const deleteTaskMutation = useDeleteTask();

	// Handle task deletion
	const handleDeleteTask = async (taskId: string) => {
		try {
			await deleteTaskMutation.mutateAsync(taskId);
			setDeletingTaskId(null);
		} catch (error) {
			console.error('Failed to delete task:', error);
		}
	};

	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle>Your Tasks ({total})</CardTitle>
					<CardDescription>
						{isLoading
							? 'Loading tasks...'
							: `Showing ${tasks.length} of ${total} tasks`}
					</CardDescription>
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<div className='flex items-center justify-center py-8'>
							<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
						</div>
					) : tasks.length === 0 ? (
						<div className='text-center py-8'>
							<p className='text-muted-foreground'>No tasks found</p>
						</div>
					) : (
						<div className='space-y-4'>
							{/* Desktop Table View */}
							<div className='hidden md:block rounded-lg border bg-card'>
								<Table>
									<TableHeader>
										<TableRow className='border-b bg-muted/50'>
											<TableHead className='font-semibold'>Title</TableHead>
											<TableHead className='font-semibold'>
												Description
											</TableHead>
											<TableHead className='font-semibold'>Status</TableHead>
											<TableHead className='font-semibold'>Due Date</TableHead>
											<TableHead className='font-semibold'>Created</TableHead>
											<TableHead className='font-semibold text-center'>
												Actions
											</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{tasks.map((task) => (
											<TableRow
												key={task.id}
												className='hover:bg-muted/50 transition-colors'
											>
												<TableCell className='font-medium py-4'>
													<div className='max-w-[200px] truncate'>
														{task.title}
													</div>
												</TableCell>
												<TableCell className='py-4'>
													<div className='max-w-[250px]'>
														{task.description ? (
															<span className='text-sm text-muted-foreground line-clamp-2'>
																{task.description}
															</span>
														) : (
															<span className='text-sm text-muted-foreground italic'>
																No description
															</span>
														)}
													</div>
												</TableCell>
												<TableCell className='py-4'>
													<Badge
														className={`font-medium ${getStatusBadgeColor(
															task.status
														)}`}
													>
														{getStatusLabel(task.status)}
													</Badge>
												</TableCell>
												<TableCell className='py-4'>
													{task.dueDate ? (
														<span className='text-sm font-medium'>
															{new Date(task.dueDate).toLocaleDateString()}
														</span>
													) : (
														<span className='text-sm text-muted-foreground italic'>
															No due date
														</span>
													)}
												</TableCell>
												<TableCell className='py-4'>
													<span className='text-sm text-muted-foreground'>
														{new Date(task.createdAt).toLocaleDateString()}
													</span>
												</TableCell>
												<TableCell className='py-4 text-center'>
													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<Button
																variant='ghost'
																size='sm'
																className='h-8 w-8 p-0'
															>
																<MoreHorizontal className='h-4 w-4' />
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent align='end' className='w-40'>
															<DropdownMenuItem
																onClick={() => setEditingTask(task.id)}
																className='cursor-pointer'
															>
																<Edit className='mr-2 h-4 w-4' />
																Edit
															</DropdownMenuItem>
															<DropdownMenuItem
																onClick={() => setDeletingTaskId(task.id)}
																className='text-destructive cursor-pointer'
															>
																<Trash2 className='mr-2 h-4 w-4' />
																Delete
															</DropdownMenuItem>
														</DropdownMenuContent>
													</DropdownMenu>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>

							{/* Mobile Card View */}
							<div className='md:hidden space-y-3'>
								{tasks.map((task) => (
									<Card key={task.id} className='p-4'>
										<div className='space-y-3'>
											{/* Title and Actions Row */}
											<div className='flex items-start justify-between gap-2'>
												<h3 className='font-medium text-sm leading-tight flex-1 min-w-0'>
													{task.title}
												</h3>
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button
															variant='ghost'
															size='sm'
															className='h-8 w-8 p-0 flex-shrink-0'
														>
															<MoreHorizontal className='h-4 w-4' />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align='end' className='w-40'>
														<DropdownMenuItem
															onClick={() => setEditingTask(task.id)}
															className='cursor-pointer'
														>
															<Edit className='mr-2 h-4 w-4' />
															Edit
														</DropdownMenuItem>
														<DropdownMenuItem
															onClick={() => setDeletingTaskId(task.id)}
															className='text-destructive cursor-pointer'
														>
															<Trash2 className='mr-2 h-4 w-4' />
															Delete
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</div>

											{/* Description */}
											{task.description && (
												<p className='text-sm text-muted-foreground line-clamp-2'>
													{task.description}
												</p>
											)}

											{/* Status Badge */}
											<div className='flex items-center gap-2'>
												<Badge
													className={`font-medium text-xs ${getStatusBadgeColor(
														task.status
													)}`}
												>
													{getStatusLabel(task.status)}
												</Badge>
											</div>

											{/* Dates */}
											<div className='flex flex-col gap-1 text-xs text-muted-foreground'>
												{task.dueDate && (
													<div className='flex items-center gap-1'>
														<span className='font-medium'>Due:</span>
														<span>
															{new Date(task.dueDate).toLocaleDateString()}
														</span>
													</div>
												)}
												<div className='flex items-center gap-1'>
													<span className='font-medium'>Created:</span>
													<span>
														{new Date(task.createdAt).toLocaleDateString()}
													</span>
												</div>
											</div>
										</div>
									</Card>
								))}
							</div>

							{/* Pagination */}
							{totalPages > 1 && (
								<div className='flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t bg-muted/30'>
									<div className='text-xs sm:text-sm text-muted-foreground font-medium text-center sm:text-left'>
										Page {currentPage} of {totalPages} ({total} total tasks)
									</div>
									<div className='flex items-center gap-2'>
										<Button
											variant='outline'
											size='sm'
											onClick={() => onPageChange(currentPage - 1)}
											disabled={currentPage <= 1}
											className='h-8 text-xs sm:text-sm'
										>
											Previous
										</Button>
										<Button
											variant='outline'
											size='sm'
											onClick={() => onPageChange(currentPage + 1)}
											disabled={currentPage >= totalPages}
											className='h-8 text-xs sm:text-sm'
										>
											Next
										</Button>
									</div>
								</div>
							)}
						</div>
					)}
				</CardContent>
			</Card>

			{/* Create Task Modal */}
			<CreateTaskModal
				open={isCreateModalOpen}
				onOpenChange={setIsCreateModalOpen}
			/>

			{/* Edit Task Modal */}
			{editingTask && (
				<EditTaskModal
					taskId={editingTask}
					open={!!editingTask}
					onOpenChange={(open) => !open && setEditingTask(null)}
				/>
			)}

			{/* Delete Confirmation Dialog */}
			<Dialog
				open={!!deletingTaskId}
				onOpenChange={() => setDeletingTaskId(null)}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Delete Task</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete this task? This action cannot be
							undone.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button variant='outline' onClick={() => setDeletingTaskId(null)}>
							Cancel
						</Button>
						<Button
							variant='destructive'
							onClick={() => deletingTaskId && handleDeleteTask(deletingTaskId)}
							disabled={deleteTaskMutation.isPending}
						>
							{deleteTaskMutation.isPending ? 'Deleting...' : 'Delete'}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
