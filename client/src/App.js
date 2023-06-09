import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Register, Landing, Error, ProtectedRoute } from "./pages";
import {
  Profile,
  SharedLayout,
  Metrics,
  Home,
} from "./pages/dashboard";
import SelectLoc from "./pages/SelectLoc";
import EnterCode from "./pages/EnterCode";
import SelectRole from "./pages/SelectRole";
import JoinForm from "./pages/JoinForm";
import Form from "./pages/Form";
import Success from "./components/Sucess";
import FormMetrics from "./pages/FormMetrics";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <SharedLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="metrics" element={<Metrics />} />
          <Route path="profile" element={<Profile />} />
          <Route path="/api/v1/form/:formCode" element={<FormMetrics />}/>
          <Route path="/api/v1/form/" element={<FormMetrics />}/>
        </Route>

        <Route path="/selectLoc" element={
          <ProtectedRoute>
            <SelectLoc />
          </ProtectedRoute>
        } />
        <Route path="/joinedForm" element={<JoinForm />} />
        <Route path="/form" element={<Form />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/register/admin" element={<Register />} /> */}
        <Route path="/landing" element={<SelectRole />} />
        <Route path="/enterCode" element={<EnterCode />} />
        <Route path="/success" element={<Success />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
