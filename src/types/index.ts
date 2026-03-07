export type TaskPriority = 'low' | 'medium' | 'high';
export type GoalCategory = 'short_term' | 'mid_term' | 'long_term';
export type Rank = 'Cadet' | 'Senior Cadet' | 'Officer' | 'Commander';

// User
export interface User {
    id: string;
    email: string;
    full_name?: string;
    avatar_url?: string;
    created_at: string;
    updated_at: string;
}

export interface UserSettings {
    id: string;
    user_id: string;
    theme: string;
    strict_mode?: boolean;
    timezone?: string;
    onboarding_completed?: boolean;
    is_premium?: boolean;
    created_at: string;
    updated_at: string;
}

// Routine
export interface DailyRoutine {
    id: string;
    user_id: string;
    routine_date: string;
    item_name: string;
    item_order: number;
    is_completed: boolean;
    completed_at?: string | null;
    notes?: string;
    created_at: string;
    updated_at: string;
}

export interface RoutineCreateInput {
    routine_date: string;
    item_name: string;
    item_order?: number;
    notes?: string;
}

export interface RoutineUpdateInput {
    item_name?: string;
    is_completed?: boolean;
    notes?: string;
    item_order?: number;
}

// Tasks
export interface DailyTask {
    id: string;
    user_id: string;
    task_date: string;
    title: string;
    description?: string;
    priority: TaskPriority;
    is_completed: boolean;
    completed_at?: string | null;
    goal_id?: string;
    created_at: string;
    updated_at: string;
}

export interface TaskCreateInput {
    task_date: string;
    title: string;
    description?: string;
    priority?: TaskPriority;
    goal_id?: string;
}

export interface TaskUpdateInput {
    title?: string;
    description?: string;
    priority?: TaskPriority;
    is_completed?: boolean;
    goal_id?: string;
}

// Goals
export interface Goal {
    id: string;
    user_id: string;
    title: string;
    description?: string;
    category: GoalCategory;
    target_date?: string;
    progress_percentage: number;
    is_archived: boolean;
    created_at: string;
    updated_at: string;
}

export interface GoalCreateInput {
    title: string;
    description?: string;
    category: GoalCategory;
    target_date?: string;
    progress_percentage?: number;
}

export interface GoalUpdateInput {
    title?: string;
    description?: string;
    progress_percentage?: number;
    target_date?: string;
    is_archived?: boolean;
}

// Goal Logs
export interface GoalLog {
    id: string;
    user_id: string;
    goal_id: string;
    entry_text: string;
    progress_increment: number;
    created_at: string;
    updated_at: string;
}

export interface GoalLogCreateInput {
    goal_id: string;
    entry_text: string;
    progress_increment?: number;
}

// Reports
export interface DailyReport {
    id: string;
    user_id: string;
    report_date: string;
    accomplishments?: string;
    failures?: string;
    lessons_learned?: string;
    discipline_score?: number;
    energy_score?: number;
    created_at: string;
    updated_at: string;
}

export interface ReportCreateInput {
    report_date: string;
    accomplishments?: string;
    failures?: string;
    lessons_learned?: string;
    discipline_score?: number;
    energy_score?: number;
}

export interface ReportUpdateInput {
    accomplishments?: string;
    failures?: string;
    lessons_learned?: string;
    discipline_score?: number;
    energy_score?: number;
}

// XP
export interface XPRecord {
    id: string;
    user_id: string;
    amount: number;
    reason: string;
    related_date?: string;
    created_at: string;
}

// Streaks
export interface Streak {
    id: string;
    user_id: string;
    current_streak: number;
    longest_streak: number;
    last_completion_date?: string;
    created_at: string;
    updated_at: string;
}

// Dashboard Stats
export interface DashboardStats {
    date: string;
    routine_completion_percentage: number;
    task_completion_percentage: number;
    active_goals_count: number;
    current_streak: number;
    total_xp: number;
    current_rank: Rank;
}

// API Response Types
export interface ApiResponse<T = any> {
    data?: T;
    error?: string;
    success: boolean;
}

export interface PaginationParams {
    page?: number;
    limit?: number;
    sort?: string;
}
