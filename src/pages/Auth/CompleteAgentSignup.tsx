import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useCompleteAgentSignupMutation } from "../../features/api/apiSlice";
import One from "../../assets/one.png";

const CompleteAgentSignup = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [completeAgentSignup, { isLoading }] = useCompleteAgentSignupMutation();

  useEffect(() => {
    // Check if token exists
    if (!token) {
      toast.error("Invalid or missing invitation link");
      navigate("/login");
    }
  }, [token, navigate]);

  const validatePassword = (pwd: string) => {
    if (pwd.length < 6) {
      return "Password must be at least 6 characters long";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate password
    const passwordError = validatePassword(password);
    if (passwordError) {
      toast.error("Invalid password", {
        description: passwordError,
      });
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      toast.error("Passwords don't match", {
        description: "Please make sure both passwords are the same",
      });
      return;
    }

    const payload = {
      token,
      password,
    };

    try {
      const response = await completeAgentSignup(payload);
      console.log("Agent signup completion response:", response);

      if (response.error) {
        toast.error("Signup completion failed", {
          description: response?.error?.data?.message || "Something went wrong",
        });
      } else {
        toast.success("Account setup completed successfully!", {
          description: "You can now log in with your credentials",
        });
        
        // Redirect to login page after a short delay
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (error) {
      console.error("Error completing agent signup:", error);
      toast.error("Signup completion failed", {
        description: "An unexpected error occurred",
      });
    }
  };

  if (!token) {
    return (
      <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 relative max-w-screen-2xl mx-auto">
        {/* Logo section at top left */}
        <div className="absolute top-4 left-4 z-10">
          <Button variant="link" onClick={() => window.location.href = 'https://edatech.ai'} className="px-0 text-lg">
            Return Home
          </Button>
        </div>
        
        <div className="flex items-center justify-center py-12 min-h-screen">
          <div className="mx-auto grid w-[350px] gap-6">
            <div className="grid gap-2 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold">Invalid Invitation Link</h1>
              <p className="text-muted-foreground">
                The invitation link is invalid or has expired.
              </p>
            </div>
            <button onClick={() => navigate("/")} className="btn btn-primary w-full">
              Go to Login
            </button>
          </div>
        </div>
        
        <div className="hidden lg:flex bg-primary p-6 min-h-screen items-center flex-col justify-center fixed w-[50vw] right-0 max-h-screen">
          <img
            alt="Edatech Platform"
            src={One}
            className="w-[35vw] dark:brightness-[0.2] dark:grayscale"
          />
          <h2 className="text-xl font-medium text-white mt-8 w-full">
            Leveraging data to improve school children's academic ability
          </h2>
          <h6 className="font-light text-white mt-4">
            Our passion is fuelled by the unwavering belief that personalised
            education is the catalyst for transforming futures
          </h6>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 relative max-w-screen-2xl mx-auto">
      {/* Logo section at top left */}
      <div className="absolute top-4 left-4 z-10">
        <Button variant="link" onClick={() => window.location.href = 'https://edatech.ai'} className="px-0 text-lg">
          Return Home
        </Button>
      </div>
      
      <div className="flex items-center justify-center py-12 min-h-screen">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2">
            <h1 className="text-2xl font-bold">Complete Your Agent Setup</h1>
            <p className="text-muted-foreground">
              Welcome to Edatech! Please set your password to complete your account setup.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <label htmlFor="password" className="text-sm font-medium">
                New Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="input input-bordered w-full pr-10"
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Password must be at least 6 characters long
              </p>
            </div>

            <div className="grid gap-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="input input-bordered w-full pr-10"
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {password && confirmPassword && password !== confirmPassword && (
              <div className="alert alert-error">
                <AlertCircle className="h-4 w-4" />
                <span>Passwords don't match</span>
              </div>
            )}

            {password && confirmPassword && password === confirmPassword && password.length >= 6 && (
              <div className="alert alert-success">
                <CheckCircle className="h-4 w-4" />
                <span>Passwords match</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !password || !confirmPassword || password !== confirmPassword}
              className="btn btn-primary w-full"
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Setting up your account...
                </>
              ) : (
                "Complete Setup"
              )}
            </button>
          </form>

          <div className="text-center text-sm">
            <p className="text-muted-foreground">
              By completing your setup, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
      
      <div className="hidden lg:flex bg-primary p-6 min-h-screen items-center flex-col justify-center fixed w-[50vw] right-0 max-h-screen">
        <img
          alt="Edatech Platform"
          src={One}
          className="w-[35vw] dark:brightness-[0.2] dark:grayscale"
        />
        <h2 className="text-xl font-medium text-white mt-8 w-full">
          Leveraging data to improve school children's academic ability
        </h2>
        <h6 className="font-light text-white mt-4">
          Our passion is fuelled by the unwavering belief that personalised
          education is the catalyst for transforming futures
        </h6>
      </div>
    </div>
  );
};

export default CompleteAgentSignup;
