import { NextResponse } from 'next/server';
import { getNetgearClient } from '@/lib/netgear-client';

export async function GET() {
    try {
        const client = getNetgearClient();
        await client.login();
        const stats = await client.getTrafficMeter();

        return NextResponse.json({
            success: true,
            stats
        });
    } catch (error: any) {
        console.error('Traffic stats fetch error:', error);
        // Some routers might not support this or it might be disabled
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to fetch traffic stats' },
            // Use 200 with error field so frontend can fail gracefully without crashing
            { status: 200 }
        );
    }
}
