import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import LandingPage from "./pages/LandingPage";
import { useAuth } from "./context/AuthContext";
import Government from "./pages/Government"
import Provider from "./pages/Provider";
import Trainee from "./pages/Trainee";
import Employer from "./pages/Employer";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/government"
        element={
          <ProtectedRoute>
            <Government />
          </ProtectedRoute>
        }
      />

      <Route
        path="/provider"
        element={
          <ProtectedRoute>
            <Provider />
          </ProtectedRoute>
        }
      />

      <Route
        path="/trainee"
        element={
          <ProtectedRoute>
            <Trainee />
          </ProtectedRoute>
        }
      />

      <Route
        path="/employer"
        element={
          <ProtectedRoute>
            <Employer />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
