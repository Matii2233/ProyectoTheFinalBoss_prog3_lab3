import styles from './Home.module.css'

export const Home = () => {


    return (
        <>
            <div className={styles.containerView} >
                <aside className={styles.asideContainer} >
                    <div>
                      <h1 style={{fontSize: '1.8rem'}} >Empresas</h1>
                    </div>

                    <div>
                      <button>Agregar Empresa</button>
                    </div>

                    <div className={styles.empresaContainer} >
                    </div>
                </aside>

                <div className={styles.mainContainer} >
                    <div className={styles.containerButtonSucursal} >
                        <button>Agregar Sucursal</button>
                    </div>

                    <div className={styles.containerSucursales} >

                    </div>
                </div>
            </div>

        </>
    )
}
