import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForgotPasswordMutation } from "@/features/api/apiSlice";
import { toast } from "sonner";

export const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPassword] = useForgotPasswordMutation();
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Add your password reset API call here
      // Example: await resetPassword(email);
      const response = await forgotPassword({ email });
      if(response.data){
        toast.success(response.data.message || "Password reset email sent successfully");
        // clear the form
        setEmail("");
      }else{
        const errorData = response.error as any;
        toast.error(errorData?.data?.message || "Failed to send reset email");
      }
      
    } catch (error) {
      console.error("Error sending reset email:", error);
      toast.error("An error occurred while sending the reset email");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid gap-2">
        <Input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Sending..." : "Send Reset Link"}
      </Button>
    </form>
  );
}; 