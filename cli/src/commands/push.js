import { apiRequest } from "../utils/request.js";
import { loadSession } from "../utils/session.js";
import fs from "fs";
import path from "path";

export async function pushComponent(category, title, filepath) { 
    //validaten input
    if (!category || category.trim() === "" || !title || title.trim() === "" || !filepath || filepath.trim() === "") {
        console.log("Category, title, and filepath are required to push a component.");
        return;
    }

    //validate correct filepath
    const absolutePath = path.resolve(filepath);
    if (!fs.existsSync(absolutePath)) {
        console.log(`File not found: ${absolutePath}`);
        return;
    }

    const code = fs.readFileSync(absolutePath, "utf-8");

    // Check session
    const session = loadSession();
    if (!session || !session.jwt) {
        console.log("You must be logged in. Run: composter login");
        return;
    }

    try {
        // Send request
        const res = await apiRequest("/components", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, code, category }),
        });

        // Parse JSON once
        let body = null;
        try {
            body = await res.json();
        } catch {
            // Ignore if no JSON
        }

        // Handle auth failure
        if (res.status === 401) {
            console.log("Session expired. Run composter login again.");
            return;
        }

        // Handle server errors
        if (res.status >= 500) {
            console.log("Server error. Try again later.");
            return;
        }

        // Handle success
        if (res.ok) {
            console.log(`Component '${title}' pushed successfully under category '${category}'!`);
            console.log("ID:", body?.component?.id);
            return;
        }

        // Handle other errors
        const errorMessage =
            (body && (body.message || body.error || JSON.stringify(body))) ||
            res.statusText ||
            `HTTP ${res.status}`;
        console.log("Error pushing component:", errorMessage);
        return;
    } catch (error) {
        console.log("Error pushing component:", error);
        return;
    }
}