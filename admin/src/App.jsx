import { Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import BookingDetails from "./pages/bookings/booking-details";
import Bookings from "./pages/bookings/bookings";
import Dashboard from "./pages/dashboard";
import Expenses from "./pages/expenses";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/bookings">
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/bookings/:id" element={<BookingDetails />} />
        </Route>
        <Route path="/expenses" element={<Expenses />} />
      </Route>
    </Routes>
  );
}

export default App;
