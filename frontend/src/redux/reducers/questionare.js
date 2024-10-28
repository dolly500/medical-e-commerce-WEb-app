import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isLoading: true,
};

export const questionaireReducer = createReducer(initialState, {
    questionaireCreateRequest: (state) => {
      state.isLoading = true;
    },
    questionaireCreateSuccess: (state, action) => {
      state.isLoading = false;
      state.questionaire = action.payload;
      state.success = true;
    },
    questionaireCreateFail: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.success = false;
    },
 
   // get all tracking of the shop by id

  getAllQuestionaireShopRequest: (state) => {
    state.isLoading = true; 
  },
  getAllQuestionaireShopSuccess: (state, action) => {
    state.isLoading = false;
    state.questionaire = action.payload;
    console.log('payload reducersss', state.questionaire)
  },

  getAllQuestionaireShopFailed: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },



  // get all tracking
  getAllQuestionaireRequest: (state) => {
    state.isLoading = true;
  },
  getAllQuestionaireSuccess: (state, action) => {
    state.isLoading = false;
    state.questionaires = action.payload;
    console.log('payload reducers', state.questionaires)
  },
  getAllQuestionaireFailed: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },

  clearErrors: (state) => {
    state.error = null;
  },



     // delete tracking
     deleteQuestionaireRequest: (state) => {
      state.isLoading = true;
    },
    deleteQuestionaireSuccess: (state, action) => {
      state.isLoading = false;
      state.message = action.payload;
    },
    deleteQuestionaireFailed: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
     
    },

})