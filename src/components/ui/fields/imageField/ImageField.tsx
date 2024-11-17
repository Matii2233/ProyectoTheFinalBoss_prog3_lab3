import { ErrorMessage, useField } from "formik";
import React, { useState, useEffect } from "react";
import "./ImageField.css"; // Importación del archivo de estilos CSS

// Interfaz para los props del componente ImageField
interface Props {
    name: string; // Nombre del campo
    logoActive: string | null; // URL del logo activo
}

// Componente ImageField
export const ImageField = ({ name, logoActive }: Props) => {
    const [field, meta, helpers] = useField(name);
    const [imagePreview, setImagePreview] = useState<string | null>(null); // Estado para la previsualización

    // Efecto para inicializar la previsualización con logoActive
    useEffect(() => {
        if (logoActive) {
            setImagePreview(logoActive); // Establece la URL del logo activo
            helpers.setValue(logoActive); // Establece el valor en Formik
        }
    }, [logoActive, helpers]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.currentTarget.files?.[0];
        if (file) {
            // Libera la URL anterior si existe
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
            const url = URL.createObjectURL(file);
            helpers.setValue(url);
            setImagePreview(url);
    
            // Limpia la URL después de usarla
            return () => URL.revokeObjectURL(url);
        } else {
            helpers.setValue('');
            setImagePreview(null);
        }
    };

    return (
        <div className="mt-2" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-around" }}>
            {/* Texto para seleccionar la imagen */}
            <label
                style={{
                    cursor: 'pointer',
                    color: 'white',
                }}
            >
                Seleccione una imagen
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }} // Oculta el input de archivo
                />
            </label>

            {/* Previsualización de la imagen o icono */}
            {imagePreview ? (
                <img
                    src={imagePreview}
                    alt="Previsualización"
                    style={{ maxWidth: '80px', maxHeight: "80px" }} // Ajusta el tamaño de la previsualización
                />
            ) : (
                <span className="material-symbols-outlined" style={{ scale: '3.8' }}>no_photography</span>
            )}

            {/* Mensaje de error para el campo */}
            <ErrorMessage component="div" name={name} className="error" />
        </div>
    );
};

export default ImageField; // Exportación del componente ImageField