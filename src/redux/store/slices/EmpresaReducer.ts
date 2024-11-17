import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IEmpresa } from "../../../types/dtos/empresa/IEmpresa";

interface IInitialState{
    empresas: IEmpresa[];
    empresaActive: IEmpresa | null;
}

const initialState : IInitialState = {
    empresas:[],
    empresaActive: null,
}

interface PayloadSetElement {
    element: IEmpresa; // Elemento de tipo IEmpresa
}

const EmpresaReducer = createSlice({
    name:"empresaReducer",
    initialState,
    reducers:{
        setEmpresas(state, action: PayloadAction<IEmpresa[]>) {
            state.empresas = action.payload; 
        },
        setEmpresaActive(state, action: PayloadAction<PayloadSetElement>) {
            state.empresaActive = action.payload.element; 
        },
        removeEmpresaActive(state) {
            state.empresaActive = null; 
        },
    }
})

export const {setEmpresas, setEmpresaActive, removeEmpresaActive} = EmpresaReducer.actions

export default EmpresaReducer.reducer;