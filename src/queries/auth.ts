import { useMutation, useQuery } from '@tanstack/react-query';
import { authService } from '@/services/auth';

export const useLogin = () => {
	return useMutation({
		mutationFn: authService.login,
		onSuccess: (response) => {
			const { data } = response;

			// Store token in localStorage
			localStorage.setItem('access_token', data.access_token);
			localStorage.setItem('user', JSON.stringify(data.user));
		},
	});
};

export const useRegister = () => {
	return useMutation({
		mutationFn: authService.register,
		onSuccess: (response) => {
			const { data } = response;

			// Store token in localStorage
			localStorage.setItem('access_token', data.access_token);
			localStorage.setItem('user', JSON.stringify(data.user));
		},
	});
};

export const useProfile = () => {
	return useQuery({
		queryKey: ['profile'],
		queryFn: async () => {
			const response = await authService.getProfile();
			return response.data;
		},
		enabled: !!localStorage.getItem('access_token'),
		retry: false,
	});
};
