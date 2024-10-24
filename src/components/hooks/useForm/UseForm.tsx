import { useState } from "react"
import { IEmpresa } from "../../../types/IEmpresa";
interface FormValues {
    [key: string]: string | number
}

export const useForm = <T extends FormValues>(initialValues: T) =>{

    const [empresas, setEmpresa] = useState<IEmpresa[]>([]);

    const [values, setValues] = useState <T>(initialValues)

    const [isOpenModal, setIsOpenModal] = useState(false);

    const [isModalViewOpen, setIsModalViewOpen] = useState(false)

    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
    



    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setValues(prevValues => ({ ...prevValues, [name]: value }));
    };

    const resetForm = ()=>{
        setValues(initialValues)
    }

    const handleSubmitForm = () => {
        console.log(values)
    }

    const handleCloseModal = () => {
        setIsOpenModal(false)
        setSelectedImage(null)
        setImagePreviewUrl(null)
        setEditingIndex(null)
    };

    // Si se abre el modal desde una empresa ya creada se modifica el contenido de esa empresa
    // Si se abre desde el boton agregar empresa se setea 'true' en 'isOpenModal'
    const handleOpenModal = (index: number | null = null) => {
        if (index !== null) {
            const empresa = empresas[index]
            if (empresa) {
                setEditingIndex(index);
                const simulatedEvent = { target: {name: 'nombre', value: empresa.nombre} }
                handleChange(simulatedEvent as React.ChangeEvent<HTMLInputElement>)
                const simulatedEventRazonSocial = { target: { name: 'razonSocial', value: empresa.razonSocial } }
                handleChange(simulatedEventRazonSocial as React.ChangeEvent<HTMLInputElement>)
                const simulatedEventCuit = { target: { name: 'cuit', value: empresa.cuit } }
                handleChange(simulatedEventCuit as React.ChangeEvent<HTMLInputElement>)
                setSelectedImage(empresa.logo)

                if (empresa.logo) {

                    setImagePreviewUrl(URL.createObjectURL(empresa.logo))
                } else {

                    setImagePreviewUrl(null)
                }
            }
        }

        setIsOpenModal(true)
    }

    

    // Se guarda la imagen en un estado y luego se guarda su en otro estado
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            setSelectedImage(file)
            setImagePreviewUrl(URL.createObjectURL(file))
        }
    }

    const handleOpenModalView = (index: number) => {
        const empresa = empresas[index];
        if (empresa.logo) {
            setImagePreviewUrl(URL.createObjectURL(empresa.logo))
        } else {
            setImagePreviewUrl(null)
        }
        setIsModalViewOpen(true)
    };

    const handleCloseModalView = () => {
        setIsModalViewOpen(false)
    }

    return{
        values,
        empresas,
        isModalViewOpen,
        isOpenModal,
        selectedImage,
        imagePreviewUrl,
        editingIndex,
        setEmpresa,
        setEditingIndex,
        setImagePreviewUrl,
        setSelectedImage,
        setIsOpenModal,
        handleOpenModal,
        handleOpenModalView,
        handleCloseModalView,
        handleImageChange,
        handleChange,
        handleSubmitForm,
        handleCloseModal,
        resetForm,
    }
}