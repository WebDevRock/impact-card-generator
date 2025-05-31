import React, { useState } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), {
    ssr: false,
});

const ImpactCustomCard = () => {
    const [cards, setCards] = useState([{ title: "", description: "" }]);

    const handleTitleChange = (index, event) => {
        const { value } = event.target;
        const newCards = [...cards];
        newCards[index].title = value;
        setCards(newCards);
    };

    const handleDescriptionChange = (index, value) => {
        const newCards = [...cards];
        newCards[index].description = value;
        setCards(newCards);
    };

    const addCard = () => {
        setCards([...cards, { description: "" }]);
    };

    const removeCard = (index) => {
        const updatedCards = cards.filter((_, i) => i !== index);
        setCards(updatedCards);
    };

    const modules = {
        toolbar: [
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],

            ["clean"],
        ],
    };

    const getToolbarId = (index) => `toolbar-${index}`;

    const getModules = (index) => ({
        toolbar: {
            container: `#${getToolbarId(index)}`,
        },
    });

    return (
            <div>
            {cards.map((card, index) => (
                <div
                    key={index}
                    className="p-4 border rounded-md bg-white shadow-sm space-y-4"
                >
                    

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Content
                        </label>

                        {/* Toolbar with unique ID */}
                        <div id={getToolbarId(index)} className="mb-2">
                            <button className="ql-bold" title="Bold (Ctrl+B)" />
                            <button className="ql-italic" title="Italic (Ctrl+I)" />
                            <button className="ql-underline" title="Underline (Ctrl+U)" />
                            <button className="ql-list" value="bullet" title="Bullet List" />
                            <button className="ql-list" value="ordered" title="Numbered List" />
                            <button className="ql-clean" title="Clear Formatting" />
                        </div>

                        {/* Editor linked to above toolbar */}
                        <ReactQuill
                            theme="snow"
                            value={card.description}
                            onChange={(val) =>
                                handleDescriptionChange(index, val)
                            }
                            modules={getModules(index)}
                        />
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={() => removeCard(index)}
                            className="text-red-600 text-sm hover:underline"
                        >
                            Remove Section
                        </button>
                    </div>
                </div>
            ))}

            <div className="flex justify-between">
                <button
                    type="button"
                    onClick={addCard}
                    className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                    + Add Section
                </button>
            </div>
        </div>
    );
};

export default ImpactCustomCard;
