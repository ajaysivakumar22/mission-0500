#!/usr/bin/env node

/**
 * Database Backup Script
 * 
 * Exports all user-facing tables from Supabase to JSON files.
 * Run manually or schedule via cron / GitHub Actions.
 * 
 * Usage:
 *   npx tsx scripts/db-backup.ts
 * 
 * Requires SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL env vars.
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const TABLES = [
    'users',
    'daily_routines',
    'daily_tasks',
    'goals',
    'goal_logs',
    'daily_reports',
    'xp_records',
    'user_settings',
    'user_medals',
    'user_feedbacks',
    'subscriptions',
];

async function backup() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(process.cwd(), 'backups', timestamp);
    fs.mkdirSync(backupDir, { recursive: true });

    console.log(`Starting backup to ${backupDir}`);
    let totalRows = 0;

    for (const table of TABLES) {
        try {
            const { data, error } = await supabase
                .from(table)
                .select('*')
                .limit(10000);

            if (error) {
                console.warn(`  ⚠ ${table}: ${error.message}`);
                continue;
            }

            const rows = data || [];
            totalRows += rows.length;
            const filePath = path.join(backupDir, `${table}.json`);
            fs.writeFileSync(filePath, JSON.stringify(rows, null, 2));
            console.log(`  ✓ ${table}: ${rows.length} rows`);
        } catch (err) {
            console.warn(`  ⚠ ${table}: failed to export`);
        }
    }

    console.log(`\nBackup complete: ${totalRows} total rows across ${TABLES.length} tables`);
    console.log(`Location: ${backupDir}`);
}

backup().catch(console.error);
