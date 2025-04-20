import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/auth-context";
import ProtectedRoute from "@/components/protected-route";
import LoginPage from "@/pages/auth/login";
import Layout from "./components/layout/Layout";
import BookingDetailsPage from "./pages/bookings/booking-details";
import Bookings from "./pages/bookings/bookings";
import Dashboard from "./pages/dashboard";
import ScanPage from "./pages/scan";
import ExpensesPage from "./pages/expenses/expenses";
import FinancesPage from "@/pages/finances/finances";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/bookings">
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/bookings/:id" element={<BookingDetailsPage />} />
          </Route>
          <Route path="/scan" element={<ScanPage />} />
          <Route path="/expenses" element={<ExpensesPage />} />
          <Route path="/finances" element={<FinancesPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
