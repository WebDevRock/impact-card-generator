export async function buildHtmlFromTemplate({
    template,
    introduction,
    bgColour,
    txtColour,
    project,
    optionalSegments,
    sroiValue = "4.97",
    logoImage,
    chart1Image,
    chart2Image,
    chart3Image,
}) {
    let htmlContent = await fetch(`/templates/${template}.html`).then((res) =>
        res.text()
    );

    htmlContent = htmlContent
        .replace("{{introduction}}", introduction.replace(/\n/g, "<br>"))
        .replace("{{backgroundColour}}", bgColour)
        .replace("{{textColour}}", txtColour)
        .replace("{{sroiValue}}", sroiValue)
        .replace("{{project}}", project);

    Object.entries(optionalSegments).forEach(([key, value]) => {
        if (value) {
            htmlContent = htmlContent
                .replace(`{{${key}Start}}`, "")
                .replace(`{{${key}End}}`, "");
        } else {
            htmlContent = htmlContent.replace(
                new RegExp(`{{${key}Start}}[\\s\\S]*?{{${key}End}}`, "g"),
                ""
            );
        }
    });

    htmlContent = htmlContent
        .replace("{{logoImage}}", logoImage || "")
        .replace("{{StakeholderChart}}", chart1Image || "")
        .replace("{{OutcomeChart}}", chart2Image || "")
        .replace("{{PriorityChart}}", chart3Image || "");

    return htmlContent;
}
