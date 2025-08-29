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

// Task query parameters schema
export const TaskQuerySchema = z.object({
	title: z.string().optional(),
	description: z.string().optional(),
	status: TaskStatusSchema.optional(),
	dueDate: z.string().optional(),
	createdAt: z.string().optional(),
	page: z.number().min(1).optional().default(1),
	limit: z.number().min(1).max(100).optional().default(10),
	sortBy: z
		.enum(['createdAt', 'dueDate', 'title', 'status'])
		.optional()
		.default('createdAt'),
	sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

// Task filters schema for form validation
export const TaskFiltersSchema = z.object({
	title: z.string().optional().default(''),
	description: z.string().optional().default(''),
	status: z
		.union([TaskStatusSchema, z.literal('all')])
		.optional()
		.default('all'),
	dueDate: z.string().optional().default(''),
	createdAt: z.string().optional().default(''),
});

// Export types
export type CreateTaskFormData = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskFormData = z.infer<typeof UpdateTaskSchema>;
export type TaskQueryParams = z.infer<typeof TaskQuerySchema>;
export type TaskFiltersFormData = z.infer<typeof TaskFiltersSchema>;
