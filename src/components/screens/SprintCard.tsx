import styles from "./SprintCard.module.css"

export const SprintCard = () => {
  return (
    <>
      <div className={styles.containerMain}>
        <h2>Sprint 1</h2>
        <p>inicio: 2025-05-12</p>
        <p>cierre: 2025-05-22</p>

        <div className={styles.containerIcons}>
            <span className="material-symbols-outlined">visibility</span>
            <span className="material-symbols-outlined">edit</span>
            <span className="material-symbols-outlined" style={{color:"#DE2C2C"}}>delete</span> 
        </div>
      </div>
    </>
  )
}
