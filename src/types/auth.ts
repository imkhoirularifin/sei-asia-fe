import { ApiResponse } from './api';

// Auth DTOs based on the API specification
export interface LoginDto {
	username: string;
	password: string;
}

export interface RegisterDto {
	username: string;
	password: string;
}

// Auth response data structure
export interface AuthResponseData {
	access_token: string;
	user: {
		id: string;
		username: string;
		createdAt: string;
		updatedAt: string;
	};
}

// Complete auth response
export interface AuthResponseDto extends ApiResponse<AuthResponseData> {}

export interface User {
	id: string;
	username: string;
	createdAt: string;
	updatedAt: string;
}

// User profile response
export interface UserProfileResponseDto extends ApiResponse<User> {}
