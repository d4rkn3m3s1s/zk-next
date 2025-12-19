"use server"

const API_BASE_URL = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/gsmarena`

export interface Brand {
    brand_id: number
    brand_name: string
    brand_slug: string
    device_count: number
}

export interface Model {
    brand_name: string
    model_name: string
    model_slug: string
    model_img: string
}

export interface PhoneSpecs {
    brand_name: string
    model_name: string
    model_img: string
    phone_images: string[];
    specifications: Record<string, any>
}

// 1. List All Phone Brands
export async function getBrands(): Promise<Brand[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/brands`, { cache: 'no-store' })
        if (!response.ok) throw new Error("Failed to fetch brands")
        const data = await response.json()
        return data.data || data
    } catch (error) {
        console.error("Error fetching brands:", error)
        return []
    }
}

// 2. List All Models by Phone Brand
export async function getModels(brandName: string): Promise<Model[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/brands/${brandName}`, { cache: 'no-store' })
        if (!response.ok) throw new Error("Failed to fetch models")
        const json = await response.json()
        // Local API returns { status: true, data: { phones: [...] } }
        const phones = json.data?.phones || []

        return phones.map((p: any) => ({
            brand_name: p.brand,
            model_name: p.phone_name,
            model_slug: p.slug,
            model_img: p.image
        }))
    } catch (error) {
        console.error(`Error fetching models for ${brandName}:`, error)
        return []
    }
}

// 3. Get Specifications by Brand Name and Model Name
export async function getPhoneSpecs(brandName: string, modelName: string): Promise<PhoneSpecs | null> {
    try {
        // ModelName here is actually the slug passed from the UI
        const response = await fetch(`${API_BASE_URL}/${modelName}`, { cache: 'no-store' })
        if (!response.ok) throw new Error("Failed to fetch specs")
        const json = await response.json()
        const data = json.data

        // Map specs array to record for UI compatibility
        // API returns: specifications: [ { title: "Network", specs: [ { key: "Technology", val: ["GSM / HSPA"] } ] } ]
        // UI expects: Record<string, any>
        const specsRecord: Record<string, any> = {}
        if (Array.isArray(data.specifications)) {
            data.specifications.forEach((section: any) => {
                const sectionSpecs: Record<string, string> = {}
                if (Array.isArray(section.specs)) {
                    section.specs.forEach((s: any) => {
                        sectionSpecs[s.key] = Array.isArray(s.val) ? s.val.join(", ") : s.val
                    })
                }
                specsRecord[section.title] = sectionSpecs
            })
        }

        return {
            brand_name: data.brand,
            model_name: data.phone_name,
            model_img: data.thumbnail,
            phone_images: data.phone_images || [],
            specifications: specsRecord
        }
    } catch (error) {
        console.error(`Error fetching specs for ${brandName} ${modelName}:`, error)
        return null
    }
}

// 5. Get Phone Image Link by Phone Custom ID (Optional, usually specs have image)
// The docs mention `GET /image/{phoneCustomId}/link`. Since specs might already have `phone_images` or `model_img`, we might not need this immediately.
