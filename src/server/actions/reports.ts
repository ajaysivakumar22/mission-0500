'use server';

import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { validateDisciplineScore, validateEnergyScore } from '@/lib/utils/validators';
import { verifyCallerIdentity } from '@/server/utils/auth-guard';
import { sanitizeOptional } from '@/server/utils/sanitize';
import type { ApiResponse, DailyReport, ReportCreateInput, ReportUpdateInput } from '@/types';

export async function getReportForDate(
    userId: string,
    date: string
): Promise<ApiResponse<DailyReport | null>> {
    try {
        const verified = await verifyCallerIdentity(userId);
        if (!verified) return { success: false, error: 'Unauthorized' };

        const supabase = supabaseAdmin;

        const { data, error } = await supabase
            .from('daily_reports')
            .select('*')
            .eq('user_id', userId)
            .eq('report_date', date)
            .single();

        if (error?.code === 'PGRST116') {
            // No record found
            return { success: true, data: null };
        }

        if (error) {
            return { success: false, error: 'Failed to fetch report' };
        }

        return { success: true, data };
    } catch (error) {
        return { success: false, error: 'Failed to fetch report' };
    }
}

export async function getAllReports(userId: string): Promise<ApiResponse<DailyReport[]>> {
    try {
        const verified = await verifyCallerIdentity(userId);
        if (!verified) return { success: false, error: 'Unauthorized' };

        const supabase = supabaseAdmin;

        const { data, error } = await supabase
            .from('daily_reports')
            .select('*')
            .eq('user_id', userId)
            .order('report_date', { ascending: false })
            .limit(50);

        if (error) {
            return { success: false, error: 'Failed to fetch reports' };
        }

        return { success: true, data: data || [] };
    } catch (error) {
        return { success: false, error: 'Failed to fetch reports' };
    }
}

export async function getReportsForDateRange(
    userId: string,
    startDate: string,
    endDate: string
): Promise<ApiResponse<DailyReport[]>> {
    try {
        const verified = await verifyCallerIdentity(userId);
        if (!verified) return { success: false, error: 'Unauthorized' };

        const supabase = supabaseAdmin;

        const { data, error } = await supabase
            .from('daily_reports')
            .select('*')
            .eq('user_id', userId)
            .gte('report_date', startDate)
            .lte('report_date', endDate)
            .order('report_date', { ascending: false });

        if (error) {
            return { success: false, error: 'Failed to fetch reports' };
        }

        return { success: true, data: data || [] };
    } catch (error) {
        return { success: false, error: 'Failed to fetch reports' };
    }
}

export async function createReport(
    userId: string,
    input: ReportCreateInput
): Promise<ApiResponse<DailyReport>> {
    try {
        const verified = await verifyCallerIdentity(userId);
        if (!verified) return { success: false, error: 'Unauthorized' };

        // Validate scores if provided
        if (input.discipline_score && !validateDisciplineScore(input.discipline_score)) {
            return { success: false, error: 'Invalid discipline score (must be 1-10)' };
        }

        if (input.energy_score && !validateEnergyScore(input.energy_score)) {
            return { success: false, error: 'Invalid energy score (must be 1-10)' };
        }

        const supabase = supabaseAdmin;

        // Check if report already exists for this date
        const { data: existing } = await supabase
            .from('daily_reports')
            .select('id')
            .eq('user_id', userId)
            .eq('report_date', input.report_date)
            .single();

        if (existing) {
            // Update instead of create
            return updateReport(userId, existing.id, input);
        }

        const { data, error } = await supabase
            .from('daily_reports')
            .insert({
                user_id: userId,
                report_date: input.report_date,
                accomplishments: sanitizeOptional(input.accomplishments),
                failures: sanitizeOptional(input.failures),
                lessons_learned: sanitizeOptional(input.lessons_learned),
                discipline_score: input.discipline_score,
                energy_score: input.energy_score,
            })
            .select()
            .single();

        if (error) {
            return { success: false, error: 'Failed to create report' };
        }

        revalidatePath('/report');
        revalidatePath('/dashboard');
        return { success: true, data };
    } catch (error) {
        return { success: false, error: 'Failed to create report' };
    }
}

