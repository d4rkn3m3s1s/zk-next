const cheerio = require("cheerio");
const { json, errorJson } = require("../../utils/response");
const puppeteer = require("puppeteer");

exports.index = async (req, res) => {
  try {
    let q = req.query.query;
    let url;
    if (q === undefined || q === "") {
      return errorJson(res, "Please provide query search!");
    } else {
      // Use sName for specific name search and sQuickSearch=yes to mimic the quick search bar
      url = `${process.env.BASE_URL}/results.php3?sQuickSearch=yes&sName=${q}`;
    }

    const browser = await puppeteer.launch({
      headless: "new",
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36');
    await page.goto(url, {
      waitUntil: "networkidle2", // Wait until the network is idle to ensure all elements are fully loaded
    });

    let content = await page.content(); // Get page content as HTML
    let $ = cheerio.load(content);

    // const htmlResult = await request.get(url);
    // const $ = await cheerio.load(htmlResult);
    const title = $(".article-info-name").text();
    const fs = require('fs');
    fs.appendFileSync('debug_log.txt', `Date: ${new Date().toISOString()}\nQuery: ${q}\nURL: ${page.url()}\nTitle: ${title}\nFound: ${$(".makers ul li").length} items\n\n`);

    const phones = [];
    $(".makers")
      .children("ul")
      .children("li")
      .each((index, el) => {
        const slug = $(el).children("a").attr("href").replace(".php", "");
        const image = $(el).find("img").attr("src");
        const phone_name = $(el).children("a").find("br").get(0)
          .nextSibling.nodeValue;
        const brand = $(el).children("a").text().replace(phone_name, "");
        phones.push({
          brand,
          phone_name,
          slug,
          image,
          detail: req.protocol + "://" + req.get("host") + "/" + slug,
        });
      });
    await browser.close();
    return json(res, {
      title,
      phones,
    });
  } catch (error) {
    console.error("Puppeteer Search Error:", error);
    const fs = require('fs');
    fs.appendFileSync('error_log.txt', new Date().toISOString() + ' - ' + error.stack + '\n');
    return errorJson(res, error);
  }
};
