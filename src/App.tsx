import Home from "@/pages/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import './App.css';
import { ThemeProvider } from "./components/theme-provider";

function App() {
    return (
        <div className="w-full h-full">
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Home />} />
                    </Routes>
                </BrowserRouter>
            </ThemeProvider>
        </div>
    )
}

export default App
