import axios from "axios";
import React, { useState, useContext, useEffect } from "react";

const table = {
  sports: 21,
  history: 23,
  politics: 24,
};

const API_ENDPOINT = "https://opentdb.com/api.php?";

const url = "";
const tempURL =
  "https://opentdb.com/api.php?amount=10&category=21&difficulty=easy&type=multiple";

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [waiting, setWaiting] = useState(true);
  const [loading, setLaoding] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [error, setError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quiz, setQuiz] = useState({
    amount: 10,
    category: "sports",
    difficulty: "easy",
  });

  const fetchQuestions = async (url) => {
    setLaoding(true);
    setWaiting(false);
    const response = await axios(url).catch((err) => console.log(err));
    // console.log(response);
    if (response) {
      const data = response.data.results;
      if (data.length > 0) {
        setQuestions(data);
        setWaiting(false);
        setLaoding(false);
        setError(false);
      } else {
        setWaiting(true);
        setError(true);
      }
    } else {
      setWaiting(true);
    }
  };

  const handleChange = (e) => {
    console.log(e);
    const name = e.target.name;
    const value = e.target.value;
    console.log(name, value);
    setQuiz({ ...quiz, [name]: value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const { amount, category, difficulty } = quiz;

    // const tempURL =
    //   "https://opentdb.com/api.php?amount=10&category=21&difficulty=easy&type=multiple";

    const url = `${API_ENDPOINT}amount=${amount}&category=${table[category]}&difficulty=${difficulty}&type=multiple`;
    fetchQuestions(url);
  };

  const nextQuestion = () => {
    if (index === questions.length - 1) {
      openModal();
      setIndex(0);
    } else {
      // setIndex(index + 1);
      setIndex((oldIndex) => oldIndex + 1);
      console.log(index);
    }
  };
  const checkAnswer = (value) => {
    if (value) {
      setCorrect(correct + 1);
    }
    nextQuestion();
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setWaiting(true);
    setCorrect(0);
    setIsModalOpen(false);
    console.log("setup");
  };

  // useEffect(() => {
  //   fetchQuestions(tempURL);
  // }, [index]);

  return (
    <AppContext.Provider
      value={{
        waiting,
        loading,
        questions,
        index,
        openModal,
        closeModal,
        correct,
        error,
        isModalOpen,
        nextQuestion,
        checkAnswer,
        quiz,
        handleChange,
        handleSubmit,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
// make sure use
export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider };
