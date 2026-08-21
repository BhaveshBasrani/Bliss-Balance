const host = 'blissbalance.co';
const key = 'c89a01f782e541b0b2e8d91c2b5d4e10';
const keyLocation = `https://${host}/indexnow_key.txt`;

const urlList = [
    `https://${host}/`,
    `https://${host}/men`,
    `https://${host}/women`,
    `https://${host}/collections`,
    `https://${host}/about`,
    `https://${host}/faq`,
];

const payload = {
    host,
    key,
    keyLocation,
    urlList,
};

async function pingIndexNow() {
    console.log("Pinging IndexNow...");
    try {
        const res = await fetch('https://api.indexnow.org/indexnow', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
            body: JSON.stringify(payload),
        });

        if (res.ok) {
            console.log("Successfully pinged IndexNow! Status:", res.status);
        } else {
            console.error("IndexNow ping failed with status:", res.status);
            const text = await res.text();
            console.error("Response:", text);
            process.exit(1);
        }
    } catch (error) {
        console.error("Error pinging IndexNow:", error);
        process.exit(1);
    }
}

pingIndexNow();
