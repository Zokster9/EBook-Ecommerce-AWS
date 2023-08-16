import { Route, Routes } from "react-router-dom";
import LoginPage from "../../pages/LoginPage/LoginPage";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />}></Route>
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
};

export default AppRouter;
