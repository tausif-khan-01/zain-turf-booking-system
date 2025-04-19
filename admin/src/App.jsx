import { Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import BookingDetailsPage from "./pages/bookings/booking-details";
import Bookings from "./pages/bookings/bookings";
import Dashboard from "./pages/dashboard";
import ScanPage from "./pages/scan";
import ExpensesPage from "./pages/expenses/expenses";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/bookings">
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/bookings/:id" element={<BookingDetailsPage />} />
        </Route>
        <Route path="/scan" element={<ScanPage />} />
        <Route path="/expenses" element={<ExpensesPage />} />
      </Route>
    </Routes>
  );
}

export default App;
