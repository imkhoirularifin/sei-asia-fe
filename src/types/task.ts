import { ApiResponse } from './api';

// Task status enum
export type TaskStatus = 'not_started' | 'in_progress' | 'done';

// Task DTOs based on the API specification
export interface CreateTaskDto {
	title: string;
	description?: string;
	status?: TaskStatus;
	dueDate?: string; // ISO 8601 date string
}

export interface UpdateTaskDto {
	title?: string;
	description?: string;
	status?: TaskStatus;
	dueDate?: string; // ISO 8601 date string
}

// Task response data structure
export interface Task {
	id: string;
	title: string;
	description: string | null;
	status: TaskStatus;
	dueDate: string | null; // ISO 8601 date-time string
	createdBy: string;
	createdAt: string; // ISO 8601 date-time string
	updatedAt: string; // ISO 8601 date-time string
	user: {
		id: string;
		username: string;
		createdAt: string;
		updatedAt: string;
	};
}

// Task response DTOs
export type TaskResponseDto = ApiResponse<Task>;

// Paginated task response
export interface PaginatedTaskResponse {
	tasks: Task[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export type PaginatedTaskResponseDto = ApiResponse<PaginatedTaskResponse>;

// Task statistics
export interface TaskStats {
	total: number;
	overdue: number;
	byStatus: {
		not_started?: number;
		in_progress?: number;
		done?: number;
	};
}

export type TaskStatsResponseDto = ApiResponse<TaskStats>;

// Task query parameters for filtering and pagination
export interface TaskQueryParams {
	title?: string;
	description?: string;
	status?: TaskStatus;
	dueDate?: string;
	createdAt?: string;
	page?: number;
	limit?: number;
	sortBy?: 'createdAt' | 'dueDate' | 'title' | 'status';
	sortOrder?: 'asc' | 'desc';
}

// Task filter state for the UI
export interface TaskFilters {
	title: string;
	description: string;
	status: TaskStatus | 'all';
	dueDate: string;
	createdAt: string;
}

// Task sort state for the UI
export interface TaskSort {
	sortBy: 'createdAt' | 'dueDate' | 'title' | 'status';
	sortOrder: 'asc' | 'desc';
}

// Task pagination state
export interface TaskPagination {
	page: number;
	limit: number;
}
