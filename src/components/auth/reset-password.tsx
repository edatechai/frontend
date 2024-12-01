import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// Import your reset password mutation hook here
// import { useResetPasswordMutation } from "../../features/api/apiSlice";
import { useResetPasswordMutation } from "@/features/api/apiSlice";
import { useNavigate } from "react-router-dom";

export const ResetPasswordForm = ({ token }: { token: string }) => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetPassword, { isLoading: isResetPasswordLoading }] = useResetPasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await resetPassword({ token, newPassword });
      console.log(response);
      if (response.data) {
        alert(response.data.message)
        // Redirect to login
        // reload the page back to login
        window.location.reload();
      }

      if (response.error) {
       
        alert(response.error.data.error);
        window.location.reload();
        
      }


    } catch (error) {
      console.error("Error resetting password:", error);
      alert("Failed to reset password");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-2">
        <Input
          type="text"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
      </div>
      <div className="grid gap-2">
        <Input
          type="text"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>
      <Button type="submit">Reset Password</Button>
    </form>
  );
}; 