import {
  EditPasswordForm,
  EditProfileForm,
} from "@/components/Profile/editProfile";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getInitialsFromFullName } from "@/lib/utils";
import { useState, FormEvent } from "react";
import { useSelector } from "react-redux";
import { useUpdateBioMutation, useUpdatePasswordMutation } from "../../features/api/apiSlice";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";

const Index = () => {
  const userInfo = useSelector((state) => state.user.userInfo);
  const [updateBio,] = useUpdateBioMutation();
  const [updatePassword, { isLoading: isPasswordUpdating }] = useUpdatePasswordMutation();
 

  const [bio, setBio] = useState(userInfo?.bio);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isBioLoading, setIsBioLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  console.log({ userInfo });

  const handlePasswordUpdate = async () => {
    console.log({password, confirmPassword, currentPassword});
    // check if what is in the bio is the same as the userInfo?.bio
    if (password === undefined && confirmPassword === undefined && currentPassword === undefined) {
      toast.error("there is nothing to update");
      return;
    }
   
    if (password !== confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }
    if (password?.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return; 
    }
    try {
      setIsLoading(true);
      const payload = {
        id: userInfo?._id,
        newPassword: password,
        oldPassword: currentPassword
      };
     // const res = await updateBio(payload).unwrap();
      const res = await axios.post(`https://server.edatech.io/api/users/updatePassword/${userInfo?._id}`, payload);
      console.log("this is the response", res);
      if (res.status === 200) {
        setIsLoading(false);
        toast.success("Password updated successfully");
        setPassword("");
        setConfirmPassword("");
        setCurrentPassword("");
      }
    } catch (error: any) {
      setIsLoading(false);
      toast.error(error.response.data.message);
    }
  };

  const handleBioUpdate = async () => {
    
    console.log({bio});
    if (bio === userInfo?.bio) {
      toast.error("No changes made");
      return;
    }
    const payload = {
      id: userInfo?._id,
      bio: bio
    }
    try {
      setIsBioLoading(true);
      const res = await axios.post(`https://server.edatech.io/api/users/updatebio/${userInfo?._id}`, payload);
      console.log("this is the response", res);
      if (res.status === 200) {
        toast.success("Bio updated successfully");
        setIsBioLoading(false);
        // wait 3 seconds before reloading the page
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      
      }
    } catch (error: any) {
      setIsBioLoading(false);
      toast.error(error.response.data.message);
    }


    
  }

 

  return (
    <div className="rounded p-7 bg-background">
      <div className="flex items-center gap-10">
        <div className="rounded-full uppercase size-44 text-muted-foreground text-[100px] flex items-center justify-center border-primary/20 border-8">
          {getInitialsFromFullName(userInfo?.fullName)}
        </div>
        <div>
          <p className="font-bold text-2xl">{userInfo?.fullName}</p>
          <p className="text-sm text-[#CACED8]">{userInfo?.role}</p>
        </div>
      </div>

      <Tabs defaultValue="data" className="flex">
        <TabsList className="border-r  flex-none flex mt-9">
          <TabsTrigger value="data">Edit Profile</TabsTrigger>
          {/* <TabsTrigger value="edit">Edit profile</TabsTrigger> */}
          {/* <Button
            variant="outline"
            className="w-full bg-[#E6EFF5] justify-start"
          >
            Bio data
          </Button>
          <Button
            variant="outline"
            disabled
            className="w-full mt-6 justify-start"
          >
            Edit profile
          </Button> */}
        </TabsList>
        <TabsContent value="data" className="font-medium text-sm px-8 mt-9">
          {/* <div className="font-medium text-sm px-8 mt-9"> */}
          <h3 className="text-2xl text-[#CACED8]">Edit Profile</h3>
          {userInfo?.bio && (
            <div className="mt-7 font-light border-primary/10 rounded border-[20px] p-3">
              {bio}
            </div>
          )}
          <p className="mt-7">
            Hello {userInfo?.fullName}, so great to have you here! I'm excited
            to get to know you better. Can you tell me a bit more about
            yourself? what are your passions and dreams? What do you love to do
            in your free time? And what are your goals and aspirations for the
            future? I'm all ears!
          </p>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="textarea textarea-bordered w-full min-h-[200px] mt-7"
            placeholder="your goals and aspirations"
          ></textarea>

          <Button className="w-full mt-7" onClick={handleBioUpdate} disabled={isBioLoading}>
            {isBioLoading ? "Updating Bio..." : "Update Bio"}
          </Button>




          {/* add the password  update input form here */}
          <div>
            <h3 className="text-2xl mt-7 text-[#CACED8]">Edit Password</h3>
            <div className="relative">
              <Input
              value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-7 pr-10"
                type={showPasswords.current ? "text" : "password"}
                placeholder="Current Password"
              />
              <button
                type="button"
                onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                className="absolute right-3 top-1/4 text-gray-500 hover:text-gray-700"
              >
                {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <div className="relative">
              <Input
              value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-7 pr-10"
                type={showPasswords.new ? "text" : "password"}
                placeholder="New Password"
              />
              <button
                type="button"
                onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                className="absolute right-3 top-1/4 text-gray-500 hover:text-gray-700"
              >
                {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <div className="relative">
              <Input
              value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-7 pr-10"
                type={showPasswords.confirm ? "text" : "password"}
                placeholder="Confirm New Password"
              />
              <button
                type="button"
                onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                className="absolute right-3 top-1/4  text-gray-500 hover:text-gray-700"
              >
                {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          

          <Button className="w-full mt-7" onClick={handlePasswordUpdate} disabled={isLoading}>
            {isLoading ? "Updating Password..." : "Update Password"}
          </Button>
        </TabsContent>
      
        {/* <TabsContent
          value="edit"
          className="font-medium text-sm px-8 mt-9 w-full"
        >
         
          <h3 className="text-2xl text-[#CACED8]">Edit Profile</h3>
         
          <h3 className="text-2xl text-[#CACED8] mt-9 mb-4">Edit Password</h3>
          <form 
            onSubmit={handlePasswordUpdate}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium mb-2">Current Password</label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData(prev => ({
                  ...prev,
                  currentPassword: e.target.value
                }))}
                className="input input-bordered w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">New Password</label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData(prev => ({
                  ...prev,
                  newPassword: e.target.value
                }))}
                className="input input-bordered w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Confirm New Password</label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData(prev => ({
                  ...prev,
                  confirmPassword: e.target.value
                }))}
                className="input input-bordered w-full"
                required
              />
            </div>
            <Button 
              type="submit"
              className="w-full"
              disabled={isPasswordUpdating}
            >
              {isPasswordUpdating ? "Updating Password..." : "Update Password"}
            </Button>
          </form>
        </TabsContent> */}
      </Tabs>
    </div>
  );
};

export default Index;
