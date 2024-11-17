import { create } from "@mui/material/styles/createTransitions";
import { ICategorias } from "../../../types/dtos/categorias/ICategorias";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IInitialState {
    dataCategorias: ICategorias[];
    categoriaActive: null | ICategorias;
}

const initialState: IInitialState = {
    dataCategorias: [],
    categoriaActive: null
}

interface PayloadSetElement {
    element: ICategorias;
}

const CategoriasReducer = createSlice({
    name: "CategoriasReducer",
    initialState,
    reducers: {
        setDataCategorias(state, action: PayloadAction<ICategorias[]>) {
            state.dataCategorias = action.payload;
        },
        setCategoriaActive(state, action: PayloadAction<PayloadSetElement>){
            state.categoriaActive = action.payload.element;
        },
        removeCategoriaActive(state){
            state.categoriaActive = null
        }
    },
});

export const {setDataCategorias, setCategoriaActive, removeCategoriaActive} = CategoriasReducer.actions

export default CategoriasReducer.reducer