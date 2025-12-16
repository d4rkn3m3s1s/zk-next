export interface MobileDeviceConfig {
    brand: string;
    brand_slug?: string;
    phone_name: string;
    phone_name_slug: string;
    phone_img_url: string;
    specifications?: any;
    detail?: string; // from API
}

const API_BASE_URL = 'http://localhost:4000';

export async function searchDevices(query: string): Promise<MobileDeviceConfig[]> {
    if (!query || query.length < 2) return [];

    try {
        const res = await fetch(`${API_BASE_URL}/search?query=${encodeURIComponent(query)}`);
        if (!res.ok) return [];
        const data = await res.json();
        // V2 search returns { data: { phones: [...] } } or just { phones: [...] } ?
        // searchController returns json(res, { title, phones }) -> { success: true, data: { title, phones } } usually? 
        // utils/response.js 'json' wrapper usually puts it in 'data'.

        // Let's assume standard response wrapper from utils
        const phones = data.data?.phones || data.phones || [];

        return phones.map((p: any) => ({
            brand: p.brand,
            phone_name: p.phone_name,
            phone_name_slug: p.slug, // V2 uses 'slug'
            phone_img_url: p.image, // V2 uses 'image'
            detail: p.detail
        }));
    } catch (error) {
        console.error("Error searching devices:", error);
        return [];
    }
}

export async function getDeviceSpecs(slug: string) {
    try {
        // V2 route is /:slug
        const res = await fetch(`${API_BASE_URL}/${slug}`);
        if (!res.ok) return null;
        const data = await res.json();
        return data.data;
    } catch (error) {
        console.error("Error fetching device specs:", error);
        return null;
    }
}
