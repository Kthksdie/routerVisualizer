import { NextResponse } from 'next/server';
import { getNetgearClient } from '@/lib/netgear-client';

export async function GET() {
    try {
        const client = getNetgearClient();
        await client.login();
        const systemLogs = await client.getSystemLogs(true);

        return NextResponse.json({
            success: true,
            systemLogs
        });
    } catch (error: any) {
        console.error('systemLogs fetch error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to fetch systemLogs' },
            { status: 500 }
        );
    }
}
