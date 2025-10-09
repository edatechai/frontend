import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUpdatePasswordAfterResetMutation } from "@/features/api/apiSlice";
import { useSearchParams } from "react-router-dom";

export const ResetPasswordForm = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatePasswordAfterReset, { isLoading: isResetPasswordLoading }] = useUpdatePasswordAfterResetMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (!token) {
      alert("Invalid or missing reset token");
      return;
    }

    try {
      const response = await updatePasswordAfterReset({ token, newPassword });
      console.log(response);
      if (response.data) {
        alert(response.data.message)
        // Redirect to login
        // reload the page back to login
        window.location.href = '/';
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