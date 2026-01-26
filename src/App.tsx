import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Other from "./pages/Other";

import './App.css';

function App() {
    return (
        <div className="w-full h-full">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/other" element={<Other />} />
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App
