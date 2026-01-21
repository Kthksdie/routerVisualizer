'use client';

import { useEffect, useState, useRef } from 'react';
import './devices.css'; // Import the custom styles

export default function DevicesPage() {
    const [devices, setDevices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [pings, setPings] = useState<Record<string, number | null>>({});
    const containerRef = useRef<HTMLDivElement>(null);

    // Initial Data Fetch
    useEffect(() => {
        const fetchDevices = async () => {
            try {
                const res = await fetch('/api/router/devices');
                const data = await res.json();
                if (data.success) {
                    setDevices(data.devices);
                }
            } catch (error) {
                console.error('Failed to fetch devices:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDevices();
        const interval = setInterval(fetchDevices, 30000);
        return () => clearInterval(interval);
    }, []);

    // Ping Logic
    useEffect(() => {
        if (!devices.length) return;

        devices.forEach(device => {
            const ip = device.IP;
            if (ip && ip !== '0.0.0.0' && pings[ip] === undefined) {
                // Mark as loading (null can mean loading or failed, let's use -1 for loading if needed, 
                // but strictly following the old logic: undefined = not started, null = failed/offline, number = ms)
                // Actually, let's just trigger the fetch.
                fetchPing(ip);
            }
        });
    }, [devices]);

    const fetchPing = async (ip: string) => {
        try {
            const res = await fetch(`/api/router/ping?ip=${ip}`);
            const data = await res.json();
            if (data.success && data.online) {
                setPings(prev => ({ ...prev, [ip]: data.latency }));
            } else {
                setPings(prev => ({ ...prev, [ip]: null }));
            }
        } catch (e) {
            setPings(prev => ({ ...prev, [ip]: null }));
        }
    };

    // Parallax Effect
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return;
            const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
            const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
            containerRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`;
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const getSignalStrength = (device: any) => {
        if (device.SignalStrength) return parseInt(device.SignalStrength);
        // If wired or unknown, maybe default to 100 for visual consistency if wired?
        // The original HTML had "Wired" text in one place, but the meter was variable.
        // Let's assume if it's wired (no signal strength), we show 100% and a different color or label?
        // For now, if no signal strength, return 100 if it's wired (implied).
        return 100;
    };

    const getConnectionType = (device: any) => {
        // Simple heuristic based on original code
        if (device.SignalStrength) return `Wireless ${device.ConnectionType || ''}`;
        return 'Wired Connection';
    };

    if (loading) {
        return <div className="schematic-root flex items-center justify-center h-screen">Loading Schematic...</div>;
    }

    return (
        <div className="schematic-root">
            <div className="schematic-container" ref={containerRef}>
                {devices.map((device, index) => {
                    const signal = getSignalStrength(device);
                    const ip = device.IP || '0.0.0.0';
                    const latency = pings[ip];
                    const isOnline = latency !== null && latency !== undefined; // simplified online check

                    return (
                        <div key={index} className="device-row" style={{ animationDelay: `${index * 0.1}s` }}>
                            <div className="row-connector"></div>

                            {/* Status Cell */}
                            <div className="status-cell">
                                <div className="status-dot" style={{ opacity: isOnline ? 1 : 0.2 }}></div>
                            </div>

                            {/* Identity Cell */}
                            <div className="identity-cell">
                                <div className="mono">Identifier</div>
                                <div className="identity-name">{device.Name || 'UNKNOWN DEVICE'}</div>
                                <div className="data-value" style={{ fontSize: '11px', opacity: 0.6 }}>
                                    MAC: {device.MAC}
                                </div>
                            </div>

                            {/* Address Cell */}
                            <div className="address-cell">
                                <div className="mono">IP Address</div>
                                <div className="data-value">{device.IP}</div>
                                <div className="mono" style={{ marginTop: '4px' }}>
                                    {getConnectionType(device)}
                                </div>
                            </div>

                            {/* Performance Cell */}
                            <div className="performance-cell">
                                <div className="metric-group">
                                    <div className="metric-item">
                                        <div className="mono">Link</div>
                                        <div className="data-value">
                                            {device.LinkSpeed || '--'}
                                            <span style={{ fontSize: '10px', color: 'var(--dim-gray)' }}>MBPS</span>
                                        </div>
                                    </div>
                                    <div className="metric-item">
                                        <div className="mono">Ping</div>
                                        <div className="data-value">
                                            {latency !== undefined ? (latency === null ? '--' : latency) : '...'}
                                            <span style={{ fontSize: '10px', color: 'var(--dim-gray)' }}>MS</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="signal-meter">
                                    <div
                                        className="signal-fill"
                                        style={{
                                            width: `${signal}%`,
                                            background: signal > 50 ? 'var(--ink-white)' : (signal > 20 ? 'yellow' : 'red')
                                        }}
                                    ></div>
                                    <div className="mono" style={{ position: 'absolute', right: 0, top: '-12px' }}>
                                        {device.SignalStrength ? `${signal}%` : 'WIRED'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {!devices.length && (
                    <div className="p-10 text-center mono">NO DEVICES DETECTED</div>
                )}
            </div>
        </div>
    );
}
