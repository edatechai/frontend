import { useSearchParams } from "react-router-dom";
import { ResetPasswordForm } from "../../components/auth/reset-password";
import Index from "./Index";

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  return token ? <ResetPasswordForm /> : <Index />;
};

export default AuthPage;
