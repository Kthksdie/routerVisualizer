'use client';

import { useEffect, useState } from 'react';
import { Laptop, Smartphone, Tv, Wifi, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const getDeviceIcon = (details: any) => {
    // Simple heuristic for icons
    const type = details.DeviceName?.toLowerCase() || '';
    if (type.includes('phone') || type.includes('android') || type.includes('iphone')) return <Smartphone className="h-4 w-4" />;
    if (type.includes('tv') || type.includes('chromecast')) return <Tv className="h-4 w-4" />;
    return <Laptop className="h-4 w-4" />;
};

export function DeviceList({ devices }: { devices: any[] }) {
    const [pings, setPings] = useState<Record<string, number | null>>({});
    const [loadingPings, setLoadingPings] = useState<Record<string, boolean>>({});

    useEffect(() => {
        if (!devices) return;

        devices.forEach(device => {
            const ip = device.IP;
            if (ip && ip !== '0.0.0.0' && pings[ip] === undefined && !loadingPings[ip]) {
                fetchPing(ip);
            }
        });
    }, [devices]);

    const fetchPing = async (ip: string) => {
        setLoadingPings(prev => ({ ...prev, [ip]: true }));
        try {
            const res = await fetch(`/api/router/ping?ip=${ip}`);
            const data = await res.json();
            if (data.success && data.online) {
                setPings(prev => ({ ...prev, [ip]: data.latency }));
            } else {
                setPings(prev => ({ ...prev, [ip]: null }));
            }
        } catch (e) {
            console.error(`Failed to ping ${ip}`, e);
            setPings(prev => ({ ...prev, [ip]: null }));
        } finally {
            setLoadingPings(prev => ({ ...prev, [ip]: false }));
        }
    };

    return (
        <Card className="col-span-3">
            <CardHeader>
                <CardTitle>Connected Devices ({devices?.length || 0})</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {devices?.map((device, index) => (
                        <div key={index} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                            <div className="flex items-center space-x-4">
                                <div className="bg-primary/10 p-2 rounded-full">
                                    {getDeviceIcon(device)}
                                </div>
                                <div>
                                    <p className="text-sm font-medium leading-none">{device.Name || 'Unknown Device'}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <p className="text-xs text-muted-foreground">{device.IP}</p>
                                        {device.IP && device.IP !== '0.0.0.0' && (
                                            <div className="flex items-center text-xs text-muted-foreground bg-secondary/50 px-1.5 py-0.5 rounded-md">
                                                <Activity className="h-3 w-3 mr-1" />
                                                {loadingPings[device.IP] ? (
                                                    <span className="animate-pulse">...</span>
                                                ) : pings[device.IP] !== undefined && pings[device.IP] !== null ? (
                                                    <span className={pings[device.IP]! < 10 ? "text-green-500 font-medium" : pings[device.IP]! < 50 ? "text-yellow-500" : "text-red-500"}>
                                                        {pings[device.IP]}ms
                                                    </span>
                                                ) : (
                                                    <span>-</span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium">{device.SignalStrength ? `${device.SignalStrength}%` : 'Wired'}</p>
                                <p className="text-xs text-muted-foreground">{device.MAC}</p>
                            </div>
                        </div>
                    ))}
                    {!devices?.length && (
                        <div className="text-center text-muted-foreground py-4">No devices found</div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
