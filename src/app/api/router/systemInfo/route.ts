import { NextResponse } from 'next/server';
import { getNetgearClient } from '@/lib/netgear-client';

export async function GET() {
    try {
        const client = getNetgearClient();
        await client.login();
        const systemInfo = await client.getSystemInfo();

        return NextResponse.json({
            success: true,
            systemInfo
        });
    } catch (error: any) {
        console.error('systemInfo fetch error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to fetch systemInfo' },
            { status: 500 }
        );
    }
}
