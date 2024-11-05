import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IPais } from "../../../types/IPais";

interface IInitialState{
    paises: IPais[];
    paisActive: IPais | null;
}

const initialState : IInitialState = {
    paises:[],
    paisActive: null,
}

interface PayloadSetElement {
    element: IPais; // Elemento de tipo IEmpresa
}

const PaisReducer = createSlice({
    name:"paisReducer",
    initialState,
    reducers:{
        setPaises(state, action: PayloadAction<IPais[]>) {
            state.paises = action.payload; 
        },
        setPaisActive(state, action: PayloadAction<PayloadSetElement>) {
            state.paisActive = action.payload.element; 
        },
        removePaisActive(state) {
            state.paisActive = null; 
        },
    }
})

export const {setPaises, setPaisActive, removePaisActive} = PaisReducer.actions

export default PaisReducer.reducer;