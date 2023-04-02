import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  max-width: var(--max-width);

  .faq-container {
    width: 90%;
    margin: 5rem auto;
    background: var(--white);
    border-radius: var(--borderRadius);
    padding: 2.5rem 2rem;
    display: grid;
    gap: 1rem 2rem;
  }

  .faq-container h3 {
    line-height: 1.2;
    font-weight: 500;
  }

  .faq-question {
    padding: 1rem 1.5rem;
    border: 0.5px solid var(--grey-200);
    margin-bottom: 1rem;
    border-radius: var(--borderRadius);
    box-shadow: var(--shadow-3);
  }
  .faq-question h4 {
    text-transform: none;
    line-height: 1.5;
  }
  .faq-question p {
    color: var(--clr-grey-300);
    margin-bottom: 0;
    margin-top: 0.5rem;
  }
  .faq-question header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .faq-question header h5 {
    margin-bottom: 0;
  }
  .faq-btn {
    background: transparent;
    border-color: transparent;
    width: 2rem;
    height: 2rem;
    background: var(--primary-600);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    color: var(--white);
    cursor: pointer;
    margin-left: 1rem;
    align-self: center;
    min-width: 2rem;
  }
`;
export default Wrapper;
