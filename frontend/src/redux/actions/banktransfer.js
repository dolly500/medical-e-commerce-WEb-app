import axios from "axios";
import { server } from "../../server";

// Create bank transfer
export const createBankTransfer = (data) => async (dispatch) => {
    console.log("Request Payload:", data);
    try {
        dispatch({
            type: "bankTransferCreateRequest",
        });

        const { d } = await axios.post(`${server}/banktransfer/create-bank-transfer`, data);

        dispatch({
            type: "bankTransferCreateSuccess",
            payload: d.bankTransfer,
        });

    } catch (error) {
        dispatch({
            type: "bankTransferCreateFail",
            payload: error?.response?.data?.message,
        });
    }
};

// Get all bank transfers by ID
export const getAllBankTransfersShop = (id) => async (dispatch) => {
    try {
        dispatch({
            type: "getAllBankTransfersShopRequest",
        });

        const { data } = await axios.get(
            `${server}/banktransfer/get-bank-transfer/${id}`, { withCredentials: true }
        );

        dispatch({
            type: "getAllBankTransfersShopSuccess",
            payload: data.data,
        });
    } catch (error) {
        dispatch({
            type: "getAllBankTransfersShopFailed",
            payload: error.response.data.message,
        });
    }
};

// Get all bank transfers
export const getAllBankTransfers = () => async (dispatch) => {
    try {
        dispatch({
            type: "getAllBankTransfersRequest",
        });

        const { data } = await axios.get(`${server}/banktransfer/get-all-bank-transfers`);
        
        dispatch({
            type: "getAllBankTransfersSuccess",
            payload: data.data,
        });

    } catch (error) {
        dispatch({
            type: "getAllBankTransfersFailed",
            payload: error.response.data.message,
        });
    }
};

// Delete bank transfer
export const deleteBankTransfer = (id) => async (dispatch) => {
    try {
        dispatch({
            type: "deleteBankTransferRequest",
        });

        const { data } = await axios.delete(
            `${server}/banktransfer/delete-bank-tranfer/${id}`,
            {
                withCredentials: true,
            }
        );

        dispatch({
            type: "deleteBankTransferSuccess",
            payload: data.message,
        });

    } catch (error) {
        dispatch({
            type: "deleteBankTransferFailed",
            payload: error.response.data.message,
        });
    }
};
