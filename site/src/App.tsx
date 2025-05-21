import './App.css'
import {Routes, Route, BrowserRouter} from "react-router";
import HomePage from "./pages/HomePage.tsx";
import SignupPage from "./pages/SignupPage.tsx";
import LoginPage from "@/pages/LoginPage.tsx";
import {AuthContextProvider} from "@/contexts/AuthContext.tsx";

function App() {
    return (
        <BrowserRouter>
            <AuthContextProvider>
                <Routes>
                    <Route path="/signup" element={<SignupPage/>}/>
                    <Route path="/login" element={<LoginPage/>}/>
                    <Route path="/" element={<HomePage/>}/>
                </Routes>
            </AuthContextProvider>
        </BrowserRouter>
    )
}

export default App
