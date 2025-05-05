const Site = require('../models/Site');
const { failed, customError } = require("../utils/errorHandler")
const uploadMedia = require("../utils/fileUploader")

exports.getSiteData = async (req, res) => {
    try {
        const siteData = await Site.find().sort({position: 1});
        if (!siteData) {
            return res.status(404).json({ message: 'Site data not found' });
        }
        if (!siteData) {
            return res.status(404).json({ message: 'Site data not found' });
        }
        res.status(200).json({
            success: true,
            siteData: siteData,
        });
    } catch (error) {
        failed(res, error);
    }
}

exports.addSiteData = async (req, res) => {
    try {
        const { title, description } = req.body;
        const smallImage = req.files.smallImage;
        const largeImage = req.files.largeImage;

        if (!smallImage || !largeImage) {
            return res.status(400).json({ message: 'Images are required' });
        }

        const allSiteData = await Site.find();
        let position = allSiteData.length ;
        if (position) {
            position = allSiteData[allSiteData.length-1].position + 1;
        }

        let images = [smallImage, largeImage];

        const imagesPromises = images.map(async (image) => {
            const getUrl = await uploadMedia(image, `Banners/${title}`);
            return getUrl.secure_url;
        });

        const imagesUrl = await Promise.all(imagesPromises);
        const smallImageUrl = imagesUrl[0];
        const largeImageUrl = imagesUrl[1];

        const newSiteData = new Site({
            smallImage: smallImageUrl,
            largeImage: largeImageUrl,
            title,
            description,
            position: position,
        });

        await newSiteData.save();
        
        res.status(201).json({
            success: true,
            message: 'Site data added successfully',
            siteData: newSiteData,
        });
    } catch (error) {
        failed(res, error);
    }
}

exports.updateSiteData = async (req, res) => {
    try {
        const { id, title, description } = req.body;
        const smallImage = req.files?.smallImage;
        const largeImage = req.files?.largeImage;

        if (!id) {
            return res.status(400).json({ message: 'ID is required' });
        }
        if (!title) {
            return res.status(400).json({ message: 'Title is required' });
        }
        if (!description) {
            return res.status(400).json({ message: 'Description is required' });
        }

        const siteData = await Site.findById(id);
        if (!siteData) {
            return res.status(404).json({ message: 'Site data not found' });
        }

        const updates = { title, description };

        if (smallImage) {
            const smallImageUrl = (await uploadMedia(smallImage, `Banners/${title}`)).secure_url;
            updates.smallImage = smallImageUrl;
        }

        if (largeImage) {
            const largeImageUrl = (await uploadMedia(largeImage, `Banners/${title}`)).secure_url;
            updates.largeImage = largeImageUrl;
        }

        const updatedSiteData = await Site.findByIdAndUpdate(id, updates, { new: true });

        if (!updatedSiteData) {
            return res.status(404).json({ message: 'Failed to update site data' });
        }

        res.status(200).json({
            success: true,
            message: 'Site data updated successfully',
            siteData: updatedSiteData,
        });
    } catch (error) {
        failed(res, error);
    }
};

exports.updateSiteArrangements = async (req, res) => {
    try {
        const { type, id } = req.body;
        if(!type || !id) {
            return res.status(400).json({ message: 'Type and ID are required' });
        }
        const siteData = await Site.findById(id);
        if (!siteData) {
            return res.status(404).json({ message: 'Site data not found' });
        }
        
        if(type !== 'DELETE'){
            const findReplacement = await Site.findOne({ position: siteData.position + (type === 'UP' ? -1 : 1) });
            if (!findReplacement) {
                return res.status(404).json({ message: 'Replacement site data not found' });
            }
            await Site.findByIdAndUpdate(id, { position: siteData.position + (type === 'UP' ? -1 : 1) }, { new: true });
            await Site.findByIdAndUpdate(findReplacement._id, { position: siteData.position }, { new: true });
        }else{
            await Site.findByIdAndDelete(id);
        }


        const updatedSiteData = await Site.find().sort({position: 1});

        res.status(200).json({
            success: true,
            message: 'Site data updated successfully',
            siteData: updatedSiteData,
        });
    } catch (error) {
        failed(res, error);
    }
}