export const questions = [
  "What is 2 + 2?",
  "What is the meaning of mathematics?",
  "What is bla bla bla bla?",
];

export const getColor = (color: number) => {
  if (color <= 10) {
    return "#ff0000";
  } else if (color > 10 && color <= 20) {
    return "#e91600";
  } else if (color > 20 && color <= 30) {
    return "#d22d00";
  } else if (color > 30 && color <= 40) {
    return "#ff8105";
  } else if (color > 40 && color <= 50) {
    return "#ffaf05";
  } else if (color > 50 && color <= 60) {
    return "#ffd605";
  } else if (color > 60 && color <= 70) {
    return "#2bd500";
  } else if (color > 70 && color <= 80) {
    return "#2bd500";
  } else if (color > 80 && color <= 90) {
    return "#1ee100";
  } else if (color > 90 && color <= 100) {
    return "#00ff00";
  }
};

export const studentReport = [
  {
    fullName: "John Doe",
    learning_outcome: "laws of indices",
    student_score: "20",
    score_percent: 20,
    max_score: 100,
  },
  {
    fullName: "Jane Doe",
    learning_outcome: "laws of indices",
    student_score: "20",
    score_percent: 20,
    max_score: 100,
  },
  {
    fullName: "Eze Ola",
    learning_outcome: "laws of indices",
    student_score: "20",
    score_percent: 20,
    max_score: 100,
  },
  {
    fullName: "Vee Desmond",
    learning_outcome: "laws of indices",
    student_score: "34",
    score_percent: 20,
    max_score: 100,
  },
];
