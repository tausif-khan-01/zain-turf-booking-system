import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/home";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
