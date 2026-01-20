'use client';

import { Wifi, Server, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function RouterStatus({ session, error }: { session: any, error: string | null }) {
    if (error) {
        return (
            <Card className="bg-red-50 border-red-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-red-800">Connection Status</CardTitle>
                    <Activity className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-red-900">Disconnected</div>
                    <p className="text-xs text-red-600 mt-1">{error}</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Router Status</CardTitle>
                <Server className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-green-600">Connected</div>
                <p className="text-xs text-muted-foreground mt-1">
                    Model: {session?.modelDescription || 'Unknown'}
                </p>
            </CardContent>
        </Card>
    );
}
