import { apiRequest, handleValidationErrors } from '@/lib/api';
import type {
	LoginDto,
	RegisterDto,
	AuthResponseDto,
	UserProfileResponseDto,
} from '@/types/auth';

// Auth service that directly calls the backend API
export const authService = {
	login: async (data: LoginDto): Promise<AuthResponseDto> => {
		const response = await apiRequest<AuthResponseDto>('/api/v1/auth/login', {
			method: 'POST',
			body: JSON.stringify(data),
		});

		return handleValidationErrors(response);
	},

	register: async (data: RegisterDto): Promise<AuthResponseDto> => {
		const response = await apiRequest<AuthResponseDto>(
			'/api/v1/auth/register',
			{
				method: 'POST',
				body: JSON.stringify(data),
			}
		);

		return handleValidationErrors(response);
	},

	getProfile: async (): Promise<UserProfileResponseDto> => {
		const response = await apiRequest<UserProfileResponseDto>(
			'/api/v1/auth/profile'
		);

		return handleValidationErrors(response);
	},
};
