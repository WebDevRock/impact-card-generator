import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import multer from "multer";
import { promisify } from "util";

// Disable default bodyParser to handle FormData
export const config = {
    api: {
        bodyParser: false,
    },
};

const upload = multer({ storage: multer.memoryStorage() });
const uploadMiddleware = promisify(upload.single("image"));

export default async function handler(req, res) {
    try {
        // Handle file upload
        await uploadMiddleware(req, res);

        const { title, description, impactStats, template } = req.body;
        console.log(title, template);
        let templatePath = path.join(
            process.cwd(),
            `public/templates/${template}.html`
        );
        console.log(templatePath);
        if (!fs.existsSync(templatePath)) {
            return res
                .status(400)
                .json({ error: "Invalid template selection" });
        }

        let htmlContent = fs.readFileSync(templatePath, "utf8");

        // Replace text placeholders
        htmlContent = htmlContent
            .replace("{{title}}", title)
            .replace("{{description}}", description.replace(/\n/g, "<br>"))
            .replace("{{impactStats}}", impactStats);

        // If image exists, convert it to Base64 and embed
        if (req.file) {
            const base64Image = `data:${
                req.file.mimetype
            };base64,${req.file.buffer.toString("base64")}`;
            htmlContent = htmlContent.replace(
                "{{image}}",
                `<img src="${base64Image}" width="200" />`
            );
        } else {
            htmlContent = htmlContent.replace("{{image}}", ""); // Remove placeholder if no image
        }

        // Launch Puppeteer
        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: "networkidle0" });

        // Generate PDF
        const pdfBuffer = await page.pdf({
            format: "A4",
            landscape: true,
            printBackground: true,
            width: "11.6929in",
            height: "8.2677in",
            margin: {
                top: "0"
            },
            preferCSSPageSize: true, // Ensures CSS page breaks are respected
        });

        await browser.close();

        // Send PDF response
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            'attachment; filename="ImpactCard.pdf"'
        );
        res.end(pdfBuffer);
    } catch (error) {
        console.error("Error generating PDF:", error);
        res.status(500).json({ error: "Failed to generate PDF." });
    }
}
