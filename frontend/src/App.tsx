import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Landing from "./pages/Landing";
import Platform from "./pages/Platform";
import Pricing from "./pages/Pricing";
import Docs from "./pages/Docs";
import About from "./pages/About";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import UploadCenter from "./pages/UploadCenter";
import FraudAnalysis from "./pages/FraudAnalysis";
import AgentWorkflow from "./pages/AgentWorkflow";
import DocumentIntelligence from "./pages/DocumentIntelligence";
import Explainability from "./pages/Explainability";
import Analytics from "./pages/Analytics";
import AuditLogs from "./pages/AuditLogs";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";

const App = () => {
  return (
    <AppProvider>
      <Router>
        <Routes>
          {/* Public Landing Pages */}
          <Route path="/" element={<Landing />} />
          <Route path="/platform" element={<Platform />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/about" element={<About />} />
          
          {/* Auth Pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Secure Admin/SecOps Dashboard Shell */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/upload" element={<UploadCenter />} />
            <Route path="/analysis" element={<FraudAnalysis />} />
            <Route path="/workflow" element={<AgentWorkflow />} />
            <Route path="/intelligence" element={<DocumentIntelligence />} />
            <Route path="/reports" element={<Explainability />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/audit" element={<AuditLogs />} />
            <Route path="/settings" element={<Settings />} />
            
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
};

export default App;