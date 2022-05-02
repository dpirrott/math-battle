const renderQuestion = () => {
  const x = Math.ceil(Math.random() * 11 + 1);
  const y = Math.ceil(Math.random() * 11 + 1);
  const ans = x * y;
  return { question: `${x} x ${y}`, answer: ans };
};

const generateQuestions = (numberOfQuestions) => {
  const questionsList = [];
  for (let i = 0; i < numberOfQuestions; i++) {
    questionsList.push(renderQuestion());
  }
  return questionsList;
};

module.exports = {
  generateQuestions,
};
