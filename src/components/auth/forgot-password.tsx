import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSendPasswordResetToParentMutation, useForgotPasswordMutation } from "@/features/api/apiSlice";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export const ForgotPasswordForm = () => {
  const [userType, setUserType] = useState('student');
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [sendPasswordResetToParent, { isLoading: isStudentLoading }] = useSendPasswordResetToParentMutation();
  const [forgotPassword, { isLoading: isParentLoading }] = useForgotPasswordMutation();

  const isLoading = isStudentLoading || isParentLoading;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (userType === 'student') {
        const response = await sendPasswordResetToParent({ username });
        if(response.data){
          alert(response.data.message);
          setUsername("");
        } else {
          alert(response.error.data.message);
        }
      } else {
        const response = await forgotPassword({ email });
        if(response.data){
          alert(response.data.message);
          setEmail("");
        } else {
          alert(response.error.data.message);
        }
      }
    } catch (error) {
      console.error("Error sending reset email:", error);
      alert("An error occurred while sending the reset email");
    }
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <RadioGroup defaultValue="student" onValueChange={(value) => setUserType(value)} className="flex space-x-4">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="student" id="student" />
          <Label htmlFor="student">Student</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="parent" id="parent" />
          <Label htmlFor="parent">Parent/Teacher</Label>
        </div>
      </RadioGroup>

      {userType === 'student' ? (
        <div className="grid gap-2">
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
      ) : (
        <div className="grid gap-2">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
      )}

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Sending..." : "Send Reset Link"}
      </Button>
    </form>
  );
};