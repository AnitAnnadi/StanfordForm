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
    position: relative;
    border-top: 5px solid var(--primary-500);
  }
  h3 {
    margin-top: 2rem;
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

  .top-btn {
    position: absolute;
    top: 0;
    right: 5px;
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

  .register-text {
    justify-self: self-end;
  }
`;
export default Wrapper;
