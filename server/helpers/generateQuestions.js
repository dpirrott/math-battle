const renderQuestion = (number) => {
  const x = Math.ceil(Math.random() * 11 + 1);
  const y = Math.ceil(Math.random() * 11 + 1);
  const ans = x * y;
  return { question: `(${x} x ${y}) =`, answer: ans, number: number };
};

const generateQuestions = (numberOfQuestions) => {
  const questionsList = [];
  for (let i = 1; i <= numberOfQuestions; i++) {
    questionsList.push(renderQuestion(i));
  }
  return questionsList;
};

module.exports = {
  generateQuestions,
};
