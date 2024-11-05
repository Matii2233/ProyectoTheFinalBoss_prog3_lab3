import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ISucursal } from "../../../types/dtos/sucursal/ISucursal";

interface IInitialState {
    sucursalesPorEmpresa: { [key: number]: ISucursal[] }; // Mapa de sucursales por empresa
    sucursalActive: ISucursal | null;
}

const initialState: IInitialState = {
    sucursalesPorEmpresa: {},
    sucursalActive: null,
};

const SucursalReducer = createSlice({
    name: "sucursalReducer",
    initialState,
    reducers: {
        setSucursalesPorEmpresa(state, action: PayloadAction<{ empresaId: number; sucursales: ISucursal[] }>) {
            state.sucursalesPorEmpresa[action.payload.empresaId] = action.payload.sucursales;
        },
        setSucursalActive(state, action: PayloadAction<ISucursal>) {
            state.sucursalActive = action.payload;
        },
        removeSucursalActive(state) {
            state.sucursalActive = null;
        },
    },
});

export const { setSucursalesPorEmpresa, setSucursalActive, removeSucursalActive } = SucursalReducer.actions;

export default SucursalReducer.reducer;