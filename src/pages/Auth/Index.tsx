import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import One from "../../assets/one.png";
import { LoginForm } from "../../components/auth/login";
import { RegisterForm } from "../../components/auth/register";
import { Button } from "@/components/ui/button";
import { useVerifyEmailMutation } from "../../features/api/apiSlice";
import { ForgotPasswordForm } from "../../components/auth/forgot-password";
import { ResetPasswordForm } from "../../components/auth/reset-password";
import { toast } from "sonner";

type ShowState = 'login' | 'register' | 'forgot' | 'reset';

const Index = ({ initialView = 'login' }: { initialView?: ShowState }) => {
  const [verifyEmail] = useVerifyEmailMutation();
  const [show, setShow] = useState<ShowState>(initialView);
  const navigate = useNavigate();
  const [resetToken, setResetToken] = useState<string | null>(null);
  const mounted = useRef(true);
  useEffect(() => {
    const handleVerifyEmail = async () => {
      const params = new URLSearchParams(window.location.search);
      const verifyToken = params.get('verifyToken');

      if (verifyToken && mounted.current) {
        try {
          const response = await verifyEmail({ token: verifyToken });
          if (response?.data?.message === 'Email verified successfully.') {
            toast.success('Email verified! You can now log in.');
          } else {
            const errorData = response?.error as any;
            toast.error(errorData?.data?.message || 'Email verification failed.');
          }
        } catch (error) {
          toast.error('An error occurred during email verification.');
          console.error('Error verifying email:', error);
        }
      }
    };

    const checkResetToken = () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');
      if (token) {
        setResetToken(token);
        setShow('reset');
      }
    };

    handleVerifyEmail();
    checkResetToken();

    return () => {
      mounted.current = false;
    };
  }, []);

  const toggleView = (view: ShowState) => setShow(view);

  return (
   

    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center py-12 min-h-screen">
        {show === 'login' && (
          <div className="mx-auto grid w-[350px] gap-2">
            <div className="grid gap-2">
              <h1 className="text-2xl font-bold">Login</h1>
              <p className="text-muted-foreground">
                Enter your credentials below to login to your account
              </p>
            </div>
            <LoginForm />
            <div className="text-center text-sm">
              <div>
                Don&apos;t have an account?{" "}
                <Button variant="link" onClick={() => navigate('/register')} className="px-0">
                  Sign up
                </Button>
              </div>
              <div>
                Forgot your password?{" "}
                <Button variant="link" onClick={() => toggleView('forgot')} className="px-0">
                  Reset password
                </Button>
              </div>
            </div>
          </div>
        )}

        {show === 'register' && (
          <div className="mx-auto grid w-[350px] gap-2">
            <div className="grid gap-2">
              <h1 className="text-2xl font-bold">Sign Up</h1>
              <p className="text-muted-foreground">
                Enter your information to create an account
              </p>
            </div>
            <RegisterForm toggle={() => navigate('/')} />
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Button variant="link" onClick={() => navigate('/')} className="px-0">
                Sign in
              </Button>
            </div>
          </div>
        )}

        {show === 'forgot' && (
          <div className="mx-auto grid w-[350px] gap-2">
            <div className="grid gap-2">
              <h1 className="text-2xl font-bold">Reset Password</h1>
              <p className="text-muted-foreground">
                Enter your email address or user name to receive a password reset link
              </p>
            </div>
            <ForgotPasswordForm />
            <div className="text-center text-sm">
              Remember your password?{" "}
              <Button variant="link" onClick={() => toggleView('login')} className="px-0">
                Sign in
              </Button>
            </div>
          </div>
        )}

        {show === 'reset' && resetToken && (
          <div className="mx-auto grid w-[350px] gap-2">
            <div className="grid gap-2">
              <h1 className="text-2xl font-bold">Reset Password</h1>
              <p className="text-muted-foreground">
                Enter your new password below
              </p>
            </div>
            <ResetPasswordForm token={resetToken} />
            <div className="text-center text-sm">
              Remember your password?{" "}
              <Button variant="link" onClick={() => toggleView('login')} className="px-0">
                Sign in
              </Button>
            </div>
          </div>
        )}
      </div>
      <div className="hidden lg:flex bg-primary p-6 min-h-screen items-center flex-col justify-center fixed w-[50vw] right-0 max-h-screen">
        <img
          alt="Image"
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

export default Index;
