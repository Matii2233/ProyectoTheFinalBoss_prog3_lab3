import { IPais } from "../types/IPais";
import { BackendClient } from "./BackendClient";

// Clase PersonaService que extiende BackendClient para interactuar con la API de empresa
export class PaisService extends BackendClient<IPais> {}