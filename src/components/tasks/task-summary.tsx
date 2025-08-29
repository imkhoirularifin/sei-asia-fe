'use client';

import { CheckCircle2, Clock, AlertCircle, ListTodo } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useTaskStats } from '@/queries/task';
import type { TaskStats } from '@/types/task';

const statCards = [
	{
		id: 'total',
		label: 'Total Tasks',
		icon: ListTodo,
		color: 'text-blue-600',
		getValue: (stats: TaskStats) => stats.total || 0,
	},
	{
		id: 'not_started',
		label: 'Not Started',
		icon: Clock,
		color: 'text-yellow-600',
		getValue: (stats: TaskStats) => stats.byStatus.not_started || 0,
	},
	{
		id: 'in_progress',
		label: 'In Progress',
		icon: AlertCircle,
		color: 'text-orange-600',
		getValue: (stats: TaskStats) => stats.byStatus.in_progress || 0,
	},
	{
		id: 'done',
		label: 'Completed',
		icon: CheckCircle2,
		color: 'text-green-600',
		getValue: (stats: TaskStats) => stats.byStatus.done || 0,
	},
];

interface TaskSummaryProps {
	className?: string;
}

export function TaskSummary({ className = '' }: TaskSummaryProps) {
	const { data: statsResponse, isLoading, error } = useTaskStats();

	if (isLoading) {
		return (
			<div
				className={`grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 ${className}`}
			>
				{statCards.map((card) => (
					<Card key={card.id}>
						<CardContent className='p-4 sm:p-6'>
							<div className='flex items-center space-x-2'>
								<card.icon className='h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0' />
								<div className='min-w-0'>
									<div className='text-xl sm:text-2xl font-bold bg-muted rounded animate-pulse h-6 w-8'></div>
									<p className='text-xs sm:text-sm text-muted-foreground truncate'>
										{card.label}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		);
	}

	if (error) {
		return (
			<div
				className={`grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 ${className}`}
			>
				{statCards.map((card) => (
					<Card key={card.id}>
						<CardContent className='p-4 sm:p-6'>
							<div className='flex items-center space-x-2'>
								<card.icon className='h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0' />
								<div className='min-w-0'>
									<p className='text-xl sm:text-2xl font-bold text-muted-foreground'>
										--
									</p>
									<p className='text-xs sm:text-sm text-muted-foreground truncate'>
										{card.label}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		);
	}

	const stats = statsResponse?.data;

	return (
		<div
			className={`grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 ${className}`}
		>
			{statCards.map((card) => {
				const Icon = card.icon;
				const value = stats ? card.getValue(stats) : 0;

				return (
					<Card key={card.id}>
						<CardContent className='p-4 sm:p-6'>
							<div className='flex items-center space-x-2'>
								<Icon
									className={`h-4 w-4 sm:h-5 sm:w-5 ${card.color} flex-shrink-0`}
								/>
								<div className='min-w-0'>
									<p className='text-xl sm:text-2xl font-bold'>{value}</p>
									<p className='text-xs sm:text-sm text-muted-foreground truncate'>
										{card.label}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
}
