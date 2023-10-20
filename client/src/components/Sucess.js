import Wrapper from "../assets/wrappers/Success";
import YAMTVF from "../assets/images/YAMTVF.png";
import cannabis from "../assets/images/smart-talk-cannabis.png";
import safety from "../assets/images/SafetyFirst-logo-square.png";
import {useTranslation} from "react-i18next";

const Success = () => {
  const { t, i18n } = useTranslation();

  return (
    <Wrapper>
      <div className="success-container">
        <h1>
          {t('thanks_for_filling_form', 'Thanks for filling out our form!')}</h1>
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
