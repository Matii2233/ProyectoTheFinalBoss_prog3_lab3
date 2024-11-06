import { ICreateProducto } from "../types/dtos/productos/ICreateProducto";
import { IProductos } from "../types/dtos/productos/IProductos";
import { IUpdateProducto } from "../types/dtos/productos/IUpdateProducto";
import { BackendClient } from "./BackendClient";

// Clase PersonaService que extiende BackendClient para interactuar con la API de empresa
export class ProductosService extends BackendClient<IProductos | ICreateProducto | IUpdateProducto> {
    async getAll(): Promise<IProductos[]> {
        const response = await fetch(`${this.baseUrl}`);
        const data = await response.json();
        return data as IProductos[];
    }
}