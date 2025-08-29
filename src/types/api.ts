// API Response wrapper structure
export interface ApiResponse<T = any> {
	message: string;
	validationErrors?: Array<{
		property: string;
		message: string;
	}>;
	data: T;
}
