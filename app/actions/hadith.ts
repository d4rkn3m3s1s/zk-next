"use server";

export async function getDailyHadith() {
    try {
        const response = await fetch('https://hadiths-api.p.rapidapi.com/collections/639caf9a9ba6cf29e8b8c221', {
            method: 'GET',
            headers: {
                'x-rapidapi-host': 'hadiths-api.p.rapidapi.com',
                'x-rapidapi-key': process.env.RAPIDAPI_HADITH_KEY || ''
            }
        });

        if (!response.ok) throw new Error('API Request Failed');

        const data = await response.json();
        // The API likely returns a collection. We'll pick one random hadith from the response if it's an array, 
        // or just return the data if it's a single object.
        // Assuming the structure based on typical RapidAPI responses, but if it's a collection, it might be inside `data.hadiths` or similar.
        // For now, let's return the whole data and let the component handle it, or try to be safe.

        // If data is an array (list of hadiths)
        if (Array.isArray(data)) {
            const randomIndex = Math.floor(Math.random() * data.length);
            return data[randomIndex];
        }

        // If data has a 'hadiths' array
        if (data.hadiths && Array.isArray(data.hadiths)) {
            const randomIndex = Math.floor(Math.random() * data.hadiths.length);
            return data.hadiths[randomIndex];
        }

        return data;

    } catch (error) {
        console.error("Hadith API Error:", error);
        return null;
    }
}
