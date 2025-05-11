import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import multer from "multer";
import { promisify } from "util";
import { ChartJSNodeCanvas } from "chartjs-node-canvas";
import { buildHtmlFromTemplate } from "../../utils/buildHtmlFromTemplate";

export const config = {
    api: {
        bodyParser: false,
    },
};

const width = 700;
const height = 250;
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

const upload = multer({ storage: multer.memoryStorage() });
const uploadMiddleware = promisify(upload.single("image"));

export default async function handler(req, res) {
    try {
        await uploadMiddleware(req, res);

        const { project, introduction, bgColour, txtColour, template } = req.body;
        const optionalSegments = JSON.parse(req.body.optionalSegments);

        const chart1Image = await chartJSNodeCanvas.renderToDataURL({ /* ...chart config 1... */ });
        const chart2Image = await chartJSNodeCanvas.renderToDataURL({ /* ...chart config 2... */ });
        const chart3Image = await chartJSNodeCanvas.renderToDataURL({ /* ...chart config 3... */ });

        let logoImage = "";
        if (req.file) {
            logoImage = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
        } else {
            const fallbackPath = path.join(process.cwd(), "public/social-value-engine-logo.png");
            const imageBuffer = fs.readFileSync(fallbackPath);
            logoImage = `data:image/png;base64,${imageBuffer.toString("base64")}`;
        }

        const htmlContent = await buildHtmlFromTemplate({
            template,
            introduction,
            bgColour,
            txtColour,
            project,
            optionalSegments,
            logoImage,
            chart1Image,
            chart2Image,
            chart3Image,
        });
        console.log("Generated HTML preview length:", htmlContent?.length);
        
        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: "networkidle0" });
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const pdfBuffer = await page.pdf({
            format: "A4",
            landscape: false,
            printBackground: true,
            margin: { top: "0mm", right: "0mm", bottom: "0mm", left: "0mm" },
            preferCSSPageSize: true,
        });

        await browser.close();

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", 'attachment; filename="ImpactCard.pdf"');
        res.end(pdfBuffer);
    } catch (error) {
        console.error("Error generating PDF:", error);
        res.status(500).json({ error: "Failed to generate PDF." });
    }
}