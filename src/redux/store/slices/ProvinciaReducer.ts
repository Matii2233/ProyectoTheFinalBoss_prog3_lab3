import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IProvincia } from "../../../types/IProvincia";

interface IInitialState {
    provinciasPorPais: { [key: number]: IProvincia[] }; // Mapa de provincias por pais
    provinciaActive: IProvincia | null;
}

const initialState: IInitialState = {
    provinciasPorPais: {},
    provinciaActive: null,
};

const ProvinciaReducer = createSlice({
    name: "provinciaReducer",
    initialState,
    reducers: {
        setProvinciasPorPais(state, action: PayloadAction<{ paisId: number; provincias: IProvincia[] }>) {
            state.provinciasPorPais[action.payload.paisId] = action.payload.provincias;
        },
        setProvinciaActive(state, action: PayloadAction<IProvincia>) {
            state.provinciaActive = action.payload;
        },
        removeProvinciaActive(state) {
            state.provinciaActive = null;
        },
    },
});

export const { setProvinciasPorPais, setProvinciaActive, removeProvinciaActive } = ProvinciaReducer.actions;

export default ProvinciaReducer.reducer;