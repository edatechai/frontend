import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useResetPasswordMutation } from "@/features/api/apiSlice";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { PasswordInput } from "@/components/ui/password-input";

export const ResetPasswordForm = ({ token }: { token: string }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetPassword, { isLoading: isResetPasswordLoading }] = useResetPasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await resetPassword({ token, newPassword });
      console.log(response);
      if (response.data) {
        toast.success(response.data.message || "Password has been reset successfully.");
        // Redirect to login
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      }

      if (response.error) {
        const errorData = response.error as any;
        toast.error(errorData?.data?.error || errorData?.data?.message || "Failed to reset password");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }

    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-2">
        <PasswordInput
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
      </div>
      <div className="grid gap-2">
        <PasswordInput
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>
      <Button type="submit" disabled={isResetPasswordLoading}>
        {isResetPasswordLoading && (
          <span className="mr-2 animate-spin text-white">
            <Loader size={16} />
          </span>
        )}
        {isResetPasswordLoading ? "Resetting..." : "Reset Password"}
      </Button>
    </form>
  );
};