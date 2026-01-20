import { NextResponse } from 'next/server';
import { getNetgearClient } from '@/lib/netgear-client';

export async function GET() {
    try {
        const client = getNetgearClient();
        await client.login();
        const devices = await client.getAttachedDevices();

        return NextResponse.json({
            success: true,
            devices
        });
    } catch (error: any) {
        console.error('Devices fetch error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to fetch devices' },
            { status: 500 }
        );
    }
}
