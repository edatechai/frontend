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

const Index = () => {
  const userInfo = useSelector((state) => state.user.userInfo);
  const [updateBio, { isLoading }] = useUpdateBioMutation();
  const [updatePassword, { isLoading: isPasswordUpdating }] = useUpdatePasswordMutation();
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [bio, setBio] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [currentPassword, setCurrentPassword] = useState();

  console.log({ userInfo });

  const handleUpdate = async () => {

    console.log({bio, password, confirmPassword, currentPassword});
    // check if what is in the bio is the same as the userInfo?.bio
    if (bio === undefined && password === undefined && confirmPassword === undefined && currentPassword === undefined) {
      toast.error("there is nothing to update");
      return;
    }
    if (bio === userInfo?.bio) {
      toast.error("No changes made");
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
      const res = await updateBio({ id: userInfo?._id, bio: bio, newPassword: password, oldPassword: currentPassword}).unwrap();
      console.log(res);
      if (res.status === true) {
        toast.success("Bio updated successfully");
      }
    } catch (error) {
      console.error("Error updating pass score:", error);
      toast.error(error as string);
    }
  };

  const handlePasswordUpdate = async (e: FormEvent) => {
    e.preventDefault(); // Prevents the default form submission behavior

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    const payload = {
      oldPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    };

    const res = await updatePassword(payload).unwrap();
    console.log("res", res);
  };

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
              {userInfo?.bio}
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
          {/* add the password  update input form here */}
          <div>
            <h3 className="text-2xl mt-7 text-[#CACED8]">Edit Password</h3>
            <Input
            onChange={(e)=> setCurrentPassword(e.target.value)}
             className="mt-7" type="password" placeholder="Current Password" />
            <Input
            onChange={(e)=> setPassword(e.target.value)}
             className="mt-7" type="password" placeholder="New Password" />
            <Input  
            onChange={(e)=> setConfirmPassword(e.target.value)}
             className="mt-7" type="password" placeholder="Confirm New Password" />
           
          </div>
          

          <Button className="w-full mt-7" onClick={handleUpdate} disabled={isLoading}>
            {isLoading ? "Updating Bio..." : userInfo?.bio ? "Update Bio" : "Submit"}
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
