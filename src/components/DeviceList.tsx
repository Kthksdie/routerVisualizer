'use client';

import { Laptop, Smartphone, Tv, Wifi } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const getDeviceIcon = (details: any) => {
    // Simple heuristic for icons
    const type = details.DeviceName?.toLowerCase() || '';
    if (type.includes('phone') || type.includes('android') || type.includes('iphone')) return <Smartphone className="h-4 w-4" />;
    if (type.includes('tv') || type.includes('chromecast')) return <Tv className="h-4 w-4" />;
    return <Laptop className="h-4 w-4" />;
};

export function DeviceList({ devices }: { devices: any[] }) {
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
                                    <p className="text-xs text-muted-foreground">{device.IP}</p>
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
