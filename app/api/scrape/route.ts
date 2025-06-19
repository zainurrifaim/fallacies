import { type NextRequest, NextResponse } from "next/server";
import * as cheerio from 'cheerio';

// Helper function to validate a URL
function isValidUrl(string: string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

export async function POST(request: NextRequest) {
    try {
        // 1. Get and validate the URL from the request body
        const body = await request.json();
        const { url } = body;

        if (!url || typeof url !== 'string' || !isValidUrl(url)) {
            return NextResponse.json({ error: 'A valid URL is required.' }, { status: 400 });
        }

        // 2. Fetch the HTML content from the provided URL
        const response = await fetch(url, {
            headers: {
                // Mimic a browser user agent to avoid being blocked
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            },
        });

        if (!response.ok) {
            return NextResponse.json({ error: `Failed to fetch URL. Status: ${response.status}` }, { status: 500 });
        }

        const html = await response.text();

        // 3. Use Cheerio to parse the HTML and extract text
        const $ = cheerio.load(html);

        // Remove elements that are typically not part of the main content
        $('script, style, noscript, iframe, header, footer, nav, aside, .ad, .advert, .popup').remove();

        // Find the most likely main content container
        let mainContent = '';
        const selectors = ['article', 'main', '.post-content', '.article-body', 'div[class*="content"]'];
        
        for (const selector of selectors) {
            if ($(selector).length > 0) {
                mainContent = $(selector).text();
                break;
            }
        }
        
        // As a fallback, use the body if no specific container is found
        if (!mainContent) {
            mainContent = $('body').text();
        }

        // 4. Clean up the extracted text
        // - Replace multiple newlines/spaces with a single space
        // - Trim leading/trailing whitespace
        const cleanedText = mainContent.replace(/\s\s+/g, ' ').trim();
        
        if (!cleanedText) {
            return NextResponse.json({ error: 'Could not extract readable content from the URL.' }, { status: 422 });
        }

        // 5. Return the cleaned text
        return NextResponse.json({ text: cleanedText });

    } catch (error) {
        console.error('Error in /api/scrape:', error);
        return NextResponse.json({ error: 'An unexpected error occurred while scraping the URL.' }, { status: 500 });
    }
}
