import Popup from "reactjs-popup";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/appContext";
import {useTranslation} from "react-i18next";
import { Trans } from 'react-i18next';

const CreateLocPopup = ({ setDisplay }) => {
  const navigate = useNavigate();
  const { handleChange } = useAppContext();
  const { t, i18n } = useTranslation();

  return (
    <div className="welcome">
      <Popup
        className="welcome"
        disableBackdropClick={true}
        backdrop="static"
        open={true}
        modal
        nested
      >
        <div
          className="modal"
          style={{
            width: "500px",
            maxWidth: "90vw",
            background: "#ffffff",
            padding: "1.5rem 2rem",
          }}
        >
          {/* <h3 className="header"> Warning </h3> */}
          <div className="content">
            {" "}
            {t(`before_custom_loc_1`, 'BEFORE you add your own custom location please:')}
            <ul
              style={{
                listStyle: "inside",
                marginLeft: "1rem",
                marginTop: "0.5rem",
                textTransform: "capitalize",
              }}
            >
              <li>{t(`before_custom_loc_2`, 'Make sure the information you input is correct')}</li>
              <li>{t(`before_custom_loc_3`, 'Write an appropriate and correctly formatted school name')}</li>
              <li>{t(`before_custom_loc_4`, 'Make sure that your location is not already listed (which may have been listed slightly differently)')}</li>
            </ul>
            <strong>{t('UP_return', 'Return')}</strong>{`${t('before_custom_loc_5', ' to existing locations if you are unsure about adding one, or ')} `}
           <strong>{t('UP_continue', 'Continue')}</strong>{` ${t('before_custom_loc_6', 'to add a new location.')}`}
          </div>
          <div className="modal-btn-container" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              className="btn btn-block submit-btn"
              onClick={() => {
                setDisplay(false);
              }}
              style={{ flex: 1, minWidth: '200px', padding: '1rem', fontSize: '1.1rem', cursor: 'pointer' }}
            >
              Return
            </button>
            <button
              className="btn btn-block modal-clear-btn"
              onClick={() => {
                handleChange({ name: "pendingApproval", value: false });
                setTimeout(() => {
                  navigate("/createLoc/us");
                }, 500);
              }}
              style={{ flex: 1, minWidth: '200px', padding: '1rem', fontSize: '1.1rem', cursor: 'pointer' }}
            >
              Create US Location
            </button>
          </div>
          <button
            className="btn btn-block modal-clear-btn"
            style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', cursor: 'pointer' }}
            onClick={() => {
              handleChange({ name: "pendingApproval", value: false });
              setTimeout(() => {
                navigate("/createLoc/foreign");
              }, 500);
            }}
          >
            Create School Located Outside of the US
          </button>
        </div>
        </div>
      </Popup>
    </div>
  );
};
export default CreateLocPopup;
