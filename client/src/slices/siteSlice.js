import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    banners: [],
};

const siteSlice = createSlice({
    name: 'site',
    initialState,
    reducers: {
        setBanners(state, action) {
            state.banners = action.payload;
        },
    },
});

export const {setBanners} = siteSlice.actions;

export default siteSlice.reducer;