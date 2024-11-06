import { configureStore } from '@reduxjs/toolkit'
import EmpresaReducer from "./slices/EmpresaReducer"
import SucursalReducer from "./slices/SucursalReducer"
import PaisReducer from "./slices/PaisReducer"
import ProvinciaReducer from './slices/ProvinciaReducer'
import LocalidadReducer from './slices/LocalidadReducer'
import AlergenoReducer from './slices/AlergenoReducer'
import ProductoReducer from "./slices/ProductoReducer"


export const store = configureStore({
    reducer: {
        empresaReducer: EmpresaReducer,
        sucursalReducer: SucursalReducer,
        paisReducer: PaisReducer,
        provinciaReducer: ProvinciaReducer,
        localidadReducer: LocalidadReducer,
        alergenoReducer: AlergenoReducer,
        productoReducer: ProductoReducer
    },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch 