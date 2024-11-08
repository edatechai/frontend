import { useState } from "react";
import One from "../../assets/one.png";
import { LoginForm } from "../../components/auth/login";
import { RegisterForm } from "../../components/auth/register";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [show, setShow] = useState(false);


  const toggle = () => setShow(!show);


  return (
   

    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center py-12 min-h-screen">
        {!show ? (
          <div className="mx-auto grid w-[350px] gap-2">
            <div className="grid gap-2">
              <h1 className="text-2xl font-bold">Login</h1>
              <p className="text-muted-foreground">
                Enter your credentials below to login to your account
              </p>
            </div>
            <LoginForm />
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Button variant="link" onClick={toggle} className="px-0">
                Sign up
              </Button>
            </div>
          </div>
        ) : (
          <div className="mx-auto grid w-[350px] gap-2">
            <div className="grid gap-2">
              <h1 className="text-2xl font-bold">Sign Up</h1>
              <p className="text-muted-foreground">
                Enter your information to create an account
              </p>
            </div>
            <RegisterForm toggle={toggle} />
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Button variant="link" onClick={toggle} className="px-0">
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
