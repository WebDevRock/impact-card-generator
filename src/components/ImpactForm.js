import { useState } from "react";

const ImpactForm = ({ onGenerate }) => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        impactStats: "",
        template: "template1",
    });

    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null); // For live preview

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
            formDataToSend.append(key, value);
        });

        if (image) {
            formDataToSend.append("image", image);
        }

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
            <div className="max-w-lg p-6 bg-white shadow-lg rounded-lg">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                    Create Impact Card
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows="3"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Impact Stats
                        </label>
                        <input
                            type="text"
                            name="impactStats"
                            value={formData.impactStats}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
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
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Upload Image (Optional)
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
                            Generate PDF
                        </button>
                    </div>
                </form>
            </div>

            {/* Right Side: Live Preview */}
            <div className="max-w-lg p-6 bg-gray-100 shadow-lg rounded-lg">
                <h2 className="text-xl font-bold mb-4 text-gray-800">
                    Live Preview
                </h2>
                <div
                    className={`border rounded-md p-4 text-center ${getTemplateStyle()}`}
                >
                    <h1 className="text-2xl font-bold">
                        {formData.title || "Your Title Here"}
                    </h1>
                    <p className="mt-2">
                        <strong>Description:</strong>{" "}
                        {formData.description ||
                            "Your description will appear here."}
                    </p>
                    <p className="mt-2">
                        <strong>Impact Stats:</strong>{" "}
                        {formData.impactStats ||
                            "Impact stats will be displayed here."}
                    </p>

                    {/* Image Preview */}
                    {imagePreview && (
                        <img
                            src={imagePreview}
                            alt="Uploaded Preview"
                            className="mt-4 max-w-full h-auto mx-auto rounded-md shadow-md"
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImpactForm;
