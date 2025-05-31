import { useState } from "react";

const SlideInPanel = ({ formData, setFormData, show, onClose }) => {
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const [bannerPreview, setBannerPreview] = useState(null);
    const [backgroundPreview, setBackgroundPreview] = useState(null);
    const [imageErrors, setImageErrors] = useState({
        banner: "",
        background: "",
    });
    const headerFooterSlots = new Array(6).fill(null);

    const handleImageUpload = (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;

            img.onload = () => {
                const isBanner = type === "banner";
                const minWidth = isBanner ? 1200 : 1920;
                const minHeight = isBanner ? 300 : 1080;

                if (img.width >= minWidth && img.height >= minHeight) {
                    setFormData((prev) => ({
                        ...prev,
                        [type === "banner" ? "bannerImage" : "backgroundImage"]:
                            file,
                    }));

                    if (isBanner) {
                        setBannerPreview(event.target.result);
                        setImageErrors((prev) => ({ ...prev, banner: "" }));
                    } else {
                        setBackgroundPreview(event.target.result);
                        setImageErrors((prev) => ({ ...prev, background: "" }));
                    }
                } else {
                    const msg = `Minimum resolution is ${minWidth}x${minHeight}px`;
                    setImageErrors((prev) => ({ ...prev, [type]: msg }));
                }
            };
        };

        reader.readAsDataURL(file);
    };

    return (
        <div
            className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl p-6 z-50 overflow-y-auto transform transition-transform duration-300 ease-in-out ${
                show ? "translate-x-0" : "translate-x-full"
            }`}
        >
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Page Setup</h3>
                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-black text-2xl font-bold"
                >
                    &times;
                </button>
            </div>

            {/* Style Sections */}
            <div className="space-y-5">
                <div className="pt-6 border-t space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Banner Image
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, "banner")}
                        />
                        {imageErrors.banner && (
                            <p className="text-red-500 text-xs mt-1">
                                {imageErrors.banner}
                            </p>
                        )}
                        {bannerPreview && (
                            <img
                                src={bannerPreview}
                                alt="Banner Preview"
                                className="mt-2 rounded max-h-32 object-cover"
                            />
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Page Background Image
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, "background")}
                        />
                        {imageErrors.background && (
                            <p className="text-red-500 text-xs mt-1">
                                {imageErrors.background}
                            </p>
                        )}
                        {backgroundPreview && (
                            <img
                                src={backgroundPreview}
                                alt="Background Preview"
                                className="mt-2 rounded max-h-32 object-cover"
                            />
                        )}
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium">
                        Font Size
                    </label>
                    <select
                        name="fontSize"
                        value={formData.fontSize || "M"}
                        onChange={handleChange}
                        className="w-full mt-1 border rounded"
                    >
                        <option value="S">Small</option>
                        <option value="M">Medium</option>
                        <option value="L">Large</option>
                    </select>
                </div>

                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        name="animations"
                        checked={formData.animations ?? true}
                        onChange={handleChange}
                    />
                    <label className="text-sm">Enable Animations</label>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2 dark:text-white">
                        Page Background
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
                        Page Font colour
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
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Card Background Colour
                    </label>
                    <input
                        type="color"
                        name="cardBgColour"
                        value={formData.cardBgColour}
                        onChange={handleChange}
                        className="w-14 h-10 p-1 border rounded bg-white"
                        title="Choose card background colour"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">
                        Card Title Colour
                    </label>
                    <input
                        type="color"
                        name="cardTitleColour"
                        value={formData.cardTitleColour}
                        onChange={handleChange}
                        className="w-14 h-10 p-1 border rounded bg-white"
                        title="Choose card title colour"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Card Text Colour
                    </label>
                    <input
                        type="color"
                        name="cardTextColour"
                        value={formData.cardTitleColour}
                        onChange={handleChange}
                        className="w-14 h-10 p-1 border rounded bg-white"
                        title="Choose card title colour"
                    />
                </div>
            </div>
        </div>
    );
};

export default SlideInPanel;
