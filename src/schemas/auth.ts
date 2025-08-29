import { z } from 'zod';

// Login form schema
export const LoginSchema = z.object({
	username: z.string().min(1, 'Username is required'),
	password: z.string().min(1, 'Password is required'),
});

// Register form schema with password confirmation
export const RegisterWithConfirmSchema = z
	.object({
		username: z.string().min(1, 'Username is required'),
		password: z.string().min(6, 'Password must be at least 6 characters'),
		confirmPassword: z.string().min(1, 'Please confirm your password'),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword'],
	});

export type LoginFormData = z.infer<typeof LoginSchema>;
export type RegisterWithConfirmFormData = z.infer<
	typeof RegisterWithConfirmSchema
>;
