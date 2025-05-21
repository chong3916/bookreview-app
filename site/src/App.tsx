import './App.css'
import {Routes, Route, BrowserRouter} from "react-router";
import HomePage from "./pages/HomePage.tsx";
import SignupPage from "./pages/SignupPage.tsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/signup" element={<SignupPage/>}/>
                {/*<Route path="/login" element={<LoginPage/>}/>*/}
                <Route path="/" element={<HomePage/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App
