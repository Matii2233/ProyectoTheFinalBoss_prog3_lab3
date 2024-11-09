import { FC, useEffect, useState } from "react";
import { ICreateSucursal } from "../../../../../types/dtos/sucursal/ICreateSucursal";
import { SucursalService } from "../../../../../services/SucursalService";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/redux";
import { Button, Modal } from "react-bootstrap";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import TextFieldValue from "../../../fields/textField/TextField";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { PaisService } from "../../../../../services/PaisService";
import { IPais } from "../../../../../types/IPais";
import { removePaisActive, setPaisActive, setPaises } from "../../../../../redux/store/slices/PaisReducer";
import { ProvinciaService } from "../../../../../services/ProvinciaService";
import { removeProvinciaActive, setProvinciaActive, setProvinciasPorPais } from "../../../../../redux/store/slices/ProvinciaReducer";
import { IProvincia } from "../../../../../types/IProvincia";
import { removeLocalidadActive, setLocalidadActive, setLocalidadesPorProvincia } from "../../../../../redux/store/slices/LocalidadReducer";
import { LocalidadService } from "../../../../../services/LocalidadService";
import { ILocalidad } from "../../../../../types/ILocalidad";
import { removeSucursalActive } from "../../../../../redux/store/slices/SucursalReducer";
import { EmpresaService } from "../../../../../services/EmpresaService";
import { setEmpresas } from "../../../../../redux/store/slices/EmpresaReducer";
import styles from "./ModalCrearSucursal.module.css"
import { IUpdateSucursal } from "../../../../../types/dtos/sucursal/IUpdateSucursal";
import "../../../../../assets/scss/_content-sucursal.scss"
import { UploadImage } from "../../../UploadImage";
import { ISucursal } from "../../../../../types/dtos/sucursal/ISucursal";

interface IModalSucursal {
    openModal: boolean;
    setOpenModal: (state: boolean) => void;
}

