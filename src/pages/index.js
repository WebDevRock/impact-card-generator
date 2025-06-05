import { useState } from "react";
import axios from "axios";
import ImpactForm from "../components/ImpactForm";

export default function Home() {
    const [pdfUrl, setPdfUrl] = useState(null);

    const generatePDF = async (formData) => {
        try {
            setPdfUrl(null);

            const payload = { ...formData };

            // Convert any images to base64 if they are still File objects
            const toBase64 = (file) =>
                new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });

            if (formData.bannerImage instanceof File) {
                payload.bannerImage = await compressAndConvertToBase64(formData.bannerImage);
            } else {
                payload.bannerImage = formData.bannerImage || null;
            }

            if (formData.backgroundImage instanceof File) {
                payload.backgroundImage = await compressAndConvertToBase64(
                    formData.backgroundImage
                );
            }
            
            if (formData.logoImage instanceof File) {
                payload.logoImage = await compressAndConvertToBase64(
                    formData.logoImage
                );
            }


            console.log("Payload for PDF generation:", payload);

            const response = await axios.post("/api/generate-pdf", payload, {
                headers: {
                    "Content-Type": "application/json",
                },
                responseType: "blob",
            });

            const pdfBlob = new Blob([response.data], {
                type: "application/pdf",
            });
            const pdfUrl = URL.createObjectURL(pdfBlob);
            setPdfUrl(pdfUrl);
        } catch (error) {
            console.error(
                "PDF Generation Error:",
                error.response?.data || error.message
            );
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">
                Impact Card Generator
            </h1>
            <ImpactForm onGenerate={generatePDF} />

            {pdfUrl && (
                <div className="text-center mt-4">
                    <h2 className="text-lg font-semibold">
                        Download Your Impact Card
                    </h2>
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
