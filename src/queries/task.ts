import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '@/services/task';
import type {
	CreateTaskDto,
	UpdateTaskDto,
	TaskQueryParams,
} from '@/types/task';

// Query keys
export const taskKeys = {
	all: ['tasks'] as const,
	lists: () => [...taskKeys.all, 'list'] as const,
	list: (params?: TaskQueryParams) => [...taskKeys.lists(), params] as const,
	details: () => [...taskKeys.all, 'detail'] as const,
	detail: (id: string) => [...taskKeys.details(), id] as const,
	stats: () => [...taskKeys.all, 'stats'] as const,
};

// Get tasks with filtering and pagination
export const useTasks = (params?: TaskQueryParams) => {
	return useQuery({
		queryKey: taskKeys.list(params),
		queryFn: () => taskService.getTasks(params),
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});
};

// Get a specific task
export const useTask = (id: string) => {
	return useQuery({
		queryKey: taskKeys.detail(id),
		queryFn: () => taskService.getTask(id),
		enabled: !!id,
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});
};

// Get task statistics
export const useTaskStats = () => {
	return useQuery({
		queryKey: taskKeys.stats(),
		queryFn: () => taskService.getTaskStats(),
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});
};

// Create a new task
export const useCreateTask = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateTaskDto) => taskService.createTask(data),
		onSuccess: () => {
			// Invalidate and refetch tasks list and stats
			queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
			queryClient.invalidateQueries({ queryKey: taskKeys.stats() });
		},
		onError: (error) => {
			console.error('Failed to create task:', error);
		},
	});
};

// Update a task
export const useUpdateTask = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateTaskDto }) =>
			taskService.updateTask(id, data),
		onSuccess: (response, { id }) => {
			// Update the specific task in cache
			queryClient.setQueryData(taskKeys.detail(id), response);

			// Invalidate and refetch tasks list and stats
			queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
			queryClient.invalidateQueries({ queryKey: taskKeys.stats() });
		},
		onError: (error) => {
			console.error('Failed to update task:', error);
		},
	});
};

// Delete a task
export const useDeleteTask = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => taskService.deleteTask(id),
		onSuccess: (_, id) => {
			// Remove the task from cache
			queryClient.removeQueries({ queryKey: taskKeys.detail(id) });

			// Invalidate and refetch tasks list and stats
			queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
			queryClient.invalidateQueries({ queryKey: taskKeys.stats() });
		},
		onError: (error) => {
			console.error('Failed to delete task:', error);
		},
	});
};
