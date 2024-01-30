import styled from "styled-components";

const Wrapper = styled.main`
  .content {
    display: grid;
    place-items: center;
    grid-template-rows: max-content max-content max-content;
    margin-top: 11rem;
  }

  .landing-btns {
    display: grid;
    place-items: center;
    grid-template-columns: max-content max-content max-content;
    column-gap: 0.5rem;
  }
  
  .language-select {
    border-color: transparent;
  }
  .language-select-icon {
    font-size: 1.3rem;
  }
  .language-select-container {
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
