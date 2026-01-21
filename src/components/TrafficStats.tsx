'use client';

import { ArrowDown, ArrowUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function TrafficStats({ stats }: { stats: any }) {
    if (!stats) return null;

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Current Download</CardTitle>
                    <ArrowDown className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.newTodayDownload || 0} Mbps</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Total: {stats.newMonthDownload || 0} MB
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Current Upload</CardTitle>
                    <ArrowUp className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.newTodayUpload || 0} Mbps</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Total: {stats.newMonthUpload || 0} MB
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
