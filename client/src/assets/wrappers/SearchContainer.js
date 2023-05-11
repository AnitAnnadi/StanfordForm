import styled from "styled-components";

const Wrapper = styled.section`
  .form {
    width: 100%;
    max-width: 100%;
  }
  .form-input,
  .form-select,
  .btn-block {
    height: 35px;
  }
  .form-row {
    margin-bottom: 0;
  }
  .form-center {
    display: grid;
    grid-template-columns: 1fr;
    column-gap: 2rem;
    row-gap: 0.5rem;
  }
  h5 {
    font-weight: 700;
  }
  .btn-block {
    align-self: end;
    margin-top: 1rem;
  }

  .btn-obreak {
    display: grid;
    place-content: center;
    color: var(--white);
    background: var(--grey-500);
  }

  .btn-obreak:hover {
    background-color: var(--grey-900);
  }

  .btn-apply {
    background-color: var(--green-light);
    color: var(--green-dark);
  }

  .btn-apply:hover {
    background-color: var(--green-dark);
    color: var(--white);
  }

  @media (min-width: 768px) {
    .form-center {
      grid-template-columns: 1fr 1fr;
    }
  }
  @media (min-width: 992px) {
    .form-center {
      grid-template-columns: 1fr 1fr 1fr;
    }
    .btn-block {
      margin-top: 0;
    }
  }
`;

export default Wrapper;
