import { useState } from "react";
import axios from "axios";
import ImpactForm from "../components/ImpactForm";

export default function Home() {
    const [pdfUrl, setPdfUrl] = useState(null);

    const generatePDF = async (formData) => {
        try {
            setPdfUrl(null)
            const response = await axios.post("/api/generate-pdf", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                responseType: "blob",
            });

            const pdfBlob = new Blob([response.data], { type: "application/pdf" });
            const pdfUrl = URL.createObjectURL(pdfBlob);
            setPdfUrl(pdfUrl);
        } catch (error) {
            console.error("PDF Generation Error:", error.response?.data || error.message);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">Impact Card Generator</h1>
            <ImpactForm onGenerate={generatePDF} />

            {pdfUrl && (
                <div className="text-center mt-4">
                    <h2 className="text-lg font-semibold">Download Your Impact Card</h2>
                    <a
                        href={pdfUrl}
                        download="ImpactCard.pdf"
                        className="mt-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md shadow"
                    >
                        Download
                    </a>
                </div>
            )}
        </div>
    );
}
