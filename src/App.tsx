import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainFormPage from "./pages/main/main-form.page";


const App = () => {
  return (
    <BrowserRouter>
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Routes>
        <Route path="/" element={<MainFormPage />} />
        {/* <Route path="/menu/:menuType" element={<MenuDisplay />} /> */}
      </Routes>
    </div>
  </BrowserRouter>
  );
};

export default App;
