import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

const BASE_URL = "https://www.gsmarena.com";

async function fetchHtml(url: string) {
    const response = await fetch(url, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
    });
    if (!response.ok) throw new Error(`Fetch failed: ${response.statusText}`);
    return response.text();
}

function successJson(data: any) {
    return NextResponse.json({ status: true, data });
}

function errorJson(error: any, status = 500) {
    return NextResponse.json(
        { status: false, error: `Something went wrong: ${error}` },
        { status }
    );
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { searchParams } = new URL(request.url);
    const { path } = await params;
    const firstPath = path[0];

    try {
        // 1. /api/gsmarena/brands
        if (firstPath === "brands" && path.length === 1) {
            const html = await fetchHtml(`${BASE_URL}/makers.php3`);
            const $ = cheerio.load(html);
            const brands: any[] = [];
            $("table")
                .find("tr")
                .children("td")
                .each((_: number, el: any) => {
                    const element = $(el).children("a");
                    const device_count = element.find("span").text();
                    const brand_name = element.text().replace(device_count, "");
                    const brand_slug = element.attr("href")?.replace(".php", "") || "";
                    const brand_id = element.attr("href")?.split("-")[2].replace(".php", "") || "";
                    brands.push({
                        brand_id: parseInt(brand_id),
                        brand_name,
                        brand_slug,
                        device_count: parseInt(device_count.replace(" devices", "")),
                    });
                });
            return successJson(brands);
        }

        // 2. /api/gsmarena/brands/:slug
        if (firstPath === "brands" && path.length === 2) {
            const slug = path[1];
            let page = searchParams.get("page") || "1";
            let url = "";

            if (page === "1") {
                url = `${BASE_URL}/${slug}.php`;
            } else {
                const slug_split = slug.split("-");
                const id = slug_split[2];
                const phone_slug = slug_split[0] + "-" + slug_split[1];
                url = `${BASE_URL}/${phone_slug}-f-${id}-0-p${page}.php`;
            }

            const html = await fetchHtml(url);
            const $ = cheerio.load(html);
            const title = $(".article-info-name").text();
            const last_page = $(".nav-pages").find("a").length;
            const phones: any[] = [];
            $(".makers ul li").each((_: number, el: any) => {
                const slug = $(el).children("a").attr("href")?.replace(".php", "") || "";
                const image = $(el).find("img").attr("src");
                const phone_name = $(el).children("a").text();
                phones.push({
                    brand: title.replace("phones", ""),
                    phone_name,
                    slug,
                    image,
                });
            });

            return successJson({
                title,
                current_page: parseInt(page),
                last_page: parseInt(last_page as any) + 1,
                phones,
            });
        }

        // 3. /api/gsmarena/search
        if (firstPath === "search") {
            const query = searchParams.get("s") || searchParams.get("query");
            if (!query) return errorJson("Please provide a search query!", 400);
            const url = `${BASE_URL}/res.php3?sSearch=${encodeURIComponent(query)}`;
            const html = await fetchHtml(url);
            const $ = cheerio.load(html);
            const phones: any[] = [];
            $(".makers ul li").each((_: number, el: any) => {
                const slug = $(el).children("a").attr("href")?.replace(".php", "") || "";
                const image = $(el).find("img").attr("src");
                const phone_name = $(el).children("a").find("span").html()?.split("<br>").join(" ") || $(el).children("a").text();
                phones.push({ phone_name, slug, image });
            });
            return successJson(phones);
        }

        // 4. /api/gsmarena/latest
        if (firstPath === "latest") {
            const html = await fetchHtml(BASE_URL);
            const $ = cheerio.load(html);
            const phones: any[] = [];
            $(".module-latest find a").each((_: number, el: any) => {
                const phone_name = $(el).text();
                const image = $(el).find("img").attr("src");
                const slug = $(el).attr("href")?.replace(".php", "") || "";
                phones.push({ phone_name, slug, image });
            });
            return successJson({ title: "Latest Devices", phones });
        }

        // 5. /api/gsmarena/top-by-interest
        if (firstPath === "top-by-interest") {
            const html = await fetchHtml(BASE_URL);
            const $ = cheerio.load(html);
            const phones: any[] = [];
            $('h4:contains("interest")').next().find("tbody tr").each((_: number, el: any) => {
                const phone_name = $(el).find("th").text();
                if (phone_name) {
                    const slug = $(el).find("th a").attr("href")?.replace(".php", "") || "";
                    const hits = $(el).find("td").eq(1).text();
                    phones.push({ phone_name, slug, hits: parseInt(hits.replace(/,/g, "")) });
                }
            });
            return successJson({ title: "Top By Daily Interest", phones });
        }

        // 6. /api/gsmarena/top-by-fans
        if (firstPath === "top-by-fans") {
            const html = await fetchHtml(BASE_URL);
            const $ = cheerio.load(html);
            const phones: any[] = [];
            $('h4:contains("fans")').next().find("tbody tr").each((_: number, el: any) => {
                const phone_name = $(el).find("th").text();
                if (phone_name) {
                    const slug = $(el).find("th a").attr("href")?.replace(".php", "") || "";
                    const favorites = $(el).find("td").eq(1).text();
                    phones.push({ phone_name, slug, favorites: parseInt(favorites.replace(/,/g, "")) });
                }
            });
            return successJson({ title: "Top By Daily Interest", phones });
        }

        // 7. /api/gsmarena/:slug (Product Details)
        if (path.length === 1) {
            const slug = firstPath;
            const url = `${BASE_URL}/${slug}.php`;
            const html = await fetchHtml(url);
            const $ = cheerio.load(html);

            const phoneTitle = $("h1.specs-phone-name-title").text();
            if (!phoneTitle) throw new Error("Invalid url!");

            const brand = phoneTitle.split(" ")[0];
            const phone_name = phoneTitle.split(brand)[1]?.trim() || "";
            const thumbnail = $(".specs-photo-main a img").attr("src");

            // Multiple images from pictures page
            let phone_images: string[] = [];
            const picturesUrl = $(".specs-photo-main a").attr("href");
            if (picturesUrl) {
                try {
                    const picHtml = await fetchHtml(`${BASE_URL}/${picturesUrl}`);
                    const $pic = cheerio.load(picHtml);
                    $pic("#pictures-list img").each((_, img) => {
                        const src = $pic(img).attr("src");
                        if (src) phone_images.push(src);
                    });
                } catch (e) {
                    console.error("Failed to fetch pictures page", e);
                }
            }

            // If no gallery images found, use thumbnail
            if (phone_images.length === 0 && thumbnail) {
                phone_images = [thumbnail];
            }

            const features = ["Network", "Launch", "Body", "Display", "Platform", "Memory", "Camera", "Main Camera", "Selfie camera", "Sound", "Comms", "Features", "Battery", "Misc", "Tests"];
            const specifications: any[] = [];

            features.forEach((feature) => {
                const featureKey = $('th:contains("' + feature + '")').text();
                // Match exact feature name or check if it starts with it
                if (featureKey && featureKey.toLowerCase().includes(feature.toLowerCase())) {
                    const obj: any = { title: feature, specs: [] };
                    $('th:contains("' + feature + '")').parent().parent().each((_: number, el: any) => {
                        let key_prev: string = "";
                        const tr_count = $(el).children("tr").length;
                        $(el).children("tr").each((idx: number, e: any) => {
                            let key = $(e).children("td.ttl").children("a").text() || $(e).children("td.ttl").text().trim();
                            const val = $(e).children("td.nfo").text().trim();

                            if (!key) {
                                if (idx + 1 === tr_count && !key_prev) {
                                    key = "Other";
                                    obj.specs.push({ key, val: [val] });
                                } else if (key_prev) {
                                    key = key_prev;
                                    const find = obj.specs.find((s: any) => s.key === key);
                                    if (val && find) find.val.push(val);
                                }
                                return;
                            }
                            obj.specs.push({ key, val: [val] });
                            key_prev = key;
                        });
                    });
                    if (obj.specs.length > 0) specifications.push(obj);
                }
            });

            const release_date = $('.icon-launched').next().text().trim();
            const dimension = $('.icon-mobile2').next().text().trim();
            const os = $('.icon-os').next().text().trim();
            const storage = $('.icon-sd-card-0').next().text().trim();

            return successJson({
                brand,
                phone_name,
                thumbnail,
                phone_images,
                release_date,
                dimension,
                os,
                storage,
                specifications
            });
        }

        return errorJson("Route not found", 404);
    } catch (error: any) {
        return errorJson(error.message);
    }
}
