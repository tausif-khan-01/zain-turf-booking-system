import ProtectedRoute from "@/components/protected-route";
import { AuthProvider } from "@/contexts/auth-context";
import LoginPage from "@/pages/auth/login";
import FinancesPage from "@/pages/finances/finances";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import BookingDetailsPage from "./pages/bookings/booking-details";
import Bookings from "./pages/bookings/bookings";
import BookingPage from "./pages/bookings/new/new-booking";
import Dashboard from "./pages/dashboard/dashboard";
import ExpensesPage from "./pages/expenses/expenses";
import ScanPage from "./pages/scan";
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
            <Route path="/bookings/new" element={<BookingPage />} />
            <Route path="/bookings/:id" element={<BookingDetailsPage />} />
          </Route>
          <Route path="/scan" element={<ScanPage />} />
          <Route path="/expenses" element={<ExpensesPage />} />
          {/* <Route path="/expenses" element={<MaintenancePage />} /> */}
          <Route path="/finances" element={<FinancesPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
