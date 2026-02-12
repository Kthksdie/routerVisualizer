const Netgear = require('netgear');
const fs = require('fs');
const env = fs.readFileSync('.env', 'utf8');
env.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
        process.env[key.trim()] = value.trim();
    }
});

async function test() {

    const client = new Netgear({
        password: process.env.ROUTER_PASSWORD,
        host: process.env.ROUTER_IP || '192.168.1.1',
        user: process.env.ROUTER_USERNAME || 'admin',
        port: process.env.ROUTER_PORT ? parseInt(process.env.ROUTER_PORT) : 80,
    });

    try {
        console.log('Logging in...');
        await client.login();
        console.log('Logged in!');

        console.log('Netgear methods:');
        const proto = Object.getPrototypeOf(client);
        const methods = Object.getOwnPropertyNames(proto);
        for (let i = 0; i < methods.length; i++) {
            const method = methods[i];

            if (!method.startsWith('get')) {
                continue;
            }

            try {
                let response = await client[method]();

                console.log(`// > ${method.padEnd(32)} | Success!`, response);
            }
            catch (e) {
                if (e.message == 'socket hang up') {
                    console.log(`// > ${method.padEnd(32)} | Failed: UNSUPPORTED`);
                }
                else {
                    console.log(`// > ${method.padEnd(32)} | Failed: ${e.message}`);
                }
            }

            console.log();
        }

        console.log();

    } catch (e) {
        console.error('Login failed:', e);
    }
}

test();
