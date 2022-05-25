const upperLimitFromDifficulty = (level) => {
  const convert = {
    1: 11,
    2: 99,
    3: 999,
  };
  return convert[level];
};

const renderQuestion = (number, max) => {
  const x = Math.ceil(Math.random() * max + 1);
  const y = Math.ceil(Math.random() * max + 1);
  const ans = x * y;
  return { question: `(${x} x ${y}) =`, answer: ans, number: number };
};

const generateQuestions = (numberOfQuestions, difficulty) => {
  const questionsList = [];
  const upperLimit = upperLimitFromDifficulty(difficulty);
  for (let i = 1; i <= numberOfQuestions; i++) {
    questionsList.push(renderQuestion(i, upperLimit));
  }
  return questionsList;
};

module.exports = {
  generateQuestions,
};
