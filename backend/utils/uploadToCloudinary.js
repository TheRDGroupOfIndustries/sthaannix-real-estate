import cloudinary from "./cloudinary.js";

export const uploadBufferToCloudinary = (buffer, filename, folder) => {
	return new Promise((resolve, reject) => {
		const uploadStream = cloudinary.uploader.upload_stream(
			{
				resource_type: "auto",
				public_id: `${folder}/${filename}-${Date.now()}`,
			},
			(error, result) => {
				if (error) {
					console.error("Cloudinary upload error:", error);
					return reject(error);
				}
				resolve(result && result.secure_url);
			}
		);
		uploadStream.end(buffer);
	});
}; 