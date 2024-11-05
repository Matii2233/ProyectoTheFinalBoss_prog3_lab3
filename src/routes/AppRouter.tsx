import { Navigate, Route, Routes } from "react-router-dom"
import { Home } from "../components/screens/Home/Home"

export const AppRouter = () => {

    return (
        <>
            <Routes>
                <Route path="/" element= {<Navigate to={"/home"} />} />
                <Route path="/home" element= {<Home />} />
            </Routes>
        </>
    )
}