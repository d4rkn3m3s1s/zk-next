"use server";

export async function searchPhones(query: string) {
    if (!query || query.length < 2) return [];

    try {
        const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
        const res = await fetch(`${baseUrl}/api/gsmarena/search?query=${query}`, {
            next: { revalidate: 3600 } // Cache for 1 hour
        });

        if (!res.ok) {
            console.error("Phone API Search Error:", res.status, res.statusText);
            return [];
        }

        const data = await res.json();
        return data.phones || [];
    } catch (error) {
        console.error("Phone API Search Failed:", error);
        return [];
    }
}

export async function getPhoneDetails(slug: string) {
    if (!slug) return null;

    try {
        const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
        const res = await fetch(`${baseUrl}/api/gsmarena/${slug}`, {
            next: { revalidate: 86400 } // Cache for 24 hours
        });

        if (!res.ok) return null;

        const data = await res.json();
        return processPhoneData(data);
    } catch (error) {
        console.error("Phone API Details Failed:", error);
        return null;
    }
}

function processPhoneData(data: any) {
    // Map API spec structure to specific fields we need
    // API returns specifications array with title/specs keys.
    const specs = data.specifications || [];

    const getSpecVal = (category: string, keyPartial: string) => {
        const cat = specs.find((s: any) => s.title === category);
        if (!cat) return "N/A";
        const item = cat.specs.find((s: any) => s.key === keyPartial || s.key.includes(keyPartial));
        if (!item) return "N/A";
        return item.val[0];
    }

    // Helper to find specific key in any category
    const findSpec = (key: string) => {
        for (const cat of specs) {
            const found = cat.specs.find((s: any) => s.key.toLowerCase().includes(key.toLowerCase()));
            if (found) return found.val[0];
        }
        return "N/A";
    }

    return {
        id: data.phone_name, // Using name as ID if slug is not unique or helpful
        slug: data.slug, // API doesn't return slug in details? We pass it in.
        name: data.phone_name,
        brand: data.brand,
        image: data.phone_images?.[0] || data.thumbnail,
        price: 0, // Hidden as requested
        specs: {
            cpu: getSpecVal("Platform", "Chipset") !== "N/A" ? getSpecVal("Platform", "Chipset") : findSpec("CPU"),
            ram: getSpecVal("Memory", "Internal"), // Often combined "256GB 8GB RAM"
            storage: getSpecVal("Memory", "Internal"),
            screen: getSpecVal("Display", "Size"),
            resolution: getSpecVal("Display", "Resolution"),
            battery: getSpecVal("Battery", "Type"),
            camera: getSpecVal("Main Camera", "Single") !== "N/A" ? getSpecVal("Main Camera", "Single") : getSpecVal("Main Camera", "Triple"), // Varies
            os: getSpecVal("Platform", "OS"),
            score: Math.floor(Math.random() * (99 - 80) + 80) // Mock score for fun
        }
    };
}
