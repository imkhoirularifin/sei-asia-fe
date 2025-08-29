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

const getStatusBadgeVariant = (status: string) => {
	switch (status) {
		case 'not_started':
			return 'secondary';
		case 'in_progress':
			return 'default';
		case 'done':
			return 'outline';
		default:
			return 'secondary';
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
							<div className='rounded-lg border bg-card'>
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
														variant={getStatusBadgeVariant(task.status)}
														className='font-medium'
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

							{/* Pagination */}
							{totalPages > 1 && (
								<div className='flex items-center justify-between px-4 py-3 border-t bg-muted/30'>
									<div className='text-sm text-muted-foreground font-medium'>
										Page {currentPage} of {totalPages} ({total} total tasks)
									</div>
									<div className='flex items-center gap-2'>
										<Button
											variant='outline'
											size='sm'
											onClick={() => onPageChange(currentPage - 1)}
											disabled={currentPage <= 1}
											className='h-8'
										>
											Previous
										</Button>
										<Button
											variant='outline'
											size='sm'
											onClick={() => onPageChange(currentPage + 1)}
											disabled={currentPage >= totalPages}
											className='h-8'
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
