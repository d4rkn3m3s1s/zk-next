const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

async function main() {
    const SERVICE_URL = "https://baileys-production-2826.up.railway.app/api";
    const API_KEY = "changeme";

    try {
        const response = await fetch(`${SERVICE_URL}/status`, {
            headers: { 'x-api-key': API_KEY }
        });
        const data = await response.json();
        console.log("Service Status:", JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Failed to fetch status:", error);
    }
}

main();
