import { IProvincia } from "../types/IProvincia";
import { BackendClient } from "./BackendClient";

export class ProvinciaService extends BackendClient<IProvincia> {
    async getAllByPaisId(id:number): Promise<IProvincia[]> {
        const response = await fetch(`${this.baseUrl}/${id}`);
        const data = await response.json();
        return data as IProvincia[];
    }
}