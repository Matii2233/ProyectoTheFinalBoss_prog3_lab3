import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IProductos } from "../../../types/dtos/productos/IProductos";

interface IInitialState {
  dataProductos: IProductos[]
  productoActive: null | IProductos
}

const initialState: IInitialState = {
  dataProductos: [],
  productoActive: null,
};

interface PayloadSetElement {
  element: IProductos;
}

const ProductoReducer = createSlice({
  name: "ProductoReducer",
  initialState,
  reducers: {
    setDataProducto(state, action: PayloadAction<IProductos[]>) {
      state.dataProductos = action.payload;
    },
    setProductoActive(state, action: PayloadAction<PayloadSetElement>) {
      state.productoActive = action.payload.element;
    },
    removeProductoActive(state) {
      state.productoActive = null;
    },
  },
});

export const { setDataProducto, setProductoActive, removeProductoActive } = ProductoReducer.actions;

export default ProductoReducer.reducer;
