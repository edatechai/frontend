import { latexToHTML } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

const QuizReport = ({ quizResults }: { quizResults: any }) => {
  // Helper function to safely convert latex to HTML
  const safeLatexToHTML = (text: string | undefined) => {
    return text ? latexToHTML(text) : '';
  };

  return (
    <Sheet>
      <SheetTrigger className="whitespace-nowrap rounded bg-white p-2 border">
        View Report
      </SheetTrigger>
      <SheetContent className="sm:w-[540px] overflow-auto">
        <SheetHeader className="overflow-y-scroll text-left">
          <SheetTitle>Quiz Report</SheetTitle>
          <SheetDescription>
            {quizResults?.map((val: any, index: number) => (
              <Card className="mb-3" key={index}>
                <CardHeader>
                  <CardTitle>Question {index + 1}</CardTitle>
                  <div
                    className="text-sm text-muted-foreground"
                    dangerouslySetInnerHTML={{
                      __html: safeLatexToHTML(val?.question),
                    }}
                  ></div>
                </CardHeader>
                <CardContent>
                  {val?.isCorrect ? (
                    <p className="text-green-700 font-medium">
                      You choose the right answer
                    </p>
                  ) : (
                    <span
                      dangerouslySetInnerHTML={{
                        __html: safeLatexToHTML(val?.wrongOption),
                      }}
                    ></span>
                  )}
                  <p>
                    <span className="font-medium">Correct option:</span>{" "}
                    <span
                      dangerouslySetInnerHTML={{
                        __html: safeLatexToHTML(val?.correctOption),
                      }}
                    />
                  </p>
                  <p>
                    <span className="font-medium">Correct answer:</span>{" "}
                    {val?.correctAnswer || ''}
                  </p>
                  <p className="capitalize">
                    <span className="font-medium">Your answer:</span>{" "}
                    <span className="capitalize">{val?.selectedAnswer || ''}</span>
                  </p>
                </CardContent>
              </Card>
            ))}
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default QuizReport;
