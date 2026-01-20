'use client';

import { useEffect, useState } from 'react';
import { RouterStatus } from '@/components/RouterStatus';
import { TrafficStats } from '@/components/TrafficStats';
import { DeviceList } from '@/components/DeviceList';

export default function Home() {
  const [session, setSession] = useState<any>(null);
  const [devices, setDevices] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setError(null);

      // Login
      const loginRes = await fetch('/api/router/login', { method: 'POST' });
      const loginData = await loginRes.json();

      if (!loginData.success) {
        throw new Error(loginData.error || 'Login failed');
      }
      setSession(loginData.session);

      // Fetch Devices
      const devicesRes = await fetch('/api/router/devices');
      const devicesData = await devicesRes.json();
      if (devicesData.success) {
        setDevices(devicesData.devices);
      }

      // Fetch Traffic
      const trafficRes = await fetch('/api/router/traffic');
      const trafficData = await trafficRes.json();
      if (trafficData.success) {
        setStats(trafficData.stats);
      }

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to connect to router');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Netgear Gateway</h1>
          <div className="text-sm text-muted-foreground">
            {loading ? 'Refreshing...' : 'Auto-refresh: 30s'}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Status Column */}
          <div className="space-y-6">
            <RouterStatus session={session} error={error} />
            <TrafficStats stats={stats} />
          </div>

          {/* Devices Column (Spans 2) */}
          <div className="lg:col-span-2">
            <DeviceList devices={devices} />
          </div>
        </div>
      </div>
    </main>
  );
}
