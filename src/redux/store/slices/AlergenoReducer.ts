import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IAlergenos } from "../../../types/dtos/alergenos/IAlergenos";

interface IInitialState {
  dataAlergenos: IAlergenos[]
  alergenoActive: null | IAlergenos
}

const initialState: IInitialState = {
  dataAlergenos: [],
  alergenoActive: null,
};

interface PayloadSetElement {
  element: IAlergenos;
}

const AlergenoReducer = createSlice({
  name: "AlergenoReducer",
  initialState,
  reducers: {
    setDataAlergeno(state, action: PayloadAction<IAlergenos[]>) {
      state.dataAlergenos = action.payload;
    },
    setAlergenoActive(state, action: PayloadAction<PayloadSetElement>) {
      state.alergenoActive = action.payload.element;
    },
    removeAlergenoActive(state) {
      state.alergenoActive = null;
    },
  },
});

export const { setDataAlergeno, setAlergenoActive, removeAlergenoActive } = AlergenoReducer.actions;

export default AlergenoReducer.reducer;
