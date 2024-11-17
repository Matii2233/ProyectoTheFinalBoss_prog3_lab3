import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ILocalidad } from "../../../types/ILocalidad";

interface IInitialState {
    localidadesPorProvincia: { [key: number]: ILocalidad[] }; // Mapa de provincias por pais
    localidadActive: ILocalidad | null;
}

const initialState: IInitialState = {
    localidadesPorProvincia: {},
    localidadActive: null,
};

const LocalidadReducer = createSlice({
    name: "localidadReducer",
    initialState,
    reducers: {
        setLocalidadesPorProvincia(state, action: PayloadAction<{ provinciaId: number; localidades: ILocalidad[] }>) {
            state.localidadesPorProvincia[action.payload.provinciaId] = action.payload.localidades;
        },
        setLocalidadActive(state, action: PayloadAction<ILocalidad>) {
            state.localidadActive = action.payload;
        },
        removeLocalidadActive(state) {
            state.localidadActive = null;
        },
    },
});

export const { setLocalidadesPorProvincia, setLocalidadActive, removeLocalidadActive } = LocalidadReducer.actions;

export default LocalidadReducer.reducer;