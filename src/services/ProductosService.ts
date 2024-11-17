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

    async post(newProducto: ICreateProducto): Promise<ICreateProducto> {
        const response = await fetch(`${this.baseUrl}/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newProducto),
        });

        if (!response.ok) {
            throw new Error("Error al crear el producto");
        }

        const data = await response.json();
        return data as ICreateProducto;
    }

    async put(id: number, data: IUpdateProducto): Promise<IUpdateProducto> {
        const response = await fetch(`${this.baseUrl}/update/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        const newData = await response.json();
        return newData as IUpdateProducto;
    }
}