export interface MobileDeviceConfig {
    brand: string;
    brand_slug?: string;
    phone_name: string;
    phone_name_slug: string;
    phone_img_url: string;
    specifications?: any;
    detail?: string; // from API
}

const API_BASE_URL = '/api/gsmarena';

export async function searchDevices(query: string): Promise<MobileDeviceConfig[]> {
    if (!query || query.length < 2) return [];

    try {
        const res = await fetch(`${API_BASE_URL}/search?query=${encodeURIComponent(query)}`);
        if (!res.ok) return [];
        const data = await res.json();

        // Internal scraper returns { status: true, data: [...] }
        const phones = data.data || [];

        return phones.map((p: any) => ({
            brand: p.brand || "", // Internal search might not have brand directly
            phone_name: p.phone_name,
            phone_name_slug: p.slug,
            phone_img_url: p.image,
            detail: p.detail
        }));
    } catch (error) {
        console.error("Error searching devices:", error);
        return [];
    }
}

export async function getDeviceSpecs(slug: string) {
    try {
        const res = await fetch(`${API_BASE_URL}/${slug}`);
        if (!res.ok) return null;
        const data = await res.json();
        return data.data; // Internal scraper returns { status: true, data: { ...Specs } }
    } catch (error) {
        console.error("Error fetching device specs:", error);
        return null;
    }
}
