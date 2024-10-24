import styles from './Home.module.css';
import { useForm } from '../../hooks/useForm/UseForm';
import Modal from '../../ui/Modal/Modal';


export const Home = () => {

    const { values,isOpenModal,imagePreviewUrl,selectedImage,editingIndex,empresas,isModalViewOpen
        ,handleCloseModalView,handleChange,handleOpenModal,setEmpresa,handleCloseModal, handleOpenModalView
        ,handleImageChange } = useForm({ nombre: '', razonSocial: '', cuit: '' });

    const { nombre, razonSocial, cuit } = values

    // Al enviar el formulario se guardan todos los valores de los inputs en el estado empresas y luego se cierra el modal
    // Con ayuda del estado editingIndex se sabe si se debe crear una nueva empresa o reemplazarse al momento de modificarla
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        if (selectedImage) {
            if (editingIndex !== null) {
                
                setEmpresa(prev => {
                    const updatedEmpresas = [...prev];
                    updatedEmpresas[editingIndex] = { nombre, razonSocial, cuit, logo: selectedImage };
                    return updatedEmpresas;
                });
            } else {
                
                setEmpresa(prev => [...prev, { nombre, razonSocial, cuit, logo: selectedImage }]);
            }

            handleCloseModal()
        }
    }


    return (
        <>
            <div className={styles.containerView}>

                {/* ASIDE DE HOME */}
                <aside className={styles.asideContainer}>
                    <div>
                        <h1 style={{ fontSize: '1.8rem' }}>Empresas</h1>
                    </div>
                    <div>
                        <button onClick={() => handleOpenModal()}>Agregar Empresa</button>
                    </div>
                    <div className={styles.empresasContainer} >
                        {empresas.map((empresa, index) => (
                            <div key={index} className={styles.tarjetaEmpresaContainer} >
                                <h3>{empresa.nombre}</h3>

                                <div className={styles.iconsContainer}  >
                                    <span style={{ scale: '1.2' }} className="material-symbols-outlined" onClick={() => { handleOpenModal(index) }}>edit</span>
                                    <span style={{ scale: '1.2' }} className="material-symbols-outlined" onClick={() => { handleOpenModalView(index) }}>visibility</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>


                {/* MAIN DE HOME */}
                <div className={styles.mainContainer}>
                    <div className={styles.containerButtonSucursal}>
                        <button>Agregar Sucursal</button>
                    </div>

                    <div className={styles.containerSucursales}>

                    </div>
                </div>
            </div>


            
            {
            /* APARECE EL POPUP SI 'isOpenModal' ES 'true' */
            isOpenModal && (
                <Modal>
                    <form onSubmit={handleSubmit} className={styles.modalContainer}>
                        <h2>{editingIndex !== null ? 'EDITAR EMPRESA' : 'CREAR UNA EMPRESA'}</h2>
                        <input
                            name='nombre'
                            type="text"
                            placeholder='Ingrese nombre'
                            value={nombre}
                            onChange={handleChange}
                            required
                        />
                        <input
                            name='razonSocial'
                            type="text"
                            placeholder='Ingrese razon social'
                            value={razonSocial}
                            onChange={handleChange}
                            required
                        />
                        <input
                            name='cuit'
                            type="text"
                            placeholder='Ingrese Cuit'
                            value={cuit}
                            onChange={handleChange}
                            required
                        />

                        <div className={styles.containerAgregarimagen}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                id="file-upload"
                                style={{ display: 'none' }} // Oculta el input
                                required
                            />
                            <label htmlFor="file-upload" className={styles.customFileUpload}>
                                Seleccionar imagen
                            </label>
                            {selectedImage ? (
                                <img
                                    src={imagePreviewUrl!}
                                    alt="Vista previa"
                                    style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'cover' }}
                                />
                            ) : (
                                <span className="material-symbols-outlined" style={{ scale: '3.8' }}>no_photography</span>
                            )}
                        </div>

                        <div className={styles.containerButton}>
                            <button style={{ backgroundColor: '#F80000' }} onClick={handleCloseModal}>Cancelar</button>
                            <button style={{ backgroundColor: '#26E200' }} type='submit'>Confirmar</button>
                        </div>
                    </form>
                </Modal>
            )}

            {
            /* APARECE EL POPUP DE VER EMPRESA SI 'isModalViewOpen' ES 'true' */
            isModalViewOpen && (
                <Modal>
                    <div className={styles.modalVerEmpresa}>
                        <h2>EMPRESA</h2>
                        <div style={{width:'80%'}}>
                            <h3>{nombre}</h3>
                            <h3>{razonSocial}</h3>
                            <h3>{cuit}</h3>
                        </div>
                        <div className={styles.logoContainer}>
                            <h3>Logo:</h3>
                            {imagePreviewUrl && (<img src={imagePreviewUrl}/>)}
                        </div>
                        
                        <button onClick={handleCloseModalView} >Cerrar</button>
                    </div>
                </Modal>
            )}
        </>
    );
};