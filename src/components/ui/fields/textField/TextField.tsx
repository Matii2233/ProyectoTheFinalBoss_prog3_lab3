import { ErrorMessage, Field } from "formik";
import "./textField.css"; // Importación del archivo de estilos CSS

// Interfaz para los props del componente TextFieldValue
interface props {
    name: string; // Nombre del campo
    type: string; // Tipo de campo (text, number, etc.)
    placeholder: string; // Placeholder del campo
    customWidth: string;
}

// Componente TextFieldValue
const TextFieldValue = ({ name, type, placeholder, customWidth }: props) => {
    // Componente para crear los input de un formulario con Formik
    return (
        <div className="mt-2" style={{ display: "flex", flexDirection: "column", alignItems:"center" }}>

            {/* Campo de entrada del formulario */}
            <Field
                className={`form-control  mb-3  input-formulario `}
                style={{width:customWidth}}
                placeholder={placeholder}
                name={name}
                type={type}
                autoComplete="off"
            />

            {/* Mensaje de error para el campo */}
            <ErrorMessage component="div" name={name} className="error" />
        </div>
    );
};

export default TextFieldValue; // Exportación del componente TextFieldValue