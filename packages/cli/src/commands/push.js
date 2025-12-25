import { apiRequest } from "../utils/request.js";
import fs from "fs";
import path from "path";
import { scanComponent } from "../utils/crawler.js"; 
import { log } from "../utils/log.js";

export async function pushComponent(category, title, filepath) { 
    // 1. Validate Input
    // although commander ensures these are provided, we double-check here
    if (!category?.trim() || !title?.trim() || !filepath?.trim()) {
        log.error("Category, title, and filepath are required.");
        return;
    }

    // 2. Validate Entry File
    const absolutePath = path.resolve(filepath);
    if (!fs.existsSync(absolutePath)) {
        log.error(`File not found: ${absolutePath}`);
        return;
    }

    // 4. RUN THE CRAWLER
    log.info(`Scanning ${path.basename(absolutePath)} and its dependencies...`);
    
    const { files, dependencies } = scanComponent(absolutePath);
    
    const fileCount = Object.keys(files).length;
    const depCount = Object.keys(dependencies).length;

    log.info(`📦 Bundled ${fileCount} file(s) and detected ${depCount} external package(s).`);

        // 5. Send Request
        // We send 'files' as a JSON string because your DB 'code' column is a String.
        const res = await apiRequest("/components", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                title, 
                category,
                code: JSON.stringify(files), 
                dependencies: dependencies   
            }),
        });

        // 6. Handle Response
        let body = null;
        try { body = await res.json(); } catch {}

        if (res.ok) {
            log.success(`Success! Component '${title}' pushed to '${category}'.`);
            return;
        }

        // handle client errors, e.g., 4xx (bad request, conflict, etc.)
        const errorMessage = body?.message || body?.error || res.statusText;
        log.error(`Error pushing component: ${errorMessage}`);
}