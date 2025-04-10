
import * as React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import FinancieroPage from "./pages/FinancieroPage";
import OperativoPage from "./pages/OperativoPage";
import QualityControlPage from "./pages/QualityControlPage";
import AccionesPage from "./pages/AccionesPage";
import AgendaPage from "./pages/AgendaPage";
import NotFound from "./pages/NotFound";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <BrowserRouter>
            <AuthProvider>
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                
                <Route element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }>
                  <Route path="/dashboard/financiero" element={<FinancieroPage />} />
                  <Route path="/dashboard/operativo" element={<OperativoPage />} />
                  <Route path="/dashboard/calidad" element={<QualityControlPage />} />
                  <Route path="/acciones" element={<AccionesPage />} />
                  <Route path="/agenda" element={<AgendaPage />} />
                </Route>
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
