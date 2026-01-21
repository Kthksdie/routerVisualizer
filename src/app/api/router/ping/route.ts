import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const ip = searchParams.get('ip');

    if (!ip) {
        return NextResponse.json({ success: false, error: 'IP address is required' }, { status: 400 });
    }

    // Basic validation to prevent command injection (very simple regex for IPv4)
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(ip)) {
        return NextResponse.json({ success: false, error: 'Invalid IP address format' }, { status: 400 });
    }

    try {
        // Windows ping command: -n 1 (one packet), -w 1000 (timeout 1000ms)
        // Adjust flags for Linux/Mac if needed (-c 1, -W 1)
        const isWindows = process.platform === 'win32';
        const command = isWindows
            ? `ping -n 1 -w 1000 ${ip}`
            : `ping -c 1 -W 1 ${ip}`;

        const { stdout } = await execPromise(command);

        // Parse output for time
        // Windows: "time=2ms" or "time<1ms"
        // Linux/Mac: "time=2.03 ms"
        const timeMatch = stdout.match(/time[=<]([\d\.]+)/i);

        let latency = null;
        if (timeMatch && timeMatch[1]) {
            latency = parseFloat(timeMatch[1]);
        }

        return NextResponse.json({
            success: true,
            ip,
            latency, // in ms
            online: !!latency
        });

    } catch (error) {
        // Ping failed (timeout or unplugged)
        return NextResponse.json({
            success: true,
            ip,
            latency: null,
            online: false
        });
    }
}
