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

  .landing-logo {
    position: absolute;
    bottom: 5%;
    right: 5%;
  }
`;
export default Wrapper;
