import { TareaCard } from "../TareaCard/TareaCard"
import styles from "./Sprints.module.css"

export const Sprints = () => {
  return (
    <>
        <div className={styles.sprintsContainer}>
            <div className={styles.headerSprints}>
                <h2 className={styles.headerTitle}>Nombre del sprint</h2>

                <div className={styles.crearTareaContainer}>
                    <button>Crear Tarea<span className="material-symbols-outlined">add</span></button>
                    <h2 style={{fontSize:"20px", color:"#27446E", fontWeight:"700"}}>Tareas del sprint</h2>
                </div>
            </div>

            <div className={styles.bodySprints}>
                <div className={styles.column}>
                    <div className={styles.topOfColumn}>
                        <h3>Pendiente</h3>
                    </div>

                    <div className={styles.columnBodyContainer}>
                        <div className={styles.columnBody}>
                            <TareaCard/>
                            
                        </div>
                    </div>
                </div>

                <div className={styles.column}>
                    <div className={styles.topOfColumn}>
                        <h3>En progreso</h3>
                    </div>

                    <div className={styles.columnBodyContainer}>
                        <div className={styles.columnBody}>
                            
                        </div>
                    </div>
                </div>

                <div className={styles.column}>
                    <div className={styles.topOfColumn}>
                        <h3>Completado</h3>
                    </div>

                    <div className={styles.columnBodyContainer}>
                        <div className={styles.columnBody}>
                            <TareaCard/>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}
