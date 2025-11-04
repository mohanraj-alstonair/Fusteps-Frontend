import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "./hooks/use-auth";
import LandingPage from "./components/landing/LandingPage";
import SignUpPage from "./components/auth/SignUpPage";
import NaukriStyleRegistration from "./components/auth/NaukriStyleRegistration";
import LoginPage from "./components/auth/LoginPage";
import OnboardingFlow from "./components/onboarding/OnboardingFlow";
import StudentDashboard from "./pages/student/StudentDashboard";
import MentorDashboard from "./pages/mentor/MentorDashboard";
import AlumniDashboard from "./pages/alumni/AlumniDashboard";
import EmployerDashboard from "./pages/employer/EmployerDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import NotFound from "@/pages/not-found";
import MessageNotificationContainer from "./components/MessageNotificationContainer";




function AppRouter() {
  const { user, needsOnboarding, loading } = useAuth(); // Destructure loading state
  const [location, setLocation] = useLocation();

  console.log("AppRouter mounted. Current location:", location, "Auth Loading:", loading); // Added for debugging

  useEffect(() => {
    console.log('AppRouter useEffect triggered:', {
      loading,
      user: user ? { email: user.email, role: user.role } : null,
      needsOnboarding,
      location
    });

    if (!loading && user && !needsOnboarding) { // Only run redirect logic if not loading and user is authenticated
      let expectedBasePath;

      if (user.role === "student") {
        expectedBasePath = "/dashboard/student";
      } else {
        expectedBasePath = `/dashboard/${user.role}`;
      }

      const isEntryPage = location === "/" || location === "" || location === "/login" || location === "/signup";
      const isOnCorrectDashboardPath = location.startsWith(expectedBasePath);

      console.log(
        "Routing check - User:", user,
        "Needs Onboarding:", needsOnboarding,
        "Current location:", location,
        "Expected base path:", expectedBasePath,
        "Is entry page:", isEntryPage,
        "Is on correct dashboard path:", isOnCorrectDashboardPath
      );

      if (isEntryPage || !isOnCorrectDashboardPath) {
        console.log("Redirecting to:", expectedBasePath);
        setLocation(expectedBasePath);
      } else {
        console.log("No redirect needed. Current location is valid.");
      }
    } else if (loading) {
      console.log("Auth is loading. Skipping dashboard redirect logic.");
    } else if (!user) {
      console.log("User not authenticated. No dashboard redirect logic applied.");
    } else if (needsOnboarding) {
      console.log("User needs onboarding. No dashboard redirect logic applied.");
    }
  }, [user, needsOnboarding, loading, setLocation, location]); // Add loading to dependencies

  if (loading) {
    console.log("AppRouter: Auth is loading, rendering loading indicator.");
    return <div>Loading authentication...</div>; // Or a more sophisticated loading spinner
  }

  if (!user) {
    console.log("AppRouter: User not authenticated, rendering public routes.");
    return (
      <Switch>
        <Route path="/login" component={LoginPage} />
        <Route path="/signup" component={NaukriStyleRegistration} />
        <Route path="/signup-simple" component={SignUpPage} />
        <Route path="/" component={LandingPage} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  // Disable onboarding flow - users go directly to dashboard
  // if (needsOnboarding) {
  //   console.log("AppRouter: User needs onboarding, rendering onboarding flow.");
  //   return <OnboardingFlow />;
  // }

  console.log("AppRouter: User authenticated and onboarded, rendering dashboard routes.");
  return (
    <Switch>
      {/* ✅ Student flow */}
      <Route path="/dashboard/student/:rest*">
        {(params) => <StudentDashboard />}
      </Route>
      <Route path="/dashboard/student" component={StudentDashboard} />

      {/* ✅ Other roles */}
      <Route path="/dashboard/mentor*" component={MentorDashboard} />

      <Route path="/dashboard/alumni*" component={AlumniDashboard} />

      <Route path="/dashboard/employer*" component={EmployerDashboard} />

      <Route path="/dashboard/admin*" component={AdminDashboard} />

      <Route path="/login" component={LoginPage} />
      <Route path="/signup" component={NaukriStyleRegistration} />
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
          <MessageNotificationContainer />

        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
