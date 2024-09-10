import { useSelector } from "react-redux";

const Assesment = () => {
  const userInfo = useSelector((state) => state.user.userInfo);

  const learningOutcomes = [
    {
      question: "Solving simple linear equations with one unknown on one side",
      score: "1",
      mark: "1",
    },
    {
      question: "Solving linear equations with unknowns on both sides",
      score: "2",
      mark: "2",
    },
    {
      question:
        "Understanding and setting up linear equations to represent real world problems",
      score: "1",
      mark: "2",
    },
    {
      question: "Solving linear equations with unknown on both sides",
      score: "1",
      mark: "3",
    },
    {
      question: "Setting up and solving linear equations in real-world context",
      score: "2",
      mark: "3",
    },
  ];

  return (
    <div className="mx-3 md:mx-24 my-9">
      <h1 className="text-3xl font-medium text-center mb-12">
        Assesment Feedback
      </h1>
      {/* <div className="flex gap-2">
        <p className="font-semibold">Candidate's Name:</p>
        <p className="capitalize">{userInfo?.fullName}</p>
      </div> */}
      {/* <div className="flex gap-2  mb-12">
        <p className="font-semibold">Overall Mark</p>
        <p>6/10</p>
      </div> */}
      {/* <h5 className="font-semibold">Learning Outcome Performance:</h5> */}
      {/* <div className="space-y-3">
        {learningOutcomes.map((value, index) => {
          const percent = Math.round((+value.score / +value.mark) * 100);
          let color: string;
          if (percent < 40) {
            color = "red";
          } else if (percent > 40 && percent < 70) {
            color = "#ffd605";
          } else {
            color = "green";
          }
          return (
            <div key={index} className="flex items-center justify-between">
              <p>
                {value.question} (Q{index + 1}): {value.score}/{value.mark}
              </p>
              <div className="flex gap-2 w-40 justify-start">
                <div className="h-8 w-20 relative bg-slate-300 rounded-sm">
                  <div
                    className={`absolute left-0 top-0 h-8 rounded-sm`}
                    style={{
                      width: `${percent}%`,
                      backgroundColor: color,
                    }}
                  ></div>
                </div>
                <p>({percent}%)</p>
              </div>
            </div>
          );
        })}
      </div> */}
      <p className="capitalize text-lg">Dear {userInfo?.fullName},</p>
      <h4 className="mt-4 text-lg font-medium">Overall Summary:</h4>
      <p>
        <span className="capitalize font-medium">
          {(userInfo?.fullName?.split(" "))[0]}
        </span>
        , your academic performance is commendable, particularly in Mathematics,
        Science, and English. Your test scores across all subjects average at
        85%, placing you well above the national average. Your performance in
        Mathematics and Science showcases a strong foundation in scientific and
        mathematical concepts, which will serve you well in your aspiration to
        become a Software Engineer. However, there is room for improvement in
        your Chronological Understanding in History and Essay Structure in
        English.
      </p>
      <h5 className="mt-4 text-lg font-medium">Mathematics:</h5>
      <p>
        Your test score of 88% in Mathematics is impressive, and you have
        demonstrated a strong understanding of Fractions, Decimals, and
        Percentages. Your excellent behaviour, attendance, and attitude towards
        learning have contributed to your success. However, your understanding
        of Meaning and Types of Fractions needs improvement. I recommend
        focusing on understanding the concept of fractions as parts of a whole,
        and practicing problems involving equivalent fractions and fractions
        less than 1. I suggest using Khan Academy's Fractions course or the
        "Understanding Fractions" book by Robert Kaplinsky.
      </p>
      <h5 className="mt-4 text-lg font-medium">Science:</h5>
      <p>
        Your Science test score of 92% is outstanding, and you have excelled in
        areas such as Scientific Inquiry and Lab Report Writing. However, your
        Physics Calculations need improvement. I recommend practicing problems
        related to Physics calculations regularly, focusing on understanding the
        concepts behind the calculations. Websites like Physics Classroom and
        Khan Academy's Physics section could be helpful resources.
      </p>
      <h5 className="mt-4 text-lg font-medium">English:</h5>
      <p>
        Your English test score of 85% is impressive, with strong performances
        in Literary Analysis and Creative Writing. However, your Essay Structure
        requires improvement. I suggest focusing on understanding the structure
        of an essay, including an introduction, body, and conclusion. The "How
        to Write a 5-Paragraph Essay" book by Susan M. Becker and the "Write to
        Learn" website could be useful resources.
      </p>
      <h5 className="mt-4 text-lg font-medium">History:</h5>
      <p>
        Your History test score of 78% is satisfactory, with strengths in Source
        Analysis and Historical Debates. However, your Chronological
        Understanding needs improvement. I recommend focusing on understanding
        the sequence of historical events and their causes and effects. The "A
        Brief History of Time" by Stephen Hawking and the "History Channel"
        website could be helpful resources.
      </p>
      <h5 className="mt-4 text-lg font-medium">
        Attendance, Behaviour, and Attitude towards Learning:
      </h5>
      <p>
        Your excellent behaviour and attendance have positively impacted your
        academic performance. However, in some subjects, your attitude towards
        learning could be improved. I recommend setting clear learning goals,
        breaking down tasks into manageable parts, and celebrating your
        achievements to maintain a positive attitude towards learning.
      </p>
      <h5 className="mt-4 text-lg font-medium">
        Recommendations for Future Focus:
      </h5>
      <p>
        With your subject priority ranking and aspiration, I recommend focusing
        on Mathematics, Science, and English, while continually working on
        improving your Chronological Understanding in History and Essay
        Structure in English.
      </p>
      <p className="mt-4">Sincerely,</p>
      <p>Ms Emily Okon</p>
      <p>
        This report was generated by Eddey (EDATECH Limited AI-based educational
        assistant) on behalf of Ms. Emily Okon based on the student's
        performance.
      </p>
      <div className="mt-5 w-full flex justify-end">
        <i>Generated on: 2024-05-09 08:52:30</i>
      </div>
    </div>
  );
};

export default Assesment;
