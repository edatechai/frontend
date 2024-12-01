const Verification = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Check Your Email
        </h2>
        
        <div className="mb-6">
          <p className="text-gray-600">
            A verification email has been sent to your email address. Please check your inbox and click the verification link to complete your registration.
          </p>
        </div>

        <div className="text-sm text-gray-500">
          <p>Didn't receive the email? Check your spam folder or</p>
          <button 
            className="text-blue-600 hover:text-blue-800 font-medium mt-2"
            onClick={() => {/* Add resend verification logic */}}
          >
            Click here to resend
          </button>
        </div>
      </div>
    </div>
  )
}

export default Verification