import { FC, useEffect, useState } from 'react'
import { IImagen } from '../../../../../types/IImagen';
import { useAppDispatch, useAppSelector } from '../../../../../hooks/redux';
import { ICreateProducto } from '../../../../../types/dtos/productos/ICreateProducto';
import { Button, Dropdown, DropdownButton, Modal } from 'react-bootstrap';
import styles from "./ModalCrearProducto.module.css"
import { Formik } from 'formik';
import * as Yup from "yup";
import { IUpdateProducto } from '../../../../../types/dtos/productos/IUpdateProducto';
import { removeProductoActive } from '../../../../../redux/store/slices/ProductoReducer';
import TextFieldValue from '../../../fields/textField/TextField';
import { Form } from 'formik';
import { IAlergenos } from '../../../../../types/dtos/alergenos/IAlergenos';
import { setAlergenoActive, setDataAlergeno } from '../../../../../redux/store/slices/AlergenoReducer';
import { AlergenosService } from '../../../../../services/AlergenosService';
import { ICategorias } from '../../../../../types/dtos/categorias/ICategorias';
import { CategoriasServices } from '../../../../../services/CategoriasServices';
import { setCategoriaActive, setDataCategorias } from '../../../../../redux/store/slices/CategoriasReducer';
import "../../../../../assets/scss/_content-sucursal.scss"
import { ProductosService } from '../../../../../services/ProductosService';
import { UploadImage } from '../../../UploadImage';
import Select from "react-select"


interface IModalCrearProductos {
    getProductos: Function
    isOpenModal: boolean
    setOpenModal: (state: boolean) => void;
}

