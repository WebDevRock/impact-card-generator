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

        const { project, introduction, bgColour, cardTitleColour, cardBgColour, cardTextColour, txtColour, template, bannerImage } =
            req.body;
        const optionalSegments = JSON.parse(req.body.optionalSegments);

        const configuration1 = {
            type: "doughnut", // or 'doughnut'
            data: {
                labels: [
                    "Local Residents",
                    "Schools & Educational Institutions",
                    "Community Groups & Volunteer Organisations",
                    "Health & Wellbeing Organisations (e.g. NHS Trusts, Mental Health Charities)",
                ],
                datasets: [
                    {
                        data: [10, 20, 30, 40],
                        backgroundColor: [
                            "rgba(229, 62, 62, 0.4)", // Red with 40% opacity
                            "rgba(49, 130, 206, 0.4)", // Blue with 40% opacity
                            "rgba(56, 161, 105, 0.4)", // Green with 40% opacity
                            "rgba(57, 151, 150, 0.4)", // Teal with 40% opacity
                        ],
                    },
                ],
            },
            options: {
                plugins: {
                    legend: {
                        display: true,
                        position: "bottom",
                        labels: {
                            boxWidth: 20,
                            padding: 10,
                            font: {
                                size: 15,
                            },
                        },
                    },
                },
            },
        };
        const configuration2 = {
            type: "doughnut", // or 'doughnut'
            data: {
                labels: [
                    "Increased uptake of gardening",
                    "Enhance Wellbeing Through Proximity to Green Spaces",
                    "Increased Biodiversity Through Green Space Enhancement",
                ],
                datasets: [
                    {
                        data: [10, 20, 5],
                        backgroundColor: [
                            "rgba(229, 62, 62, 0.4)", // Red with 40% opacity
                            "rgba(49, 130, 206, 0.4)", // Blue with 40% opacity
                            "rgba(56, 161, 105, 0.4)", // Green with 40% opacity
                        ],
                    },
                ],
            },
            options: {
                plugins: {
                    legend: {
                        display: true,
                        position: "bottom",
                        labels: {
                            boxWidth: 20,
                            padding: 10,
                            font: {
                                size: 15,
                            },
                        },
                    },
                },
            },
        };
        const configuration3 = {
            type: "doughnut", // or 'doughnut'
            data: {
                labels: [
                    "Responsible Consumption and Production",
                    "Sustainable Cities and Communities",
                    "Life on Land",
                ],
                datasets: [
                    {
                        data: [70, 5, 80],
                        backgroundColor: [
                            "rgba(229, 62, 62, 0.4)", // Red with 40% opacity
                            "rgba(49, 130, 206, 0.4)", // Blue with 40% opacity
                            "rgba(56, 161, 105, 0.4)", // Green with 40% opacity
                        ],
                    },
                ],
            },
            options: {
                plugins: {
                    legend: {
                        display: true,
                        position: "bottom",
                        labels: {
                            boxWidth: 20,
                            padding: 10,
                            font: {
                                size: 15,
                            },
                        },
                    },
                },
            },
        };

        const chart1Image = await chartJSNodeCanvas.renderToDataURL({
           configuration1
        });
        const chart2Image = await chartJSNodeCanvas.renderToDataURL({
           configuration2
        });
        const chart3Image = await chartJSNodeCanvas.renderToDataURL({
           configuration3
        });

        let logoImage = "";
        if (req.file) {
            logoImage = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
        } else {
            const fallbackPath = path.join(
                process.cwd(),
                "public/social-value-engine-logo.png"
            );
            const imageBuffer = fs.readFileSync(fallbackPath);
            logoImage = `data:image/png;base64,${imageBuffer.toString("base64")}`;
        }

        const htmlContent = await buildHtmlFromTemplate({
            template,
            introduction,
            bgColour,
            txtColour,
            bannerImage,
            backgroundImage,
            cardBgColour,
            cardTitleColour,
            cardTextColour,
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
        const bodyHeight = await page.evaluate(() => {
            return document.body.scrollHeight;
        });

        // Convert px to mm (1px ≈ 0.264583mm)
        const heightInMm = bodyHeight * 0.264583;
        const pdfBuffer = await page.pdf({
            landscape: false,
            printBackground: true,
            margin: { top: "0mm", right: "0mm", bottom: "0mm", left: "0mm" },
            width: "210mm",
            height: "auto",
            height: `${heightInMm}mm`,
        });

        await browser.close();

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
