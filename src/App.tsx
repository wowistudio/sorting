import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Other from "./pages/Other";

import { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/other" element={<Other />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
