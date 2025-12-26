import { prisma } from "./lib/prisma"
import { sendSMS } from "./lib/sms"

async function debugDirect() {
    const settings = await prisma.settings.findFirst();
    console.log("Using Settings FROM DB:", {
        url: settings?.smsGatewayUrl,
        key: settings?.smsGatewayApiKey ? "SET" : "NOT SET"
    });

    const res = await sendSMS("+905464022835", "Direct DB Test");
    console.log("Result:", res);
    process.exit(0);
}
debugDirect();
