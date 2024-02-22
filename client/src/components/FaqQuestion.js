import React, { useState } from "react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import {useTranslation} from "react-i18next";

const FaqQuestion = ({ id, title, info }) => {
  const { t, i18n } = useTranslation();
  const [showInfo, setShowInfo] = useState(false);

  return (
    <article className="faq-question">
      <header>
        <h5>{t(`FRQ_title_${id}`, title)}</h5>
        <button className="faq-btn" onClick={() => setShowInfo(!showInfo)}>
          {showInfo ? <AiOutlineMinus /> : <AiOutlinePlus />}
        </button>
      </header>
      {showInfo && <p>{t(`FRQ_info_${id}`, info)}</p>}
    </article>
  );
};

export default FaqQuestion;
