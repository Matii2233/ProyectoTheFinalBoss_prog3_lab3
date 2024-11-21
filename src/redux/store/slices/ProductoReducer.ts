import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IProductos } from "../../../types/dtos/productos/IProductos";


interface IInitialState {
    dataProductos: IProductos[]
    productoActive: null | IProductos;
}

const initialState: IInitialState = {
    dataProductos: [],
    productoActive: null
}

interface PayloadSetElement {
    element: IProductos
}

const ProductosReducer = createSlice({
    name: "ProductosReducer",
    initialState,
    reducers: {
        setDataProductos(state, action: PayloadAction<IProductos[]>) {
            state.dataProductos = action.payload;
        },
        setProductoActive(state, action: PayloadAction<PayloadSetElement>) {
            state.productoActive = action.payload.element;
        },
        removeProductoActive(state) {
            state.productoActive = null
        },
        removeProductoById(state, action : PayloadAction<number>) { 
            state.dataProductos = state.dataProductos.filter(
                (producto) => producto.id !== action.payload
            );
        },
    }});

export const { setDataProductos, setProductoActive, removeProductoActive,removeProductoById } = ProductosReducer.actions

export default ProductosReducer.reducer