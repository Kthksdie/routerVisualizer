import Netgear from 'netgear';

if (!process.env.ROUTER_PASSWORD) {
  throw new Error('ROUTER_PASSWORD is not defined in environment variables');
}

export const getNetgearClient = () => {
  return new Netgear({
    password: process.env.ROUTER_PASSWORD!,
    host: process.env.ROUTER_IP || '192.168.1.1',
    user: process.env.ROUTER_USERNAME || 'admin',
    port: process.env.ROUTER_PORT ? parseInt(process.env.ROUTER_PORT) : 80,
  });
};
