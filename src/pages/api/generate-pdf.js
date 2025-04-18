// existing imports...
import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import multer from "multer";
import { promisify } from "util";
import { ChartJSNodeCanvas } from "chartjs-node-canvas";

export const config = {
    api: {
        bodyParser: false,
    },
};

const width = 700;
const height = 250;
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

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
                ]
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
            
                ]
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
            
                ]
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

const chart1Image = await chartJSNodeCanvas.renderToDataURL(configuration1);
const chart2Image = await chartJSNodeCanvas.renderToDataURL(configuration2);
const chart3Image = await chartJSNodeCanvas.renderToDataURL(configuration3);

const upload = multer({ storage: multer.memoryStorage() });
const uploadMiddleware = promisify(upload.single("image"));

export default async function handler(req, res) {
    try {
        await uploadMiddleware(req, res);

        const { project, introduction, bgColour, txtColour, template } =
            req.body;
        const optionalSegments = JSON.parse(req.body.optionalSegments);

        let templatePath = path.join(
            process.cwd(),
            `public/templates/${template}.html`
        );
        if (!fs.existsSync(templatePath)) {
            return res
                .status(400)
                .json({ error: "Invalid template selection" });
        }

        let htmlContent = fs.readFileSync(templatePath, "utf8");

        htmlContent = htmlContent.replace(
            "{{introduction}}",
            introduction.replace(/\n/g, "<br>")
        );
        htmlContent = htmlContent.replace(
            "{{backgroundColour}}",
            bgColour.replace(/\n/g, "<br>")
        );
        htmlContent = htmlContent.replace(
            "{{textColour}}",
            txtColour.replace(/\n/g, "<br>")
        );
        htmlContent = htmlContent.replace(
            "{{sroiValue}}",
            '4.97'
        );

        htmlContent = htmlContent.replace(
            "{{project}}",
            project.replace(/\n/g, "<br>")
        );

        Object.entries(optionalSegments).forEach(([key, value]) => {
            if (value) {
                htmlContent = htmlContent.replace(`{{${key}Start}}`, "");
                htmlContent = htmlContent.replace(`{{${key}End}}`, "");
            } else {
                const regex = new RegExp(
                    `{{${key}Start}}[\\s\\S]*?{{${key}End}}`,
                    "g"
                );
                htmlContent = htmlContent.replace(regex, "");
            }
        });

        htmlContent = htmlContent.replace("{{StakeholderChart}}", chart1Image);
        htmlContent = htmlContent.replace("{{OutcomeChart}}", chart2Image);
        htmlContent = htmlContent.replace("{{PriorityChart}}", chart3Image);

        if (req.file) {
            const base64Image = `data:${
                req.file.mimetype
            };base64,${req.file.buffer.toString("base64")}`;
            htmlContent = htmlContent.replace("{{logoImage}}", base64Image);
        } else {
            htmlContent = htmlContent.replace("{{image}}", "");
        }

        const imagePath = path.join(
            process.cwd(),
            "public/social-value-engine-logo.png"
        );
        const imageBuffer = fs.readFileSync(imagePath);
        const base64Logo = `data:image/png;base64,${imageBuffer.toString(
            "base64"
        )}`;

        htmlContent = htmlContent.replace(
            "/public/social-value-engine-logo.png",
            base64Logo
        );

        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: "networkidle0" });

        // Wait for layout
        // await page.waitForTimeout(1000);
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Insert spacers dynamically where a new page likely starts
        // await page.evaluate(() => {
        //     const PAGE_HEIGHT_PX = 1122; // A4 at 96 DPI

        //     const cards = Array.from(
        //         document.querySelectorAll(
        //             "section:nth-of-type(1) > div.break-inside-avoid"
        //         )
        //     );

        //     let lastPage = 0;

        //     cards.forEach((card, index) => {
        //         const rect = card.getBoundingClientRect();
        //         const cardTop = rect.top + window.scrollY;
        //         const currentPage = Math.floor(cardTop / PAGE_HEIGHT_PX);

        //         if (index > 0 && currentPage > lastPage) {
        //             const spacer = document.createElement("div");
        //             spacer.className = "pdf-top-margin";
        //             card.parentNode.insertBefore(spacer, card);
        //         }

        //         lastPage = currentPage;
        //     });
        // });

        const pdfBuffer = await page.pdf({
            format: "A4",
            landscape: false,
            printBackground: true,
            margin: {
                top: "0mm",
                right: "0mm",
                bottom: "0mm",
                left: "0mm",
            },
            preferCSSPageSize: true,
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