export const ModalCrearSucursal: FC<IModalSucursal> = ({ openModal, setOpenModal }: IModalSucursal) => {

    const [image, setImage] = useState<string | null>(null) // Imagen manejada como string

    const empresaActive = useAppSelector(
        (state) => state.empresaReducer.empresaActive
    );
    const sucursalActive = useAppSelector(
        (state) => state.sucursalReducer.sucursalActive
    );

    const initialValues: ICreateSucursal = {
        nombre: "",
        horarioApertura: "00:00:00",
        horarioCierre: "00:00:00",
        esCasaMatriz: false,
        latitud: 0,
        longitud: 0,
        domicilio: {
            calle: "",
            numero: 0,
            cp: 0,
            piso: 0,
            nroDpto: 0,
            idLocalidad: -1,
        },
        idEmpresa: (empresaActive ? (empresaActive.id) : (0)),
        logo: null,
    }

    const dispatch = useAppDispatch();
    const API_URL = import.meta.env.VITE_API_URL;
    const empresaService = new EmpresaService(API_URL + "/empresas");
    const getEmpresas = async () => {
        await empresaService.getAll().then((empresaData) => {
            dispatch(setEmpresas(empresaData));
        });
    };

    // CONFIG PAIS //
    const paisService = new PaisService(API_URL + "/paises")
    const paisActive = useAppSelector(
        (state) => state.paisReducer.paisActive
    )
    const [listaPaises, setListaPaises] = useState<IPais[]>([])
    const getPaises = async () => {
        await paisService.getAll().then((paisesData) => {
            const paisesFiltrados = paisesData.filter(pais => pais.nombre !== null)
            setListaPaises(paisesFiltrados);
            dispatch(setPaises(paisesFiltrados));
        });
    };
    const handlePaisActive = (pais: IPais) => {
        dispatch(setPaisActive({ element: pais }))
    }
    useEffect(() => {
        getPaises()
    }, [])

    // CONFIG PROVINCIA //
    const provinciaService = new ProvinciaService(API_URL + "/provincias/findByPais")
    const provinciaActive = useAppSelector(
        (state) => state.provinciaReducer.provinciaActive
    );
    const [listaProvincias, setListaProvincias] = useState<IProvincia[]>([])
    const getProvinciasPorPais = async () => {
        paisActive ?
            (
                await provinciaService.getAllByPaisId(paisActive.id).then((provinciasData) => {
                    const provinciasFiltradas = provinciasData.filter(provincia => provincia.nombre !== null)
                    dispatch(setProvinciasPorPais({ paisId: paisActive.id, provincias: provinciasFiltradas }))
                    setListaProvincias(provinciasFiltradas)
                })
            )
            :
            (console.log("No hay un país activo"))
    }
    const handleProvinciaActive = (provincia: IProvincia) => {
        dispatch(setProvinciaActive(provincia))
    }
    useEffect(() => {
        getProvinciasPorPais()
    }, [paisActive])

    // CONFIG LOCALIDAD //
    const localidadService = new LocalidadService(API_URL + "/localidades/findByProvincia")
    const localidadActive = useAppSelector(
        (state) => state.localidadReducer.localidadActive
    );
    const [listaLocalidades, setListaLocalidades] = useState<ILocalidad[]>([])
    const getLocalidadesPorProvincia = async () => {
        provinciaActive ? (
            await localidadService.getAllByProvinciaId(provinciaActive.id).then((localidadesData) => {
                const localidadesFiltradas = localidadesData.filter(localidad => localidad.nombre !== null)
                dispatch(setLocalidadesPorProvincia({ provinciaId: provinciaActive.id, localidades: localidadesFiltradas }))
                setListaLocalidades(localidadesFiltradas)
            })
        )
            :
            (console.log("No hay una provincia activa"))
    }
    useEffect(() => {
        getLocalidadesPorProvincia()
    }, [provinciaActive])

    // HORARIOS
    const [horarioDeApertura, setHorarioDeApertura] = useState("")
    const [horarioDeCierre, setHorarioDeCierre] = useState("")

    useEffect(() => {
        if (sucursalActive) {
            setHorarioDeApertura(sucursalActive.horarioApertura.substring(0, 5)); // Establece el valor de apertura
            setHorarioDeCierre(sucursalActive.horarioCierre.substring(0, 5)); // Establece el valor de cierre

            // Establece la localidad si existe
            if (sucursalActive.domicilio.localidad) {
                setLocalidadActive(sucursalActive.domicilio.localidad);
            }
        } else {
            // Opcional: reinicia los valores si no hay sucursal activa
            setHorarioDeApertura("00:00");
            setHorarioDeCierre("00:00");
            removeLocalidadActive();
        }
    }, [sucursalActive]);
    const handleClose = () => {
        setOpenModal(false);
        dispatch(removeSucursalActive())
        dispatch(removePaisActive())
        dispatch(removeProvinciaActive())
        dispatch(removeLocalidadActive())
    };
    return (
        <div>
            <Modal
                id={"sucursalModal"}
                show={openModal}
                onHide={handleClose}
                size={"xl"}
                backdrop="static"
                keyboard={false}
                centered
            >
                <Modal.Header className={styles.modalHeader}>
                    {sucursalActive ?
                        (
                            <Modal.Title>Editar Sucursal</Modal.Title>
                        )
                        :
                        (
                            <Modal.Title>Crear una Sucursal</Modal.Title>
                        )}
                </Modal.Header>
                <Modal.Body className={styles.modalBody}>
                    <Formik
                        validationSchema={Yup.object({
                            nombre: Yup.string().required("campo requerido"),
                            horarioApertura: Yup.string().required("campo requerido"),
                            horarioCierre: Yup.string().required("campo requerido"),
                            esCasaMatriz: Yup.boolean(),
                            latitud: Yup.number().required("campo requerido"),
                            longitud: Yup.number().required("campo requerido"),
                            domicilio: Yup.object({
                                calle: Yup.string().required("campo requerido"),
                                numero: Yup.number().required("campo requerido"),
                                cp: Yup.number().required("campo requerido"),
                                piso: Yup.number().required("campo requerido"),
                                nroDpto: Yup.number().required("campo requerido"),
                                idLocalidad: Yup.number().required("campo requerido"),
                            }),
                        })}
                        initialValues={sucursalActive ?
                            {
                                nombre: sucursalActive?.nombre,
                                horarioApertura: sucursalActive?.horarioApertura.substring(0, 5),
                                horarioCierre: sucursalActive?.horarioCierre.substring(0, 5),
                                esCasaMatriz: sucursalActive?.esCasaMatriz,
                                latitud: sucursalActive?.latitud,
                                longitud: sucursalActive?.longitud,
                                domicilio: {
                                    calle: sucursalActive?.domicilio.calle,
                                    numero: sucursalActive?.domicilio.numero,
                                    cp: sucursalActive?.domicilio.cp,
                                    piso: sucursalActive?.domicilio.piso,
                                    nroDpto: sucursalActive?.domicilio.nroDpto,
                                    idLocalidad: sucursalActive?.domicilio.localidad.id,
                                },
                                idEmpresa: sucursalActive?.empresa.id,
                                logo: (sucursalActive?.logo ? (sucursalActive.logo) : ("")),
                            }
                            : initialValues}
                        enableReinitialize={true}
                        onSubmit={async (values: ICreateSucursal) => {
                            (image ? (values.logo = image) : (values.logo = null))
                            const sucursalService = new SucursalService(API_URL + "/sucursales");
                            if (sucursalActive) {
                                const updateValues: IUpdateSucursal = {
                                    id: sucursalActive.id,
                                    nombre: values.nombre,
                                    idEmpresa: (empresaActive ? (empresaActive.id) : (0)),
                                    eliminado: sucursalActive.eliminado,
                                    latitud: values.latitud,
                                    longitud: values.longitud,
                                    domicilio: {
                                        id: sucursalActive.domicilio.id,
                                        calle: values.domicilio.calle,
                                        numero: values.domicilio.numero,
                                        cp: values.domicilio.cp,
                                        piso: values.domicilio.piso,
                                        nroDpto: values.domicilio.nroDpto,
                                        idLocalidad: values.domicilio.idLocalidad,
                                    },
                                    logo: values.logo,
                                    categorias: sucursalActive.categorias,
                                    esCasaMatriz: values.esCasaMatriz,
                                    horarioApertura: values.horarioApertura,
                                    horarioCierre: values.horarioCierre,
                                }
                                await sucursalService.put(sucursalActive.id, updateValues);
                            } else {
                                await sucursalService.post(values);
                            }
                            dispatch(removeSucursalActive())
                            getEmpresas();
                            handleClose();
                        }}
                    >
                        {({ values, setFieldValue }) => (
                            <Form autoComplete="off" style={{ display: "flex", flexDirection: "column", gap: "5vh" }}>
                                <div className={styles.containerFormModal}>
                                    <div className={styles.containerFormModalIzquierda}>
                                        <TextFieldValue
                                            name="nombre"
                                            type="text"
                                            placeholder="Ingrese el nombre de la sucursal"
                                            customWidth="300px"
                                        />
                                        <div className={styles.containerTimeInput}>
                                            <input
                                                className={styles.timeInput}
                                                type="time"
                                                name="horarioDeApertura"
                                                value={horarioDeApertura}
                                                onChange={(event) => {
                                                    setHorarioDeApertura(event.target.value);
                                                    setFieldValue("horarioApertura", `${event.target.value}:00`);
                                                }}
                                            />
                                            <input
                                                className={styles.timeInput}
                                                type="time"
                                                name="horarioDeCierre"
                                                value={horarioDeCierre}
                                                onChange={(event) => {
                                                    setHorarioDeCierre(event.target.value);
                                                    setFieldValue("horarioCierre", `${event.target.value}:00`);
                                                }}
                                            />
                                        </div>

                                        <div className={styles.containerCheckBox}>
                                            <input
                                                type="checkbox"
                                                name="esCasaMatriz"
                                                checked={values.esCasaMatriz}
                                                onChange={() => setFieldValue("esCasaMatriz", !values.esCasaMatriz)}
                                                id="casaMatriz"
                                                style={{ accentColor: "#006284", scale: "1.5" }}
                                            />
                                            <label htmlFor="casaMatriz">Casa Matriz</label>
                                        </div>
                                    </div>
                                    <div className={styles.containerFormModalCentro}>
                                        <div className={styles.containerDropdowns}>
                                            <DropdownButton
                                                id="dropdown-item-button"
                                                title={(sucursalActive ? (sucursalActive.domicilio.localidad.provincia.pais.nombre) : (paisActive ? (paisActive.nombre) : ("Seleccione un país")))}
                                                menuVariant="dark"
                                            >
                                                {listaPaises.map((pais, index) => (
                                                    <Dropdown.Item
                                                        key={index}
                                                        as="button"
                                                        onClick={(event) => {
                                                            event.preventDefault();
                                                            handlePaisActive(pais)
                                                        }}
                                                    >{pais.nombre}</Dropdown.Item>
                                                ))}
                                            </DropdownButton>
                                            <DropdownButton
                                                id="dropdown-item-button"
                                                title={(sucursalActive ? (sucursalActive.domicilio.localidad.provincia.nombre) : (provinciaActive ? (provinciaActive.nombre) : ("Seleccione una provincia")))}
                                                menuVariant="dark"
                                            >
                                                {paisActive ? (
                                                    listaProvincias.map((provincia, index) => (
                                                        <Dropdown.Item as="button" key={index} onClick={(event) => {
                                                            event.preventDefault();
                                                            handleProvinciaActive(provincia)
                                                        }}>{provincia.nombre}</Dropdown.Item>
                                                    ))) : (
                                                    <Dropdown.ItemText>Seleccione un País primero</Dropdown.ItemText>
                                                )
                                                }
                                            </DropdownButton>
                                            <DropdownButton
                                                id="dropdown-item-button"
                                                title={(sucursalActive ? (sucursalActive.domicilio.localidad.nombre) : (localidadActive ? (localidadActive.nombre) : ("Seleccione una localidad")))}
                                                className={styles.dropdowns}
                                                menuVariant="dark"
                                            >
                                                {provinciaActive ? (
                                                    listaLocalidades.map((localidad, index) => (
                                                        <Dropdown.Item as="button" key={index} onClick={(event) => {
                                                            event.preventDefault();
                                                            dispatch(setLocalidadActive(localidad))
                                                            setFieldValue("domicilio.idLocalidad", localidad.id)
                                                        }}>{localidad.nombre}</Dropdown.Item>
                                                    ))) : (
                                                    <Dropdown.ItemText>Seleccione una provincia primero</Dropdown.ItemText>
                                                )
                                                }
                                            </DropdownButton>
                                        </div>
                                        <TextFieldValue
                                            name="latitud"
                                            type="number"
                                            placeholder="Latitud"
                                            customWidth="300px"
                                        />
                                        <TextFieldValue
                                            name="longitud"
                                            type="number"
                                            placeholder="Longitud"
                                            customWidth="300px"
                                        />
                                    </div>
                                    <div className={styles.containerFormModalDerecha}>
                                        <TextFieldValue
                                            name="domicilio.calle"
                                            type="text"
                                            placeholder="Nombre de la calle"
                                            customWidth="300px"
                                        />
                                        <TextFieldValue
                                            name="domicilio.numero"
                                            type="number"
                                            placeholder="Número de la calle"
                                            customWidth="300px"
                                        />
                                        <TextFieldValue
                                            name="domicilio.cp"
                                            type="number"
                                            placeholder="Código postal"
                                            customWidth="300px"
                                        />
                                        <TextFieldValue
                                            name="domicilio.piso"
                                            type="number"
                                            placeholder="Ingrese un número de piso"
                                            customWidth="300px"
                                        />
                                        <TextFieldValue
                                            name="domicilio.nroDpto"
                                            type="number"
                                            placeholder="Ingrese un número de departamento"
                                            customWidth="300px"
                                        />
                                    </div>
                                </div>
                                <div className={styles.containerImagen}>
                                    <div className={styles.containerAgregarimagen}>
                                        <UploadImage image={image} setImage={setImage} elementActive={sucursalActive as ISucursal}/>
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
        </div >
    )
}
export default ModalCrearSucursal;
