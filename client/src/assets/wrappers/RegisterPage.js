import styled from "styled-components";

const Wrapper = styled.section`
  display: grid;
  align-items: center;
  .logo {
    display: block;
    margin: 0 auto;
    margin-bottom: 1.38rem;
  }
  .form {
    max-width: 400px;
    border-top: 5px solid var(--primary-500);
  }
  h3 {
    text-align: center;
  }
  p {
    margin: 0;
    margin-top: 1rem;
    text-align: center;
  }
  .btn {
    margin-top: 1rem;
  }
  .member-btn {
    background: transparent;
    border: transparent;
    color: var(--primary-500);
    cursor: pointer;
    letter-spacing: var(--letterSpacing);
  }
  
  .language-select {
    border-color: transparent;
    background: transparent;
  }
  .language-select-icon {
    font-size: 1.3rem;
  }
  .language-select-container {
    align-self: center;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0 0.2rem;
    border: 1px solid black;
    border-radius: 8px;
    padding: 0.2rem;
    width: 150px;
    margin-top: 0.5rem;
  }

`;
export default Wrapper;
