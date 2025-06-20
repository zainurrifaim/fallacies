import { type NextRequest, NextResponse } from "next/server";
import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";

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
             // Check for common client-side errors
            if (response.status >= 400 && response.status < 500) {
                 return NextResponse.json({ error: `Could not access the URL. The site returned a ${response.status} error.` }, { status: response.status });
            }
            return NextResponse.json({ error: `Failed to fetch URL. Server returned status: ${response.status}` }, { status: 500 });
        }

        const html = await response.text();

        // 3. Use JSDOM and Readability.js to parse the HTML and extract the main article
        // We pass the original URL to JSDOM to help it resolve relative links, which Readability uses.
        const doc = new JSDOM(html, { url });
        const reader = new Readability(doc.window.document);
        const article = reader.parse();

        // 4. Check if Readability successfully extracted content
        if (!article || !article.textContent) {
            return NextResponse.json({ error: 'Could not extract readable content from the URL. The page might not be an article.' }, { status: 422 });
        }

        // 5. Clean up the extracted text content
        // The textContent from Readability is already quite clean, but we can still normalize whitespace.
        const cleanedText = article.textContent.replace(/\s+/g, ' ').trim();

        // 6. Return the cleaned text and the article title if available
        return NextResponse.json({ 
            text: cleanedText,
            title: article.title 
        });

    } catch (error) {
        console.error('Error in /api/scrape:', error);
        if (error instanceof Error && error.message.includes('ECONNREFUSED')) {
             return NextResponse.json({ error: 'Could not connect to the provided URL. Please check the address and try again.' }, { status: 500 });
        }
        return NextResponse.json({ error: 'An unexpected error occurred while scraping the URL.' }, { status: 500 });
    }
}
