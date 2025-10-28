import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from 'lucide-react';
import { useUpdatePasswordAfterResetMutation } from "@/features/api/apiSlice";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface ResetPasswordFormProps {
  token?: string | null;
  showTitle?: boolean;
}

export const ResetPasswordForm = ({ token: propToken, showTitle = true }: ResetPasswordFormProps) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const urlToken = searchParams.get("token");
  const token = propToken || urlToken;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [updatePasswordAfterReset, { isLoading: isResetPasswordLoading }] = useUpdatePasswordAfterResetMutation();

  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing reset token. Please request a new password reset link.");
    }
  }, [token]);

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/(?=.*\d)/.test(password)) {
      return "Password must contain at least one number";
    }
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setPasswordError("");

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    const validationError = validatePassword(newPassword);
    if (validationError) {
      setPasswordError(validationError);
      return;
    }

    if (!token) {
      toast.error("Invalid or missing reset token");
      return;
    }

    try {
      const response = await updatePasswordAfterReset({ token, newPassword });

      // Helper to extract a message from different shapes
      const extractMessage = (obj: any) => obj?.data?.message ?? obj?.message ?? (typeof obj === 'string' ? obj : undefined);

      // 1) Check response.data.message (some backends may return message even on non-200)
      const dataMessage = extractMessage((response as any).data);
      if (dataMessage && /invalid|expired/i.test(dataMessage)) {
        const finalMsg = dataMessage || 'Password reset token is invalid or has expired';
        toast.error(finalMsg);
        // debug: log the full response shape if token error is detected
        // (helps identify where message is coming from in your environment)
        // eslint-disable-next-line no-console
        console.debug('Password reset - invalid/expired token response (data):', response);
        navigate(`/?show=forgot&resetError=${encodeURIComponent(finalMsg)}`);
        return;
      }

      // 2) Successful response path
      if ((response as any).data) {
        toast.success((response as any).data.message || "Password reset successfully!");
        navigate('/?show=login');
        return;
      }

      // 3) Error path: RTK Query stores errors on response.error
      if ((response as any).error) {
        const err = (response as any).error as any;
  const errorMessage = extractMessage(err) ?? extractMessage(err?.data) ?? extractMessage(err?.error) ?? JSON.stringify(err) ?? "Failed to reset password";
  const finalMsg = errorMessage || 'Password reset token is invalid or has expired';
  toast.error(finalMsg);

        // normalize status from several possible shapes
        const status = typeof err?.status === 'number'
          ? err.status
          : typeof err?.originalStatus === 'number'
            ? err.originalStatus
            : (err?.status && typeof err.status === 'object' && typeof err.status.status === 'number')
              ? err.status.status
              : undefined;

        if (/invalid|expired/i.test(errorMessage) || status === 400 || status === 401) {
          // debug: log the full response shape when redirecting for inspection
          // eslint-disable-next-line no-console
          console.debug('Password reset - invalid/expired token response (error):', response, err);
          navigate(`/?show=forgot&resetError=${encodeURIComponent(finalMsg)}`);
          return;
        }

        setNewPassword("");
        setConfirmPassword("");
        return;
      }

    } catch (error: any) {
      // handle thrown errors (network/other) and try to surface backend messages
      const thrownMsg = error?.data?.message ?? error?.message ?? JSON.stringify(error);
      if (thrownMsg && /invalid|expired/i.test(thrownMsg)) {
        const finalMsg = thrownMsg || 'Password reset token is invalid or has expired';
        toast.error(finalMsg);
        // eslint-disable-next-line no-console
        console.debug('Password reset - thrown invalid/expired token error:', error);
        navigate(`/?show=forgot&resetError=${encodeURIComponent(finalMsg)}`);
        return;
      }

      console.error("Error resetting password:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Invalid Reset Link</h2>
            <p className="mt-2 text-sm text-gray-600">
              The password reset link is invalid or has expired.
            </p>
          </div>
          <Button 
            onClick={() => navigate('/?show=forgot')} 
            className="w-full"
          >
            Request New Reset Link
          </Button>
          <Button 
            type="button"
            variant="outline" 
            onClick={() => navigate('/?show=login')} 
            className="w-full"
          >
            Back to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {showTitle && (
          <div className="text-center">
            <h2 className="mt-2 text-3xl font-extrabold text-gray-900">Reset Your Password</h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter your new password below
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="space-y-3">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <div className="relative mt-2">
                <Input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="Enter your new password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (passwordError) setPasswordError("");
                  }}
                  onCopy={(e) => e.preventDefault()}
                  onCut={(e) => e.preventDefault()}
                  onPaste={(e) => e.preventDefault()}
                  autoComplete="new-password"
                  required
                  minLength={8}
                  className="pr-10"
                />
                <button
                  type="button"
                  aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}
                  onClick={() => setShowNewPassword(s => !s)}
                  className="absolute inset-y-0 right-2 flex items-center px-2 text-gray-500"
                >
                  {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="relative mt-1">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (passwordError) setPasswordError("");
                  }}
                  onCopy={(e) => e.preventDefault()}
                  onCut={(e) => e.preventDefault()}
                  onPaste={(e) => e.preventDefault()}
                  autoComplete="new-password"
                  required
                  minLength={8}
                  className="pr-10"
                />
                <button
                  type="button"
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  onClick={() => setShowConfirmPassword(s => !s)}
                  className="absolute inset-y-0 right-2 flex items-center px-2 text-gray-500"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
            <p className="font-medium mb-2">Password must contain:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>At least 8 characters</li>
              <li>One uppercase letter</li>
              <li>One lowercase letter</li>
              <li>One number</li>
            </ul>
          </div>

          {passwordError && (
            <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-md">
              {passwordError}
            </div>
          )}

          <Button 
            type="submit" 
            disabled={isResetPasswordLoading}
            className="w-full"
            size="lg"
          >
            {isResetPasswordLoading ? "Resetting Password..." : "Reset Password"}
          </Button>

          <div className="text-center">
            <Button 
              type="button"
              variant="outline" 
              onClick={() => navigate('/?show=login')}
              className="w-full"
            >
              Back to Login
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

