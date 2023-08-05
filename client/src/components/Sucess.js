import Wrapper from "../assets/wrappers/Success";
import YAMTVF from "../assets/images/YAMTVF.png";
import cannabis from "../assets/images/smart-talk-cannabis.png";
import safety from "../assets/images/SafetyFirst-logo-square.png";

const Success = () => {
  return (
    <Wrapper>
      <div className="success-container">
        <h1>Thanks for filling out our form!</h1>
        <div className="success-logo-container">
          <img src={YAMTVF} alt="" />
          <img src={cannabis} alt="" />
          <img src={safety} alt="" />
        </div>
      </div>
    </Wrapper>
  );
};

export default Success;
