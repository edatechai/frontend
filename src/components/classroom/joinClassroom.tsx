import { Loader } from "lucide-react";
import {
  useCreateClassRoomMutation,
  useGetAllArmsByAccountIDQuery,
  useGetAllClassRoomByAccountIdQuery,
  useGetAllSubjectsByAccountIDQuery,
  useGetAllYearGroupsByAccountIDQuery,
  // useGetQuizResultByUserIdQuery,
  useJoinClassMutation,
} from "../../features/api/apiSlice";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { CreateClassroomSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export const JoinClassroom = ({ userInfo }) => {
  const { data } = useGetAllYearGroupsByAccountIDQuery(userInfo?.accountId);
  const { data: arms } = useGetAllArmsByAccountIDQuery(userInfo?.accountId);
  const { data: subjects } = useGetAllSubjectsByAccountIDQuery(
    userInfo?.accountId
  );
  const [createClassroom, { isLoading: creatingClassroom }] =
    useCreateClassRoomMutation();
  const [showJoinClassroomDialog, setShowJoinClassroomDialog] = useState(false);
  const [showCreateClassroomDialog, setShowCreateClassroomDialog] =
    useState(false);
  const { data: classes } = useGetAllClassRoomByAccountIdQuery(
    userInfo?.accountId
  );
  const [joinClass, { isLoading }] = useJoinClassMutation();
  const [classRoom, setClassRoom] = useState();

  const form = useForm<z.infer<typeof CreateClassroomSchema>>({
    resolver: zodResolver(CreateClassroomSchema),
  });

  async function onSubmit(data: z.infer<typeof CreateClassroomSchema>) {
    const payload = {
      accountId: userInfo?.accountId,
      ...data,
    };
    try {
      const response = await createClassroom(payload).unwrap();
      console.log(response);
      if (response.status) {
        toast(response.message);
        setShowCreateClassroomDialog(false);
      } else {
        toast.error("Classroom creation failed", {
          description: response?.message,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Classroom creation failed", {
        description: "Something went wrong",
      });
    }
  }

  const handleSubmit = async () => {
    const filteredClasses = classes?.filter((item) => item._id === classRoom);
    console.log("filtered classes", filteredClasses[0]);
    const payload = {
      classId: filteredClasses[0]._id,
      ...userInfo,
    };
    try {
      const response = await joinClass(payload);
      response;
      console.log(response);
      if (response?.data?.status === false) {
        toast.error("Unable to join classroom", {
          description: response.data.message,
        });
      } else {
        setShowJoinClassroomDialog(false);
        toast(response.data.message);
      }
    } catch (error) {
      toast.error("Unable to join classroom", {
        description: error,
      });
    }
  };

  return (
    <>
      <Dialog
        open={showJoinClassroomDialog}
        onOpenChange={setShowJoinClassroomDialog}
      >
        <DialogTrigger asChild>
          <div className="w-full flex justify-end">
            <Button>Join a class</Button>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create new subject</DialogTitle>
            <DialogDescription>
              Select the name of the classroom you want to join from the
              dropdown and click "Join clasroom". If the classroom you want to
              join is not in the available in the dropdown, click on "Create
              classroom" to create the classroom.
            </DialogDescription>
          </DialogHeader>
          <div className="mb-4">
            <Label htmlFor="joinClassroom">
              <p className="mb-2">Select a classroom</p>
            </Label>
            <div className="flex gap-4 items-center">
              <Select
                onValueChange={(value) => {
                  setClassRoom(value);
                }}
              >
                <SelectTrigger className="">
                  <SelectValue placeholder="Pick one below" />
                </SelectTrigger>
                <SelectContent id="joinClassroom">
                  {classes?.map((i, index) => (
                    <SelectItem value={i._id} key={index}>
                      {i?.classTitle}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button disabled={isLoading} onClick={handleSubmit}>
                {isLoading && (
                  <span className="mr-2 animate-spin">
                    <Loader />
                  </span>
                )}
                Join classroom
              </Button>
            </div>
          </div>
          <div className="flex gap-2 items-center justify-end">
            <p>Classroom not availble?</p>
            <Button
              variant="outline"
              onClick={() => {
                setShowJoinClassroomDialog(false);
                setShowCreateClassroomDialog(true);
              }}
            >
              Create classroom
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showCreateClassroomDialog}
        onOpenChange={setShowCreateClassroomDialog}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create a new classroom</DialogTitle>
            {/* <DialogDescription>
              Select the name of the classroom you want to join from the
              dropdown and click "Join clasroom". If the classroom you want to
              join is not in the available in the dropdown, click on "Create
              classroom" to create the classroom.
            </DialogDescription> */}
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <FormField
                control={form.control}
                name="yearGroup"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year group</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-2/3">
                          <SelectValue placeholder="Select your year group" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {data &&
                          data.map((val) => (
                            <SelectItem
                              key={val.yearGroup}
                              value={val.yearGroup}
                            >
                              {val.yearGroup}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="aim"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Arm</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-2/3">
                          <SelectValue placeholder="Select your arm" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {arms?.aims &&
                          arms?.aims.map((val) => (
                            <SelectItem key={val.aim} value={val.aim}>
                              {val.aim}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-2/3">
                          <SelectValue placeholder="Select the subject" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subjects?.subjects &&
                          subjects?.subjects.map((val) => (
                            <SelectItem key={val.subject} value={val.subject}>
                              {val.subject}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={creatingClassroom}>
                  {isLoading && (
                    <span className="mr-2 animate-spin">
                      <Loader />
                    </span>
                  )}
                  Create classroom
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};
