import { createReducer } from "@reduxjs/toolkit";

const initialState = {
    isLoading: true,
};

export const bankTransferReducer = createReducer(initialState, {
    bankTransferCreateRequest: (state) => {
        state.isLoading = true;
    },
    bankTransferCreateSuccess: (state, action) => {
        state.isLoading = false;
        state.bankTransfer = action.payload;
        state.success = true;
    },
    bankTransferCreateFail: (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = false;
    },

    // Get all bank transfers by shop ID
    getAllBankTransfersShopRequest: (state) => {
        state.isLoading = true;
    },
    getAllBankTransfersShopSuccess: (state, action) => {
        state.isLoading = false;
        state.bankTransfers = action.payload;
    },
    getAllBankTransfersShopFailed: (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
    },

    // Get all bank transfers
    getAllBankTransfersRequest: (state) => {
        state.isLoading = true;
    },
    getAllBankTransfersSuccess: (state, action) => {
        state.isLoading = false;
        state.bankTransfers = action.payload;
    },
    getAllBankTransfersFailed: (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
    },

    // Delete bank transfer
    deleteBankTransferRequest: (state) => {
        state.isLoading = true;
    },
    deleteBankTransferSuccess: (state, action) => {
        state.isLoading = false;
        state.message = action.payload;
    },
    deleteBankTransferFailed: (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
    },

    clearErrors: (state) => {
        state.error = null;
    },
});
