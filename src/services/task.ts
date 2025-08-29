import { apiRequest } from '@/lib/api';
import type {
	CreateTaskDto,
	UpdateTaskDto,
	TaskResponseDto,
	PaginatedTaskResponseDto,
	TaskStatsResponseDto,
	TaskQueryParams,
} from '@/types/task';

// Task API endpoints
export const taskService = {
	// Get all tasks with filtering and pagination
	getTasks: async (
		params?: TaskQueryParams
	): Promise<PaginatedTaskResponseDto> => {
		const searchParams = new URLSearchParams();

		if (params) {
			Object.entries(params).forEach(([key, value]) => {
				if (value !== undefined && value !== null && value !== '') {
					searchParams.append(key, String(value));
				}
			});
		}

		const queryString = searchParams.toString();
		const endpoint = `/api/v1/tasks${queryString ? `?${queryString}` : ''}`;

		return apiRequest<PaginatedTaskResponseDto>(endpoint);
	},

	// Get a specific task by ID
	getTask: async (id: string): Promise<TaskResponseDto> => {
		return apiRequest<TaskResponseDto>(`/api/v1/tasks/${id}`);
	},

	// Create a new task
	createTask: async (data: CreateTaskDto): Promise<TaskResponseDto> => {
		return apiRequest<TaskResponseDto>('/api/v1/tasks', {
			method: 'POST',
			body: JSON.stringify(data),
		});
	},

	// Update a task
	updateTask: async (
		id: string,
		data: UpdateTaskDto
	): Promise<TaskResponseDto> => {
		return apiRequest<TaskResponseDto>(`/api/v1/tasks/${id}`, {
			method: 'PATCH',
			body: JSON.stringify(data),
		});
	},

	// Delete a task
	deleteTask: async (id: string): Promise<void> => {
		return apiRequest<void>(`/api/v1/tasks/${id}`, {
			method: 'DELETE',
		});
	},

	// Get task statistics
	getTaskStats: async (): Promise<TaskStatsResponseDto> => {
		return apiRequest<TaskStatsResponseDto>('/api/v1/tasks/stats');
	},
};
