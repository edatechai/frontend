import {
  useCreateArmMutation,
  useCreateSubjectMutation,
  useCreateYearGroupMutation,
} from "@/features/api/apiSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../ui/button";
import { DialogFooter } from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export const YearGroupFormSchema = z.object({
  yearGroup: z.string().min(2, {
    message: "Year group must be at least 2 characters.",
  }),
});

export const ArmFormSchema = z.object({
  aim: z.string({ required_error: "Required" }),
});

export const SubjectFormSchema = z.object({
  subject: z.string({ required_error: "Required" }),
});

export const CreateArm = ({ userInfo, setShowArmDialog }) => {
  const [createArm, { isLoading }] = useCreateArmMutation();
  const form = useForm<z.infer<typeof ArmFormSchema>>({
    resolver: zodResolver(ArmFormSchema),
  });

  async function onSubmit({ aim }: z.infer<typeof ArmFormSchema>) {
    try {
      const response = await createArm({
        aim,
        accountId: userInfo?.accountId,
      });
      if (response.error) {
        toast.error("Arm creation failed", {
          description: response?.error?.data?.message,
        });
        console.log({ backendError: response.error });
      } else {
        toast(response.data.message);
        form.reset({ aim: "" });
        setShowArmDialog(false);
      }
    } catch (error) {
      toast.error("Arm creation failed", {
        description: "Something went wrong",
      });
      console.log("error", error);
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="aim"
          render={({ field }) => (
            <FormItem>
              <Label>Arm</Label>
              <FormControl>
                <Input placeholder="eg: A" {...field} className="w-2/3" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button disabled={isLoading}>
            {isLoading && (
              <span className="mr-2 animate-spin">
                <Loader />
              </span>
            )}
            Create arm
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export const CreateYearGroup = ({ userInfo, setShowYearGroupDialog }) => {
  const [createYG, { isLoading }] = useCreateYearGroupMutation();
  const form = useForm<z.infer<typeof YearGroupFormSchema>>({
    resolver: zodResolver(YearGroupFormSchema),
  });

  async function onSubmit({ yearGroup }: z.infer<typeof YearGroupFormSchema>) {
    try {
      const response = await createYG({
        yearGroup,
        accountId: userInfo?.accountId,
      });
      if (response.error) {
        toast.error("Year group creation failed", {
          description: response?.error?.data?.message,
        });
        console.log({ backendError: response.error });
      } else {
        toast(response.data.message);
        form.reset({ yearGroup: "" });
        setShowYearGroupDialog(false);
      }
    } catch (error) {
      toast.error("Year group creation failed", {
        description: "Something went wrong",
      });
      console.log("error", error);
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="yearGroup"
          render={({ field }) => (
            <FormItem>
              <Label>Year group</Label>
              <FormControl>
                <Input placeholder="eg: JSS 1" {...field} className="w-2/3" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button disabled={isLoading}>
            {isLoading && (
              <span className="mr-2 animate-spin">
                <Loader />
              </span>
            )}
            Create year group
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export const CreateSubject = ({ userInfo, setShowSubjectDialog }) => {
  const [createSubject, { isLoading }] = useCreateSubjectMutation();
  const form = useForm<z.infer<typeof SubjectFormSchema>>({
    resolver: zodResolver(SubjectFormSchema),
  });

  async function onSubmit({ subject }: z.infer<typeof SubjectFormSchema>) {
    try {
      const response = await createSubject({
        subject,
        accountId: userInfo?.accountId,
      });
      if (response.error) {
        toast.error("Subject creation failed", {
          description: response?.error?.data?.message,
        });
        console.log({ backendError: response.error });
      } else {
        toast(response.data.message);
        form.reset({ subject: "" });
        setShowSubjectDialog(false);
      }
    } catch (error) {
      toast.error("Subject creation failed", {
        description: "Something went wrong",
      });
      console.log("error", error);
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem className="w-2/3">
              <FormLabel>Subject</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Commerce">Commerce</SelectItem>
                  <SelectItem value="Government">Government</SelectItem>
                  <SelectItem value="Economics">Economics</SelectItem>
                  <SelectItem value="Social Science">Social Science</SelectItem>
                  <SelectItem value="Geography">Geography</SelectItem>
                  <SelectItem value="Biology">Biology</SelectItem>
                  <SelectItem value="Chemistry">Chemistry</SelectItem>
                  <SelectItem value="Physics">Physics</SelectItem>
                  <SelectItem value="Further Mathematics">
                    Further Mathematics
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button disabled={isLoading}>
            {isLoading && (
              <span className="mr-2 animate-spin">
                <Loader />
              </span>
            )}
            Create subject
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
