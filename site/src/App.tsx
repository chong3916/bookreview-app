import './App.css'
import {Routes, Route, BrowserRouter} from "react-router";
import HomePage from "./pages/HomePage.tsx";
import SignupPage from "./pages/SignupPage.tsx";
import LoginPage from "@/pages/LoginPage.tsx";
import {AuthContextProvider} from "@/contexts/AuthContext.tsx";
import {SearchContextProvider} from "@/contexts/SearchContext.tsx";
import SearchResultsPage from "@/pages/SearchResultsPage.tsx";
import {ThemeProvider} from "@/contexts/ThemeProvider.tsx";
import BookDetailsPage from "@/pages/BookDetailsPage.tsx";
import EditionsPage from "@/pages/EditionsPage.tsx";

function App() {
    return (
        <BrowserRouter>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <AuthContextProvider>
                    <SearchContextProvider>
                        <div className="min-h-screen bg-slate-900 text-white">
                            <Routes>
                                <Route path="/books/:bookId" element={<BookDetailsPage/>}/>
                                <Route path="/signup" element={<SignupPage/>}/>
                                <Route path="/search" element={<SearchResultsPage />} />
                                <Route path="/login" element={<LoginPage/>}/>
                                <Route path="/editions/:editionId" element={<EditionsPage />} />
                                <Route path="/" element={<HomePage/>}/>
                            </Routes>
                        </div>
                    </SearchContextProvider>
                </AuthContextProvider>
            </ThemeProvider>
        </BrowserRouter>
    )
}

export default App
