import imageCompression from "browser-image-compression";

export const compressAndConvertToBase64 = async (file) => {
    const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
    };

    try {
        const compressedFile = await imageCompression(file, options);
        return await imageCompression.getDataUrlFromFile(compressedFile);
    } catch (error) {
        console.error("Image compression failed:", error);
        return null;
    }
};
