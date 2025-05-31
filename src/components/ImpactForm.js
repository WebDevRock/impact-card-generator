import { useState } from "react";
import { useEffect } from "react";
import Checkbox from "./Checkbox";
import LivePreview from "./LivePreview";
import ImpactCustomCard from "@/components/ImpactCustomCard";
import SlideInPanel from "@/components/SlideInPanel";
4, 109, 139;
const ImpactForm = ({ onGenerate }) => {
    const [formData, setFormData] = useState({
        project: "Project 2",
        introduction:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        template: "template3",
        bgColour: "#046D8B",
        txtColour: "#FFFFFF",
        cardBgColour: "#FFFFFF",
        cardTitleColour: "#046D8B",
        cardTextColour: "#046D8B",
        bannerImage: null,
        backgroundImage: null,
        fontSize: "M",
        logoImage: null,
        optionalSegments: {
            includeObjective: true,
            includeActivity: true,
            includeAnalysisScope: true,
            includeAnalysisPurpose: true,
            includeLocation: true,
            includeStakeholders: true,
            includeOutcomes: true,
            includeSocialROI: true,
            includeTotalValue: true,
            includeImpact: true,
            includeInput: true,
            includeValueStakeholder: true,
            includeValueOutcome: true,
            includeValuePriority: true,
        },
    });

    const checkboxOptions = [
        { name: "includeObjective", label: "Objective" },
        { name: "includeActivity", label: "Activity" },
        { name: "includeAnalysisScope", label: "Scope of the Analysis" },
        { name: "includeAnalysisPurpose", label: "Purpose of the Analysis" },
        { name: "includeLocation", label: "Location" },
        { name: "includeStakeholders", label: "Stakeholders" },
        { name: "includeOutcomes", label: "Outcomes" },
        { name: "includeSocialROI", label: "Social Return on Investment" },
        { name: "includeTotalValue", label: "Total (Present) Value" },
        { name: "includeImpact", label: "Impact" },
        { name: "includeInput", label: "Input" },
        {
            name: "includeValueStakeholder",
            label: "(Present) Value by Stakeholder",
        },
        { name: "includeValueOutcome", label: "(Present) Value by Outcome" },
        { name: "includeValuePriority", label: "(Present) Value by Priority" },
    ];

    // Split the checkbox options into two columns
    const midpoint = Math.ceil(checkboxOptions.length / 2);
    // This will ensure that if the number of optionalSegments is odd, the left column will have one more checkbox than the right column.
    const leftoptionalSegments = checkboxOptions.slice(0, midpoint);
    const rightoptionalSegments = checkboxOptions.slice(midpoint);
    const [showPanel, setShowPanel] = useState(false);
    const handleOptionalSegmentChange = (e) => {
        const { name, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            optionalSegments: {
                ...prev.optionalSegments,
                [name]: checked,
            },
        }));
    };
    useEffect(() => {
        // console.log("Form data changed:", formData);
    }, [formData]);
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null); // For live preview

    // const fileToBase64 = (file) => {
    //     return new Promise((resolve, reject) => {
    //         const reader = new FileReader();
    //         reader.onload = () => resolve(reader.result); // base64 string
    //         reader.onerror = reject;
    //         reader.readAsDataURL(file); // converts to data URI
    //     });
    // };
    const compressAndConvertToBase64 = async (file) => {
        const options = {
            maxSizeMB: 0.5, // Target file size (e.g., 500KB)
            maxWidthOrHeight: 1920, // Resize large images
            useWebWorker: true,
        };

        try {
            const compressedFile = await imageCompression(file, options);
            const base64 =
                await imageCompression.getDataUrlFromFile(compressedFile);
            return base64;
        } catch (error) {
            console.error("Image compression failed:", error);
            return null;
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // console.log(formData);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);

        // Create a preview of the image
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     const formDataToSend = new FormData();
    //     Object.entries(formData).forEach(([key, value]) => {
    //         if (typeof value === "object" && value !== null) {
    //             formDataToSend.append(key, JSON.stringify(value));
    //         } else {
    //             formDataToSend.append(key, value);
    //         }
    //     });
    //     if (formData.logoImage) {
    //         formDataToSend.append("logoImage", formData.logoImage);
    //     }
    //     if (formData.bannerImage) {
    //         formDataToSend.append("bannerImage", formData.bannerImage);
    //     }
    //     if (formData.backgroundImage) {
    //         formDataToSend.append("backgroundImage", formData.backgroundImage);
    //     }

    //     if (formData.bannerImage instanceof File) {
    //         formDataToSend.bannerImage = await fileToBase64(formData.bannerImage);
    //     }

    //     if (formData.backgroundImage instanceof File) {
    //         formDataToSend.backgroundImage = await fileToBase64(
    //             formData.backgroundImage
    //         );
    //     }

    //     try {
    //         const response = await fetch("/api/generate-pdf", {
    //             method: "POST",
    //             body: formDataToSend,
    //         });

    //         if (!response.ok) {
    //             throw new Error("Failed to generate PDF");
    //         }

    //         const blob = await response.blob();
    //         const url = window.URL.createObjectURL(blob);

    //         const a = document.createElement("a");
    //         a.href = url;
    //         a.download = "ImpactCard.pdf";
    //         a.style.display = "none";
    //         document.body.appendChild(a);
    //         a.click();
    //         document.body.removeChild(a);

    //         window.URL.revokeObjectURL(url);
    //     } catch (err) {
    //         console.error("PDF Generation Failed:", err);
    //         alert(
    //             "There was an error generating your Impact Card. Please try again."
    //         );
    //     }
    // };
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Clone form data and convert images to base64
        const payload = { ...formData };

        const toBase64 = (file) =>
            new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });

        if (formData.bannerImage instanceof File) {
            payload.bannerImage = await toBase64(formData.bannerImage);
        } else {
            payload.bannerImage = formData.bannerImage || null;
        }

        if (formData.backgroundImage instanceof File) {
            payload.backgroundImage = await toBase64(formData.backgroundImage);
        }

        if (formData.logoImage instanceof File) {
            payload.logoImage = await toBase64(formData.logoImage);
        }

        try {
            const response = await fetch("/api/generate-pdf", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error("Failed to generate PDF");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = "ImpactCard.pdf";
            a.style.display = "none";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("PDF Generation Failed:", err);
            alert(
                "There was an error generating your Impact Card. Please try again."
            );
        }
    };

    // 🔹 Dynamic Template Styles for Preview
    const getTemplateStyle = () => {
        switch (formData.template) {
            case "template1":
                return "bg-white text-gray-800 border-gray-300"; // Simple Design
            case "template2":
                return "bg-blue-100 text-blue-900 border-blue-500 shadow-md"; // Classic Design
            default:
                return "bg-white text-gray-800 border-gray-300";
        }
    };

    return (
        <div className="flex flex-wrap justify-center gap-6">
            {/* Left Side: Form */}
            <div className="max-w-lg min-w-full p-6 bg-white shadow-lg rounded-lg">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                    Create Impact Card
                </h2>
                <div className="flex justify-end mb-4">
                    <button
                        onClick={() => setShowPanel(true)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded shadow"
                    >
                        ⚙️ Style Impact Card
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Choose Project
                        </label>
                        <select
                            name="project"
                            value={formData.project}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 "
                        >
                            <option value="Project 1">Project 1</option>
                            <option value="Project 2">Project 2</option>
                            <option value="Project 3">Project 3</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Introduction
                        </label>
                        <textarea
                            name="introduction"
                            value={formData.introduction}
                            onChange={handleChange}
                            required
                            rows="3"
                            placeholder="Provide a short background about your organisation and/or project. This will be used as an introductionary section to your impact card."
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Choose the items you wish to include on your impact
                            card
                        </label>
                        <div className="flex mb-4">
                            {/* Left checkbox column */}
                            <div className="w-1/2">
                                {leftoptionalSegments.map(({ name, label }) => (
                                    <Checkbox
                                        key={name}
                                        name={name}
                                        label={label}
                                        checked={
                                            formData.optionalSegments[name]
                                        }
                                        onChange={handleOptionalSegmentChange}
                                    />
                                ))}
                            </div>

                            {/* Right side of check boxes */}
                            <div className="w-1/2">
                                {rightoptionalSegments.map(
                                    ({ name, label }) => (
                                        <Checkbox
                                            key={name}
                                            name={name}
                                            label={label}
                                            checked={
                                                formData.optionalSegments[name]
                                            }
                                            onChange={
                                                handleOptionalSegmentChange
                                            }
                                        />
                                    )
                                )}
                            </div>
                        </div>
                    </div>

                    {/* <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Choose Template
                        </label>
                        <select
                            name="template"
                            value={formData.template}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="template1">Simple Design</option>
                            <option value="template2">Classic Design</option>
                            <option value="template3">Masonary Design</option>
                        </select>
                    </div> */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700"></label>
                        <ImpactCustomCard />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Upload Your Logo
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow"
                        >
                            Generate Impact Card
                        </button>
                    </div>
                </form>
            </div>
            <LivePreview
                formData={formData}
                imagePreview={imagePreview}
                chartImages={{
                    chart1Image: "", // optional base64 images if available
                    chart2Image: "",
                    chart3Image: "",
                }}
            />
            <SlideInPanel
                formData={formData}
                setFormData={setFormData}
                show={showPanel}
                onClose={() => setShowPanel(false)}
            />
        </div>
    );
};

export default ImpactForm;
