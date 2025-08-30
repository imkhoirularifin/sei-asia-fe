// API Response wrapper structure
export interface ApiResponse<T = unknown> {
	message: string;
	validationErrors?: Array<{
		property: string;
		message: string;
	}>;
	data: T;
}
