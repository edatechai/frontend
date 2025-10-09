import LessonGenerator from "@/components/teacher/lessonGenerator";

const LessonPlan = () => {
  return (
    <div className="h-full flex-1 flex-col space-y-8 p-4 md:p-8 flex">
      <LessonGenerator />
    </div>
  );
};

export default LessonPlan;
