export async function buildHtmlFromTemplate({
    template,
    bannerImage,
    backgroundImage,
    introduction,
    bgColour,
    cardBgColour,   
    cardTitleColour,
    cardTextColour,
    txtColour,
    project,
    optionalSegments,
    sroiValue = "4.97",
    logoImage = "",
    chart1Image = "",
    chart2Image = "",
    chart3Image = "",
}) {
    let htmlContent = "";

    if (typeof window === "undefined") {
        // Server-side (Node.js)
        const fs = await import("fs");
        const path = await import("path");
        const templatePath = path.join(process.cwd(), "public", "templates", `${template}.html`);
        htmlContent = fs.readFileSync(templatePath, "utf8");
    } else {
        // Client-side (Browser)
        const response = await fetch(`/templates/${template}.html`);
        htmlContent = await response.text();
    }

    htmlContent = htmlContent
        .replace("{{bannerImage}}", bannerImage || "")
        .replace("{{#bannerImage}}", bannerImage ? "" : "<!--")
        .replace("{{/bannerImage}}", bannerImage ? "" : "-->")
        .replace("{{introduction}}", introduction.replace(/\n/g, "<br>"))
        .replace("{{backgroundColour}}", bgColour)
        .replace("{{cardBgColour}}", cardBgColour)
        .replace("{{cardTitleColour}}", cardTitleColour)
        .replace("{{cardTextColour}}", cardTextColour)
        .replace("{{textColour}}", txtColour)
        .replace("{{sroiValue}}", sroiValue)
        .replace("{{project}}", project.replace(/\n/g, "<br>"));

    Object.entries(optionalSegments).forEach(([key, value]) => {
        if (value) {
            htmlContent = htmlContent.replace(`{{${key}Start}}`, "").replace(`{{${key}End}}`, "");
        } else {
            const regex = new RegExp(`{{${key}Start}}[\\s\\S]*?{{${key}End}}`, "g");
            htmlContent = htmlContent.replace(regex, "");
        }
    });

    htmlContent = htmlContent
        .replace("{{logoImage}}", logoImage)
        .replace("{{StakeholderChart}}", chart1Image)
        .replace("{{OutcomeChart}}", chart2Image)
        .replace("{{PriorityChart}}", chart3Image);

    return htmlContent;
}
