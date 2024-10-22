import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateQuizMutation } from "@/features/api/apiSlice";
import { EditQuizSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select } from "@radix-ui/react-select";
import { Loader } from "lucide-react";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const EditQuiz = ({
  question,
  index,
  setEdittedIndexes,
  edittedIndexes,
}: {
  question: {
    _id: string;
    question: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    answer: string;
    // difficultyLevel: string;
  };
  index: number;
  edittedIndexes: string[];
  setEdittedIndexes: Dispatch<SetStateAction<string[]>>;
}) => {
  const [updateQuiz, { isLoading }] = useUpdateQuizMutation();
  const form = useForm<z.infer<typeof EditQuizSchema>>({
    resolver: zodResolver(EditQuizSchema),
    defaultValues: { ...question },
  });

  //   useEffect(() => {
  //     // first;
  //   }, [edittedIndexes]);

  async function onSubmit(body: z.infer<typeof EditQuizSchema>) {
    try {
      const response = await updateQuiz(body);
      console.log({ response });
      if (response.error) {
        toast.error("Quiz update failed", {
          description: response?.error?.data?.message,
        });
      } else {
        setEdittedIndexes((prev) => [...prev, body._id]);
        toast.success("Quiz editted successfully");
      }
    } catch (error) {
      toast.error("Registration failed", {
        description: "Something went wrong",
      });
      console.log("error", error);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={`mt-4 ${
          edittedIndexes.indexOf(question._id) !== -1
            ? "bg-red-700 border-8 border-green-700"
            : ""
        }`}
      >
        <Card className="" key={question._id}>
          <CardHeader>
            <CardTitle>Question {index + 1}</CardTitle>
            <CardDescription>
              Review the questions and answers. Edit if neccessary.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-3 flex-col">
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem className="space-y-0.5">
                  <FormLabel>Question</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid md:grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="optionA"
                render={({ field }) => (
                  <FormItem className="space-y-0.5">
                    <FormLabel>Option A</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="optionB"
                render={({ field }) => (
                  <FormItem className="space-y-0.5">
                    <FormLabel>Option B</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="optionC"
                render={({ field }) => (
                  <FormItem className="space-y-0.5">
                    <FormLabel>Option C</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="optionD"
                render={({ field }) => (
                  <FormItem className="space-y-0.5">
                    <FormLabel>Option D</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="answer"
              render={({ field }) => (
                <FormItem className="space-y-0.5">
                  <FormLabel>Correct answer</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select answer" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="A">A</SelectItem>
                        <SelectItem value="B">B</SelectItem>
                        <SelectItem value="C">C</SelectItem>
                        <SelectItem value="D">D</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isLoading} className="self-end">
              {isLoading && (
                <span className="mr-2 animate-spin">
                  <Loader />
                </span>
              )}
              Submit
            </Button>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};

export default EditQuiz;
