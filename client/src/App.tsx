import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "./hooks/use-auth";
import LandingPage from "./components/landing/LandingPage";
import SignUpPage from "./components/auth/SignUpPage";
import LoginPage from "./components/auth/LoginPage";
import OnboardingFlow from "./components/onboarding/OnboardingFlow";
import StudentDashboard from "./pages/student/StudentDashboard";
import MentorDashboard from "./pages/mentor/MentorDashboard";
import AlumniDashboard from "./pages/alumni/AlumniDashboard";
import EmployerDashboard from "./pages/employer/EmployerDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import NotFound from "@/pages/not-found";
import BackendHealth from "@/components/BackendHealth";


function AppRouter() {
  const { user, needsOnboarding } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (user && !needsOnboarding) {
      let expectedPath;

      if (user.role === "student") {
        expectedPath = "/dashboard/student";
 // 🚀 student first goes to resume upload
      } else {
        expectedPath = `/dashboard/${user.role}`; // other roles go to dashboard
      }

      console.log(
        "Routing check - User role:",
        user.role,
        "Current location:",
        location,
        "Expected path:",
        expectedPath
      );

      if (
        location === "/" ||
        location === "" ||
        location === "/login" ||
        location === "/signup" ||
        !location.startsWith(expectedPath)
      ) {
        console.log("Redirecting to:", expectedPath);
        setLocation(expectedPath);
      }
    }
  }, [user, needsOnboarding, setLocation, location]);

  if (!user) {
    return (
      <Switch>
        <Route path="/signup" component={SignUpPage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/" component={LandingPage} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  if (needsOnboarding) {
    return <OnboardingFlow />;
  }

  return (
    <Switch>
      {/* ✅ Student flow */}

      <Route path="/dashboard/student" component={StudentDashboard} />
      <Route path="/dashboard/student/:page" component={StudentDashboard} />

      {/* ✅ Other roles */}
      <Route path="/dashboard/mentor" component={MentorDashboard} />
      <Route path="/dashboard/mentor/:page" component={MentorDashboard} />

      <Route path="/dashboard/alumni" component={AlumniDashboard} />
      <Route path="/dashboard/alumni/:page" component={AlumniDashboard} />

      <Route path="/dashboard/employer" component={EmployerDashboard} />
      <Route path="/dashboard/employer/:page" component={EmployerDashboard} />

      <Route path="/dashboard/admin" component={AdminDashboard} />
      <Route path="/dashboard/admin/:page" component={AdminDashboard} />

      <Route path="/" component={LandingPage} />
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
          <BackendHealth />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
