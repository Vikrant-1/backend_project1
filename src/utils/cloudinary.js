import { v2 as cloudinary, } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECERT
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        // upload file on cloudnary

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto',
            media_metadata:true,
            image_metadata:true,
        })
        // file have been uploaded successfully
        fs.unlinkSync(localFilePath);
        console.log("file is uploaded on cloudinary", response.url);
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath); // remove locally saved temp file as the upload operation got failed
        return null;
    }

}

const deleteOnCloudinary = async (oldFileURL) => {
    try {
        if (!oldFileURL) return null;
        // upload file on cloudnary

        const publicId = getPublicId(oldFileURL);
        // console.log(oldFileURL, publicId);
        if (!publicId) {
            return null;
        }
        const response = await cloudinary.uploader.destroy(publicId);

        console.log("file is delete on cloudinary", response);
        return response;
    } catch (error) {
        return null;
    }

}

const getPublicId = (url = '') => {
    const id = url.split('/').pop().split('.')[0];
    return id;
}

export { uploadOnCloudinary, deleteOnCloudinary };
