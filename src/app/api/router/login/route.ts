import { NextResponse } from 'next/server';
import { getNetgearClient } from '@/lib/netgear-client';

export async function POST(request: Request) {
    try {
        const client = getNetgearClient();
        const session = await client.login();

        return NextResponse.json({
            success: true,
            message: 'Logged in successfully',
            session
        });
    } catch (error: any) {
        console.error('Login error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to login' },
            { status: 401 }
        );
    }
}
