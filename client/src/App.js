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
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import CertInfo from "./pages/CertInfo";
import Certificate from "./components/Certificate";
import VerifyTwoFactor from "./pages/VerifyTwoFactor";
import TwoFactorSent from "./pages/TwoFactorSent";
import PendingLocation from "./pages/PendingLocation";
import CreateLoc from "./pages/CreateLoc";
import LocationRequests from "./pages/LocationRequests";
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
          <Route path="/locationRequests" element={
            <LocationRequests />
        } />
          <Route path="profile" element={<Profile />} />
          <Route path="/api/v1/form/:formCode" element={<FormMetrics />}/>
          <Route path="/api/v1/form/" element={<FormMetrics />}/>
        </Route>

        <Route path="/selectLoc" element={
          <ProtectedRoute>
            <SelectLoc />
          </ProtectedRoute>
        } />
         <Route path="/pendingLocation" element={
          <ProtectedRoute>
            <PendingLocation />
          </ProtectedRoute>
        } />

        <Route path="/createLoc" element={
          <ProtectedRoute>
            <CreateLoc />
          </ProtectedRoute>
        } />
        <Route path="/selectStudentLoc" element={
            <SelectLoc noCode={true}/>
        } />
        <Route path="/joinedForm" element={<JoinForm />} />
        <Route path="/two-factor-sent" element={<TwoFactorSent />} />
        <Route path="/form" element={<Form />} />
        <Route path="/certificateInfo" element={<CertInfo />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/resetpassword/:token" element={<ResetPassword />} />
        <Route path="/2fa/:token" element={<VerifyTwoFactor />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/register/admin" element={<Register />} /> */}
        <Route path="/landing" element={<SelectRole />} />
        <Route path="/enterCode" element={<EnterCode />} />
        <Route path="/success" element={<Success />} />
        <Route path="/certificate" element={<Certificate />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
