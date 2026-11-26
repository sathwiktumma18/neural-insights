import { Component, ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import DashboardLayout from "./components/DashboardLayout";
import DashboardHome from "./pages/DashboardHome";
import RealTimeMonitoring from "./pages/RealTimeMonitoring";
import Forecasting from "./pages/Forecasting";
import DataUpload from "./pages/DataUpload";
import AIAnalysis from "./pages/AIAnalysis";
import Decisions from "./pages/Decisions";
import StrategyEngine from "./pages/StrategyEngine";
import SimulationEngine from "./pages/SimulationEngine";
import KnowledgeGraph from "./pages/KnowledgeGraph";
import Reports from "./pages/Reports";
import Alerts from "./pages/Alerts";
import DomainInsights from "./pages/DomainInsights";
import SettingsPage from "./pages/SettingsPage";
import Profile from "./pages/Profile";
import AIDashboard from "./pages/AIDashboard";
import SalesPrediction from "./pages/SalesPrediction";
import CustomerSegments from "./pages/CustomerSegments";
import MarketingDecisions from "./pages/MarketingDecisions";
import WhatIfSimulator from "./pages/WhatIfSimulator";
import ExplainableAI from "./pages/ExplainableAI";
import AlertsPage from "./pages/AlertsPage";
import ChatbotPage from "./pages/ChatbotPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: any) {
    console.error("React ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center p-8 bg-background text-foreground">
          <div className="max-w-xl text-center">
            <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
            <p className="text-sm text-muted-foreground mb-6">An error occurred while rendering the app. Check the browser console for details.</p>
            <pre className="text-xs bg-muted/60 p-4 rounded-lg overflow-x-auto">{this.state.error.message}</pre>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <div className="fixed top-4 left-4 z-50 rounded-md bg-black/70 px-3 py-1 text-xs text-white">React is mounted</div>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardHome />} />
              <Route path="monitoring" element={<RealTimeMonitoring />} />
              <Route path="forecasting" element={<Forecasting />} />
              <Route path="data" element={<DataUpload />} />
              <Route path="analysis" element={<AIAnalysis />} />
              <Route path="decisions" element={<Decisions />} />
              <Route path="strategy" element={<StrategyEngine />} />
              <Route path="simulation" element={<SimulationEngine />} />
              <Route path="knowledge-graph" element={<KnowledgeGraph />} />
              <Route path="reports" element={<Reports />} />
              <Route path="alerts" element={<Alerts />} />
              <Route path="domain-insights" element={<DomainInsights />} />
              <Route path="ai" element={<AIDashboard />} />
              <Route path="ai/sales-prediction" element={<SalesPrediction />} />
              <Route path="ai/customer-segments" element={<CustomerSegments />} />
              <Route path="ai/marketing-decisions" element={<MarketingDecisions />} />
              <Route path="ai/whatif" element={<WhatIfSimulator />} />
              <Route path="ai/explainable" element={<ExplainableAI />} />
              <Route path="ai/alerts" element={<AlertsPage />} />
              <Route path="ai/chatbot" element={<ChatbotPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="profile" element={<Profile />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
