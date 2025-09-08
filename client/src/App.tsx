import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "./hooks/use-auth";
import LandingPage from "./components/landing/LandingPage";
import OnboardingFlow from "./components/onboarding/OnboardingFlow";
import StudentDashboard from "./pages/student/StudentDashboard";
import MentorDashboard from "./pages/mentor/MentorDashboard";
import AlumniDashboard from "./pages/alumni/AlumniDashboard";
import EmployerDashboard from "./pages/employer/EmployerDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import NotFound from "@/pages/not-found";

function AppRouter() {
  const { user, needsOnboarding } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (user && !needsOnboarding && (location === "/" || location === "")) {
      setLocation(`/dashboard/${user.role}`);
    }
  }, [user, needsOnboarding, setLocation]); // Removed location from dependencies to prevent infinite loop

  if (!user) {
    return <LandingPage />;
  }

  if (needsOnboarding) {
    return <OnboardingFlow />;
  }

  return (
    <Switch>
      <Route path="/dashboard/student/*" component={StudentDashboard} />
      <Route path="/dashboard/mentor/*" component={MentorDashboard} />
      <Route path="/dashboard/alumni/*" component={AlumniDashboard} />
      <Route path="/dashboard/employer/*" component={EmployerDashboard} />
      <Route path="/dashboard/admin/*" component={AdminDashboard} />
      <Route path="/">
        {() => {
          if (user && !needsOnboarding) {
            setLocation(`/dashboard/${user.role}`);
          }
          return null;
        }}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <AppRouter />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
