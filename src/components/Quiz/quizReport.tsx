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

const QuizReport = ({ quizResults }) => {
  return (
    <Sheet>
      <SheetTrigger className="whitespace-nowrap rounded bg-white p-2 border">
        View Report
      </SheetTrigger>
      <SheetContent className="sm:w-[540px] overflow-auto">
        <SheetHeader className="overflow-y-scroll  text-left">
          <SheetTitle>Quiz Report</SheetTitle>
          <SheetDescription>
            {quizResults.map((val, index: number) => (
              <Card className="mb-3" key={index}>
                <CardHeader>
                  <CardTitle>Question {index + 1}</CardTitle>
                  <div
                    className="text-sm text-muted-foreground"
                    dangerouslySetInnerHTML={{
                      __html: latexToHTML(val.question),
                    }}
                  ></div>
                </CardHeader>
                <CardContent>
                  {val.isCorrect ? (
                    <p className="text-green-700">
                      You choose the right answer
                    </p>
                  ) : (
                    <p className="text-destructive">
                      You choose a wrong answer
                    </p>
                  )}
                  <p>Correct option: {val.correctOption}</p>
                  <p>Correct answer: {val.correctAnswer}</p>
                  <p className="capitalize">
                    Your answer: {val.selectedAnswer}
                  </p>
                  <p>{val.wrongOption}</p>
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
