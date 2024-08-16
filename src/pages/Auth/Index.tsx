import React, { useState } from "react";
import { Link } from "react-router-dom";
import One from "../../assets/one.png";
import { useCreateUserMutation } from "../../features/api/apiSlice";
import { LoginForm } from "../../components/auth/login";
import { RegisterForm } from "../../components/auth/register";

const Index = () => {
  const [show, setShow] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState();
  const [license, setLicense] = useState("");
  const [username, setUserName] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [neurodiversity, setNeurodiversity] = useState("");

  const toggle = () => setShow(!show);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const [CreateUser, { isSuccess, isLoading: signuploading, isError }] =
    useCreateUserMutation();

  const handleCreateAccount = async () => {
    const payload = {
      email,
      fullName,
      role,
      license,
      username,
      password,
      neurodiversity,
    };
    // validation
    if (!email) return alert("Email is required");
    if (!password) return alert("Password is required");
    if (!fullName) return alert("Full Name is required");
    if (!role) return alert("Role is required");
    if (!license) return alert("License is required");
    if (!username) return alert("Username is required");

    try {
      const response = await CreateUser(payload);
      if (response.error) {
        alert(response.error.data.message);
      } else {
        alert(response.data.message);
        window.location.href = "/";
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div className="min-w-screen min-h-screen bg-black flex flex-col lg:flex-row justify-between">
      <div className="lg:max-h-screen lg:min-h-screen min-h-screen w-full lg:w-1/2 bg-white flex justify-center items-center p-4 lg:p-8">
        <div className=" w-full max-w-md">
          {!show ? (
            <>
              <div className="text-3xl font-semibold">
                Log in to your Account
              </div>
              <div className="font-semibold py-4">Welcome back!</div>
              <LoginForm />

              <div className="mt-3 text-center">
                <Link onClick={toggle}>Do you have an account? Create one</Link>
              </div>
            </>
          ) : (
            <>
              <div className="text-3xl font-semibold">Create an Account</div>
              <div className="font-medium py-2 mt-5">Full name</div>
              <label className="input input-bordered flex items-center gap-2">
                <input
                  value={fullName}
                  disabled={signuploading}
                  onChange={(e) => setFullName(e.target.value)}
                  type="text"
                  className="w-full"
                  placeholder="Enter your full name"
                />
              </label>

              <div className="font-medium py-2">Username</div>
              <label className="input input-bordered flex items-center gap-2">
                <input
                  value={username}
                  disabled={signuploading}
                  onChange={(e) => setUserName(e.target.value)}
                  type="text"
                  className="w-full"
                  placeholder="Enter your username"
                />
              </label>

              <div className="font-medium py-2">Email Address</div>
              <label className="input input-bordered flex items-center gap-2">
                <input
                  value={email}
                  disabled={signuploading}
                  onChange={(e) => setEmail(e.target.value)}
                  type="text"
                  className="w-full"
                  placeholder="Enter your email"
                />
              </label>

              <div className="font-medium py-2">Role</div>
              {/* <select
                value={role}
                disabled={signuploading}
                onChange={(e) => setRole(e.target.value)}
                className="select select-bordered w-full"
              >
                <option disabled>
                  Are you a student, teacher, or a parent?
                </option>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="parent">Parent</option>
              </select> */}

              <select
                value={role}
                disabled={signuploading}
                onChange={(e) => setRole(e.target.value)}
                className="select select-bordered w-full"
              >
                <option disabled selected>
                  Are you a student, teacher, or a parent?
                </option>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="parent">Parent</option>
              </select>

              {role === "parent" && (
                <>
                  <div className="font-medium py-2">Neurodiversity</div>
                  <select
                    disabled={signuploading}
                    onChange={(e) => setNeurodiversity(e.target.value)}
                    className="select select-bordered w-full"
                  >
                    <option disabled selected>
                      Does your child belong to any of the below
                    </option>
                    <option value="Autism">Autism</option>
                    <option value="ADHD">
                      Attention Deficit Hyperactivity Disorder (ADHD)
                    </option>
                    <option value="Dyscalculia">Dyscalculia</option>
                    <option value="Dyslexia">Dyslexia</option>
                    <option value="Dyspraxia">
                      Dyspraxia, or Developmental Coordination Disorder (DCD)
                    </option>
                  </select>
                </>
              )}

              <div className="font-medium py-2">License Key</div>
              <label className="input input-bordered flex items-center gap-2">
                <input
                  value={license}
                  disabled={signuploading}
                  onChange={(e) => setLicense(e.target.value)}
                  type="text"
                  className="w-full"
                  placeholder="Enter your license key"
                />
              </label>

              <div className="font-medium py-2">Password</div>
              <label className="input input-bordered flex items-center gap-2">
                <input
                  value={password}
                  disabled={signuploading}
                  onChange={(e) => setPassword(e.target.value)}
                  type={passwordVisible ? "text" : "password"}
                  className="w-full"
                  placeholder="Enter your password"
                />
                <svg
                  onClick={togglePasswordVisibility}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-4 h-4 opacity-70 cursor-pointer"
                >
                  {passwordVisible ? (
                    <path
                      fillRule="evenodd"
                      d="M13.593 9.106l1.414 1.414-1.414-1.414Zm.707 5.657a1 1 0 0 0 1.414-1.414L1.415 1.415A1 1 0 0 0 .001 2.828l2.877 2.877A7.985 7.985 0 0 0 0 8c1.5 2.5 4 4 8 4 1.107 0 2.086-.162 2.931-.432l2.875 2.875a1 1 0 0 0 1.414-1.414ZM8 10c-1.657 0-3-1.343-3-3 0-.264.053-.516.13-.758l1.528 1.528c.078.078.166.153.262.224-.224.277-.376.61-.376.996 0 1.104.896 2 2 2 .386 0 .72-.152.996-.376.071.096.146.184.224.262L8.758 9.87c-.242.077-.494.13-.758.13Zm-3.586-6L3 4.414A8.035 8.035 0 0 1 8 2c4 0 6.5 1.5 8 4-.21.35-.48.675-.79.97L8.414 2.414A1 1 0 0 0 6.586 3.586L8.414 5.414A1 1 0 0 0 6.586 4.586L4.414 6.414A1 1 0 0 0 6.414 8.586l2-2Z"
                      clipRule="evenodd"
                    />
                  ) : (
                    <path
                      fillRule="evenodd"
                      d="M8 1a7 7 0 0 1 7 7c-1.5 2.5-4 4-8 4s-6.5-1.5-8-4a7 7 0 0 1 7-7Zm0 12c2.8 0 5-1.1 6-3-1-1.9-3.2-3-6-3s-5 1.1-6 3c1 1.9 3.2 3 6 3Zm0-1c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3Zm0-1a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
                      clipRule="evenodd"
                    />
                  )}
                </svg>
              </label>

              <button
                onClick={handleCreateAccount}
                disabled={signuploading}
                className="btn text-white w-full mt-7 bg-blue-500"
              >
                {signuploading ? "Loading..." : "Create Account"}
              </button>
              <div className="mt-3 text-center">
                <Link onClick={toggle}>Already have an account? Login</Link>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="hidden lg:max-h-screen lg:min-h-screen w-full lg:w-1/2 bg-blue-500 lg:flex justify-center items-center p-8 lg:p-16">
        <div className="text-center">
          <img src={One} alt="One" className="mx-auto w-[35vw]" />
          <h2 className="text-xl font-medium text-white mt-8">
            Leveraging data to improve school children's academic ability
          </h2>
          <h6 className="font-light text-white mt-4">
            Our passion is fuelled by the unwavering belief that personalised
            education is the catalyst for transforming futures
          </h6>
        </div>
      </div>
    </div>

    // <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
    //   <div className="flex items-center justify-center py-12">
    //     {!show ? (
    //       <div className="mx-auto grid w-[350px] gap-6">
    //         <div className="grid gap-2">
    //           <h1 className="text-3xl font-bold text-center">Login</h1>
    //           <p className="text-muted-foreground">
    //             Enter your credentials below to login to your account
    //           </p>
    //         </div>
    //         <LoginForm />
    //         <div className="mt-4 text-center text-sm">
    //           Don&apos;t have an account?{" "}
    //           <Button
    //             variant="link"
    //             onClick={toggle}
    //             className="underline px-0"
    //           >
    //             Sign up
    //           </Button>
    //         </div>
    //       </div>
    //     ) : (
    //       <div className="mx-auto grid w-[350px] gap-6">
    //         <div className="grid gap-2">
    //           <h1 className="text-3xl font-bold text-center">Sign Up</h1>
    //           <p className="text-muted-foreground">
    //             Enter your information to create an account
    //           </p>
    //         </div>
    //         <RegisterForm />
    //         <div className="mt-4 text-center text-sm">
    //           Already have an account?{" "}
    //           <Button
    //             variant="link"
    //             onClick={toggle}
    //             className="underline px-0"
    //           >
    //             Sign in
    //           </Button>
    //         </div>
    //       </div>
    //     )}
    //   </div>
    //   <div className="hidden lg:flex bg-primary p-6 min-h-screen items-center flex-col justify-center">
    //     <img
    //       alt="Image"
    //       src={One}
    //       className="w-[35vw] dark:brightness-[0.2] dark:grayscale"
    //     />
    //     <h2 className="text-xl font-medium text-white mt-8 w-full">
    //       Leveraging data to improve school children's academic ability
    //     </h2>
    //     <h6 className="font-light text-white mt-4">
    //       Our passion is fuelled by the unwavering belief that personalised
    //       education is the catalyst for transforming futures
    //     </h6>
    //   </div>
    // </div>
  );
};

export default Index;
