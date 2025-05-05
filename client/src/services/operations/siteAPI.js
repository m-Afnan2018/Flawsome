import toast from "react-hot-toast";
import { apiConnector } from "services/apiConnector";

const { ADD_SITE, GET_SITE, UPDATE_SITE, UPDATE_SITE_ARRANGEMENT } = require("services/apis").siteEndpoints;

export const getSiteData = async (setter) => {
    try {
        const response = await apiConnector('GET', GET_SITE, null, null, null);

        if (response.data.success) {
            setter(response.data.siteData);
        }
    } catch (err) {
        toast.error(err?.response?.data?.message);
    }
}

export const addSiteData = async (data) => {
    const toastId = toast.loading('Adding Site Data');
    try {
        const response = await apiConnector('POST', ADD_SITE, data, { 'Content-Type': 'multipart/form-data' });

        if (response.data.success) {
            toast.dismiss(toastId);
            toast.success(response.data.message);
        }
    } catch (err) {
        toast.dismiss(toastId)
        toast.error(err.response.data.message);
    }
}

export const updateSiteArrangements = async (data, setter) => {
    const toastId = toast.loading('Updating Site Arrangements');
    try {
        const response = await apiConnector('PUT', UPDATE_SITE_ARRANGEMENT, data);

        if (response.data.success) {
            setter(response.data.siteData)
            toast.dismiss(toastId);
            toast.success(response.data.message);
        }
    } catch (err) {
        toast.dismiss(toastId)
        toast.error(err.response.data.message);
    }
}

export const updateSiteData = async (data, setter) => {
    const toastId = toast.loading('Updating Site Data');
    try {
        const response = await apiConnector('PUT', UPDATE_SITE, data, { 'Content-Type': 'multipart/form-data' });

        if (response.data.success) {
            setter((prev) => {
                const updatedData = prev.map((item) => {
                    if (item._id === data.id) {
                        return { ...item, ...data };
                    }
                    return item;
                });
                return updatedData;
            })
            toast.dismiss(toastId);
            toast.success(response.data.message);
        }
    } catch (err) {
        toast.dismiss(toastId)
        toast.error(err.response.data.message);
    }
}