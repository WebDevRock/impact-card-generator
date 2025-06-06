import { useEffect, useState } from "react";
import { buildHtmlFromTemplate } from "@/utils/buildHtmlFromTemplate";

export default function LivePreview({ formData }) {
    const [html, setHtml] = useState("");

    useEffect(() => {
        const generate = async () => {
            const html = await buildHtmlFromTemplate(formData);
            setHtml(html);
        };
        generate();
    }, [formData]);

    return (
        <iframe
            className="w-full h-[1000px] border border-gray-300"
            srcDoc={html}
            title="Live Preview"
        />
    );
}
