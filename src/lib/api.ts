// API client configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export class ApiError extends Error {
	constructor(
		message: string,
		public status: number,
		public statusText: string
	) {
		super(message);
		this.name = 'ApiError';
	}
}

// API request function
export async function apiRequest<T>(
	endpoint: string,
	options: RequestInit = {}
): Promise<T> {
	// If endpoint starts with /api/auth, it's a Next.js API route (no base URL needed)
	// If endpoint starts with /api/v1, it's a direct backend call (needs base URL)
	const url = endpoint.startsWith('/api/auth')
		? endpoint
		: `${API_BASE_URL}${endpoint}`;

	const config: RequestInit = {
		headers: {
			'Content-Type': 'application/json',
			...options.headers,
		},
		...options,
	};

	// Add auth token if available (only if we're in the browser)
	if (typeof window !== 'undefined') {
		const token = localStorage.getItem('access_token');
		if (token) {
			config.headers = {
				...config.headers,
				Authorization: `Bearer ${token}`,
			};
		}
	}

	try {
		const response = await fetch(url, config);

		if (!response.ok) {
			const errorText = await response.text();
			let errorMessage = response.statusText;

			try {
				const errorJson = JSON.parse(errorText);
				errorMessage = errorJson.message || errorJson.error || errorText;
			} catch {
				errorMessage = errorText || response.statusText;
			}

			throw new ApiError(errorMessage, response.status, response.statusText);
		}

		return response.json();
	} catch (error) {
		console.error('API request failed:', error);

		// If it's already an ApiError, re-throw it
		if (error instanceof ApiError) {
			throw error;
		}

		// Handle network errors
		if (error instanceof TypeError && error.message === 'Failed to fetch') {
			throw new ApiError(
				'Unable to connect to the server. Please check if the backend is running.',
				0,
				'Network Error'
			);
		}

		// Handle other errors
		throw new ApiError(
			error instanceof Error ? error.message : 'An unknown error occurred',
			0,
			'Unknown Error'
		);
	}
}

// Helper function to handle validation errors
export const handleValidationErrors = <T>(
	response: T & {
		validationErrors?: Array<{ property: string; message: string }>;
	}
): T => {
	if (response.validationErrors && response.validationErrors.length > 0) {
		const errorMessages = response.validationErrors
			.map((err) => `${err.property}: ${err.message}`)
			.join(', ');
		throw new Error(`Validation failed: ${errorMessages}`);
	}
	return response;
};
