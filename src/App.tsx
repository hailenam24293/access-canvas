import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";

// Pages
import CreateRequestPage from "@/pages/requests/CreateRequestPage";
import SignupRequestForm from "@/pages/requests/SignupRequestForm";
import SystemCreationForm from "@/pages/requests/SystemCreationForm";
import SystemPermissionForm from "@/pages/requests/SystemPermissionForm";
import MyRequestsPage from "@/pages/requests/MyRequestsPage";
import RequestDetailPage from "@/pages/requests/RequestDetailPage";
import ApprovalsPage from "@/pages/requests/ApprovalsPage";
import SystemsListPage from "@/pages/systems/SystemsListPage";
import SystemDetailPage from "@/pages/systems/SystemDetailPage";
import RoleBindingsPage from "@/pages/access/RoleBindingsPage";
import AuditLogPage from "@/pages/access/AuditLogPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppLayout>
            <Routes>
              <Route path="/" element={<Navigate to="/requests/my" replace />} />
              
              {/* Requests */}
              <Route path="/requests/create" element={<CreateRequestPage />} />
              <Route path="/requests/create/signup" element={<SignupRequestForm />} />
              <Route path="/requests/create/system-creation" element={<SystemCreationForm />} />
              <Route path="/requests/create/system-permission" element={<SystemPermissionForm />} />
              <Route path="/requests/my" element={<MyRequestsPage />} />
              <Route path="/requests/approvals" element={<ApprovalsPage />} />
              <Route path="/requests/:id" element={<RequestDetailPage />} />
              
              {/* Systems */}
              <Route path="/systems" element={<SystemsListPage />} />
              <Route path="/systems/:ref" element={<SystemDetailPage />} />
              
              {/* Access Control */}
              <Route path="/access/bindings" element={<RoleBindingsPage />} />
              <Route path="/access/audit" element={<AuditLogPage />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