export async function updateReport(
    userId: string,
    reportId: string,
    input: ReportUpdateInput
): Promise<ApiResponse<DailyReport>> {
    try {
        const verified = await verifyCallerIdentity(userId);
        if (!verified) return { success: false, error: 'Unauthorized' };

        // Validate scores if provided
        if (input.discipline_score && !validateDisciplineScore(input.discipline_score)) {
            return { success: false, error: 'Invalid discipline score (must be 1-10)' };
        }

        if (input.energy_score && !validateEnergyScore(input.energy_score)) {
            return { success: false, error: 'Invalid energy score (must be 1-10)' };
        }

        const supabase = supabaseAdmin;

        const updateData: Partial<DailyReport> = {};

        if (input.accomplishments !== undefined) updateData.accomplishments = sanitizeOptional(input.accomplishments);
        if (input.failures !== undefined) updateData.failures = sanitizeOptional(input.failures);
        if (input.lessons_learned !== undefined) updateData.lessons_learned = sanitizeOptional(input.lessons_learned);
        if (input.discipline_score !== undefined) updateData.discipline_score = input.discipline_score;
        if (input.energy_score !== undefined) updateData.energy_score = input.energy_score;

        const { data, error } = await supabase
            .from('daily_reports')
            .update(updateData)
            .eq('id', reportId)
            .eq('user_id', userId)
            .select()
            .single();

        if (error) {
            return { success: false, error: 'Failed to update report' };
        }

        revalidatePath('/report');
        revalidatePath('/dashboard');
        return { success: true, data };
    } catch (error) {
        return { success: false, error: 'Failed to update report' };
    }
}

export async function deleteReport(
    userId: string,
    reportId: string
): Promise<ApiResponse> {
    try {
        const verified = await verifyCallerIdentity(userId);
        if (!verified) return { success: false, error: 'Unauthorized' };

        const supabase = supabaseAdmin;

        const { error } = await supabase
            .from('daily_reports')
            .delete()
            .eq('id', reportId)
            .eq('user_id', userId);

        if (error) {
            return { success: false, error: 'Failed to delete report' };
        }

        revalidatePath('/report');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to delete report' };
    }
}

export async function getWeeklyAverageScores(
    userId: string,
    endDate: string
): Promise<
    ApiResponse<{
        averageDiscipline: number;
        averageEnergy: number;
        reportsCount: number;
    }>
> {
    try {
        const verified = await verifyCallerIdentity(userId);
        if (!verified) return { success: false, error: 'Unauthorized' };

        const supabase = supabaseAdmin;

        // Get last 7 days
        const startDate = new Date(endDate);
        startDate.setDate(startDate.getDate() - 6);

        const { data, error } = await supabase
            .from('daily_reports')
            .select('discipline_score, energy_score')
            .eq('user_id', userId)
            .gte('report_date', startDate.toISOString().split('T')[0])
            .lte('report_date', endDate);

        if (error) {
            return { success: false, error: 'Failed to fetch weekly averages' };
        }

        if (!data || data.length === 0) {
            return {
                success: true,
                data: { averageDiscipline: 0, averageEnergy: 0, reportsCount: 0 },
            };
        }

        const validReports = data.filter(r => r.discipline_score && r.energy_score);

        if (validReports.length === 0) {
            return {
                success: true,
                data: { averageDiscipline: 0, averageEnergy: 0, reportsCount: 0 },
            };
        }

        const avgDiscipline =
            validReports.reduce((sum, r) => sum + (r.discipline_score || 0), 0) / validReports.length;
        const avgEnergy =
            validReports.reduce((sum, r) => sum + (r.energy_score || 0), 0) / validReports.length;

        return {
            success: true,
            data: {
                averageDiscipline: Math.round(avgDiscipline * 100) / 100,
                averageEnergy: Math.round(avgEnergy * 100) / 100,
                reportsCount: validReports.length,
            },
        };
    } catch (error) {
        return { success: false, error: 'Failed to fetch weekly averages' };
    }
}
