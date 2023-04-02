import React, { useState } from "react";
import SingleQuestion from "./FaqQuestion";
import Wrapper from "../assets/wrappers/FaqQuestions";

const Faq = () => {
  const FaqQuestionData = [
    {
      id: 1,
      title: "Do I use the same class code for all my students?",
      info: "Yes, you use the same class code for all your students whether they are from different periods or schools. The students, on their end, will differentiate which period and school they are apart of.",
    },
    {
      id: 2,
      title: "Which form is my student supposed to fill out?",
      info: "Coloring book forage photo booth gentrify lumbersexual. Migas chillwave poutine synth shoreditch, enamel pin thundercats fashion axe roof party polaroid chartreuse.",
    },
    {
      id: 3,
      title: "Where can I see the breakdown of my students responses?",
      info: "You can see a breakdown of your students responses on the metrics page. Here you can see how many students selected each answer choice for each question. You will also be able to differentiate between the responses for each of the periods you teach, schools you teach at, and the different types of forms your students filled out.",
    },
    {
      id: 4,
      title:
        "How do I edit my state, city, school, and other account information?",
      info: "You can edit all profile information on the profile page.",
    },
    {
      id: 5,
      title: "Are all student responses anonymous?",
      info: "Yes, all student responses are fully anonymous. You will not be able to relate a student response to an actual student in your class. As a teacher, you will only be able to see the number of your students that selected a specific answer choice for each question.",
    },
  ];

  const [faqQuestions, setFaqQuestions] = useState(FaqQuestionData);
  return (
    <Wrapper>
      <div className="faq-container">
        <h3>Frequently Asked Questions</h3>
        <section className="faq-info">
          {faqQuestions.map((faqQuestion) => {
            return (
              <SingleQuestion
                key={faqQuestion.id}
                {...faqQuestion}
              ></SingleQuestion>
            );
          })}
        </section>
      </div>
    </Wrapper>
  );
};

export default Faq;
