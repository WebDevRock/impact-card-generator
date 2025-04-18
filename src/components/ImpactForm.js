import { useState } from "react";
import { useEffect } from "react";
import Checkbox from "./Checkbox"; // Assuming you have a Checkbox component

const ImpactForm = ({ onGenerate }) => {
    const [formData, setFormData] = useState({
        project: "project 2",
        introduction: "",
        template: "template3",
        bgColour: "#ffffff",
        txtColour: "#000000",
        image: null,
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
        console.log("Form data changed:", formData);
    }, [formData]);

    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null); // For live preview

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        console.log(formData);
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

    const handleSubmit = (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();

        Object.entries(formData).forEach(([key, value]) => {
            if (typeof value === "object" && value !== null) {
                formDataToSend.append(key, JSON.stringify(value)); // Handle objects like checkboxes
            } else {
                formDataToSend.append(key, value);
            }
        });

        if (image) {
            formDataToSend.append("image", image);
        }

        console.log("Form data to send:", formDataToSend);
        onGenerate(formDataToSend);
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
                            <option value="project 1">Project 1</option>
                            <option value="project 2">Project 2</option>
                            <option value="project 3">Project 3</option>
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

                    <div>
                        <label className="block text-sm font-medium mb-2 dark:text-white">
                            Background
                        </label>
                        <input
                            type="color"
                            className="p-1 h-10 w-14 block bg-white border border-gray-200 cursor-pointer rounded-lg disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700"
                            title="Choose your color"
                            name="bgColour"
                            id="bgColour"
                            value={formData.bgColour}
                            onChange={handleChange}
                        ></input>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 dark:text-white">
                            Text colour
                        </label>
                        <input
                            type="color"
                            className="p-1 h-10 w-14 block bg-white border border-gray-200 cursor-pointer rounded-lg disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700"
                            title="Choose your color"
                            id="txtColour"
                            name="txtColour"
                            onChange={handleChange}
                            value={formData.txtColour}
                        ></input>
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
        </div>
    );
};

export default ImpactForm;
