import { z } from 'zod';

// Task status enum schema
export const TaskStatusSchema = z.enum(['not_started', 'in_progress', 'done']);

// Create task schema
export const CreateTaskSchema = z.object({
	title: z
		.string()
		.min(1, 'Title is required')
		.max(255, 'Title must be less than 255 characters'),
	description: z.string().optional(),
	status: TaskStatusSchema,
	dueDate: z
		.string()
		.optional()
		.refine((date) => {
			if (!date) return true;
			const parsedDate = new Date(date);
			return !isNaN(parsedDate.getTime());
		}, 'Invalid date format'),
});

// Update task schema
export const UpdateTaskSchema = z.object({
	title: z
		.string()
		.min(1, 'Title is required')
		.max(255, 'Title must be less than 255 characters')
		.optional(),
	description: z.string().optional(),
	status: TaskStatusSchema.optional(),
	dueDate: z
		.string()
		.optional()
		.refine((date) => {
			if (!date) return true;
			const parsedDate = new Date(date);
			return !isNaN(parsedDate.getTime());
		}, 'Invalid date format'),
});

// Export types
export type CreateTaskFormData = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskFormData = z.infer<typeof UpdateTaskSchema>;
