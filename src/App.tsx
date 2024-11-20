import { useEffect } from "react";
import { AppRouter } from "./routes/AppRouter"
import { useNavigate } from "react-router-dom";


function App() {

  const navigate = useNavigate();

  useEffect(() => {
    // Al recargar la página, redirige automáticamente a '/home'
    navigate('/home', { replace: true });
  }, [navigate]);

  return (
    <>
      <AppRouter />
    </>
  )
}

export default App