export const ModalCrearProducto: FC<IModalCrearProductos> = ({ isOpenModal, setOpenModal, getProductos }: IModalCrearProductos) => {
    const [imagen, setImagen] = useState<IImagen | null>(null);
    const [selectedAlergeno, setSelectedAlergeno] = useState("Sin alergenos");
    const [selectedCategoria, setSelectedCategoria] = useState("Sin categoria");
    const [alergeno, setAlergeno] = useState<IAlergenos[]>([])
    const [categorias, setCategorias] = useState<ICategorias[]>([]);

    const productoActive = useAppSelector((state) => state.productoReducer.productoActive)

    const initialValues: ICreateProducto = {
        denominacion: "",
        precioVenta: 0,
        descripcion: "",
        habilitado: false,
        codigo: "",
        idCategoria: 0,
        idAlergenos: [],
        imagenes: []

    }
    const dispatch = useAppDispatch();

    const API_URL = import.meta.env.VITE_API_URL

    const sucursalActive = useAppSelector( (state) => state.sucursalReducer.sucursalActive)

    const categoriasServices = new CategoriasServices(API_URL + "/categorias");

    const alergenoServices = new AlergenosService(API_URL + "/alergenos")
    const alergenoData = useAppSelector((state) => state.alergenoReducer.dataAlergenos);
    const getAlergenos = async () => {
        await alergenoServices.getAll().then((alergenoData) => {
            dispatch(setDataAlergeno(alergenoData));
            setAlergeno(alergenoData);
        });
    };

    const categoriasData = useAppSelector((state) => state.categoriaReducer.dataCategorias);
    
    const getCategorias = async () => {
        await categoriasServices.getSubcategoriasBySucursal(sucursalActive?.id as number).then((categoriasData) => {
            dispatch(setDataCategorias(categoriasData));
            setCategorias(categoriasData);
        });
    };

    useEffect(() => {
        getCategorias()
        if (productoActive && productoActive.categoria) { setSelectedCategoria(productoActive.categoria.denominacion) }
    }, [])

    console.log('categorias data: ', categoriasData)

    const handelCategoriaActive = (categoria: ICategorias) => {
        dispatch(setCategoriaActive({ element: categoria }))
    }
    const handelAlergenoActive = (alergeno: IAlergenos) => {
        dispatch(setAlergenoActive({ element: alergeno }))
    }
    const handleClose = () => {
        setOpenModal(false);
        dispatch(removeProductoActive())
    }

    console.log('producto activo: ', productoActive)

    return (

        <Modal
            id={"modalCrearProducto"}
            show={isOpenModal}
            size={"xl"}
            backdrop="static"
            keyboard={false}
            centered
        >
            <Modal.Header className={styles.modalHeader}>

                {productoActive ? (<Modal.Title>Editar producto</Modal.Title>) : (<Modal.Title>Crear producto</Modal.Title>)}

            </Modal.Header>
            <Modal.Body className={styles.modalBody}>
                <Formik
                    validationSchema={Yup.object({
                        denominacion: Yup.string().required("campo requerido"),
                        idCategoria: Yup.number().required("campo requerido"),
                        idAlergenos: Yup.array().of(Yup.number()).required("campo requerido"),
                        precioVenta: Yup.number().required("campo requerido"),
                        codigo: Yup.string().required("campo requerido"),
                        descripcion: Yup.string().required("campo requerido"),
                    })}
                    initialValues={productoActive ? {
                        denominacion: productoActive?.denominacion,
                        precioVenta: productoActive?.precioVenta,
                        habilitado: productoActive?.habilitado,
                        codigo: productoActive?.codigo,
                        descripcion: productoActive?.descripcion,
                        idCategoria: productoActive?.categoria.id,
                        idAlergenos: productoActive.alergenos.map(alergeno => alergeno.id),
                        imagenes: productoActive?.imagenes
                    } : initialValues}
                    enableReinitialize={true}
                    onSubmit={async (values: ICreateProducto | IUpdateProducto, { resetForm }) => {

                        const productosServices = new ProductosService(API_URL + "/articulos");

                        console.log('valores iniciales onsubmit: ', values)

                        if (productoActive) {

                            const imagenesNuevas = [...productoActive.imagenes];

                            if (imagen?.url) {
                                
                                imagenesNuevas.push(imagen)
                            }


                            const updateValues: IUpdateProducto = {
                                id: productoActive.id,
                                denominacion: values.denominacion,
                                precioVenta: values.precioVenta,
                                habilitado: values.habilitado,
                                codigo: values.codigo === productoActive.codigo ? productoActive.codigo : values.codigo,
                                descripcion: values.descripcion,
                                idCategoria: values.idCategoria,
                                idAlergenos: values.idAlergenos,
                                imagenes: imagen?.url ? imagenesNuevas : productoActive.imagenes,
                            };

                            console.log('nuevosValores: ', updateValues)
                            
                            await productosServices.put(productoActive.id, updateValues);
                        } else {

                            const createValues: ICreateProducto = {
                                denominacion: values.denominacion,
                                precioVenta: values.precioVenta,
                                descripcion: values.descripcion,
                                habilitado: values.habilitado,
                                codigo: values.codigo,
                                idCategoria: values.idCategoria,
                                idAlergenos: values.idAlergenos,
                                imagenes: imagen ? [imagen] : [],
                            };

                            await productosServices.post(createValues);
                        }

                        dispatch(removeProductoActive());
                        getProductos();
                        handleClose();
                        resetForm();
                    }
                    }
                >
                    {({ values, setFieldValue, errors, touched }) => (
                        <Form autoComplete="off" style={{ display: "flex", flexDirection: "column", gap: "5vh" }}>
                            <div className={styles.containerFormModal}>
                                <div className={styles.containerFormModalIzquierda}>
                                    <TextFieldValue
                                        name="denominacion"
                                        type="text"
                                        placeholder="Ingrese el nombre del producto"
                                        customWidth="300px"
                                    />
                                    {touched.denominacion && errors.denominacion && (
                                        <div className="error">{errors.denominacion}</div>
                                    )}
                                    <div className={styles.containerDropdowns}>
                                        <div>
                                            <Select
                                                isMulti
                                                closeMenuOnSelect={false}
                                                options={alergenoData.map(alergeno => ({
                                                    value: alergeno.id,
                                                    label: alergeno.denominacion
                                                }))}
                                                onChange={(selectedOptions) => {
                                                    const selectedIds = selectedOptions.map((option) => option.value);
                                                    setFieldValue('idAlergenos', selectedIds);
                                                }}
                                                value={alergenoData
                                                    .filter(alergeno => values.idAlergenos.includes(alergeno.id))
                                                    .map(alergeno => ({ value: alergeno.id, label: alergeno.denominacion }))
                                                }
                                            />
                                            {touched.idAlergenos && errors.idAlergenos && (
                                                <div className="error">{errors.idAlergenos}</div>
                                            )}
                                        </div>

                                        <DropdownButton
                                            id="categoria"
                                            title={selectedCategoria ? selectedCategoria : 'Sin categoria'}
                                            className={styles.dropdowns}
                                            menuVariant="dark"
                                        >
                                            {categoriasData.map((subCategoria, index) => (
                                                    <Dropdown.Item
                                                        key={index}
                                                        as="button"
                                                        onClick={(event) => {
                                                            event.preventDefault();
                                                            setFieldValue('idCategoria', subCategoria.id);
                                                            handelCategoriaActive(subCategoria);
                                                            setSelectedCategoria(subCategoria.denominacion);
                                                        }}
                                                    >
                                                        {subCategoria.denominacion}
                                                    </Dropdown.Item>
                                                ))
                                            }
                                        </DropdownButton>

                                        {touched.idCategoria && errors.idCategoria && (
                                            <div className="error">{errors.idCategoria}</div>
                                        )}
                                    </div>


                                </div>
                                <div className={styles.containerFormModalCentro}>
                                    <div className={styles.containerDropdowns}>

                                    </div>
                                    <div className={styles.containerPrecioVenta}>
                                        <TextFieldValue
                                            name="precioVenta"
                                            type="number"
                                            placeholder="Ingrese el precio de venta"
                                            customWidth="300px"
                                        />
                                        {touched.precioVenta && errors.precioVenta && (
                                            <div className="error">{errors.precioVenta}</div>
                                        )}
                                    </div>
                                    <TextFieldValue
                                        name="codigo"
                                        type="text"
                                        placeholder="Ingrese el codigo"
                                        customWidth="300px"
                                    />
                                    {touched.codigo && errors.codigo && (
                                        <div className="error">{errors.codigo}</div>
                                    )}
                                </div>
                                <div className={styles.containerFormModalDerecha}>
                                    <TextFieldValue
                                        name="descripcion"
                                        type="textarea"
                                        placeholder="Ingrese descripcion"
                                        customWidth="300px"

                                    />
                                    {touched.descripcion && errors.descripcion && (
                                        <div className="error">{errors.descripcion}</div>
                                    )}

                                </div>
                                <div className={styles.containerCheckBox}>
                                    <input
                                        type="checkbox"
                                        name="habilitado"
                                        checked={values.habilitado}
                                        onChange={() => setFieldValue("habilitado", !values.habilitado)}
                                        id="habilitado"
                                        style={{ accentColor: "#006284", scale: "1.5" }}
                                    />
                                    <label htmlFor="habilitado">Habilitado</label>
                                </div>
                            </div>
                            <div className={styles.containerImagen}>
                                <div className={styles.containerAgregarimagen}>
                                {/*productoActive?.imagenes && productoActive.imagenes.length > 0 ? (
                                    <>
                                        <Carousel>
                                            {productoActive.imagenes.map((imagen, index) => (
                                                <Carousel.Item key={index}> 
                                                    <UploadImage
                                                    imageObjeto={imagen}
                                                    setImageObjeto={setImagen}
                                                    typeElement="articulos"
                                                    />
                                                </Carousel.Item>    
                                            ))}
                                        </Carousel>
                                    </>
                                    
                                ) : (
                                    <UploadImage
                                    imageObjeto={imagen}
                                    setImageObjeto={setImagen}
                                    typeElement="articulos"
                                    />
                                )*/}

                                    <UploadImage
                                    imageObjeto={imagen}
                                    setImageObjeto={setImagen}
                                    typeElement="articulos"
                                    />
                                    
                                </div>
                            </div>

                            <div className={styles.containerBotonesFormModal}>
                                <Button className={styles.buttonModalCancelar} onClick={handleClose}>Cancelar</Button>
                                <Button className={styles.buttonModalConfirmar} type="submit">Confirmar</Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </Modal.Body>
            <Modal.Footer style={{ backgroundColor: "#08192D", borderTop: "none" }}></Modal.Footer>
        </Modal>

    )
}