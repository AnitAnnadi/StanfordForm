import Popup from "reactjs-popup";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAppContext} from "../context/appContext";

const SimilarLocPopup = ({setDisplay, submitSimilar}) => {
  const {
    similarLocationNames,
  } = useAppContext();

  const [currentSelectedSchoolName, setCurrentSelectedSchoolName] = useState("");

  return (
    <div className="welcome">
      <Popup className="welcome" disableBackdropClick={true} backdrop="static" open={true} modal nested>
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
            Some locations similar to the one you entered have been found.{" "}
            Please select the location you would like to use or continue to create a new location.
          </div>
          <div className="content">
            <select
              className="form-control"
              onChange={(e) => {
                setCurrentSelectedSchoolName(e.target.value);
              }
              }
            >
              <option value="">Select a location</option>
              {similarLocationNames.map((schoolName) => {
                return (
                  <option key={schoolName} value={schoolName}>
                    {schoolName}
                  </option>
                );
              }
              )}
            </select>
          </div>
          <div className="modal-btn-container">
              <button
                className="btn btn-block submit-btn"
                onClick={() => {
                  setDisplay(false);
                }}
                style={{ margin: "0.5rem 0" }}
              >
                Cancel
              </button>
              <button
                  className="btn btn-block submit-btn"
                  onClick={() => {
                    submitSimilar();
                  }}
                  style={{ margin: "0.5rem 0" }}
              >
                Bypass
              </button>
              <button
                className="btn btn-block modal-clear-btn"
                onClick={() => {
                  submitSimilar(currentSelectedSchoolName)
                }}
              >
                Continue
              </button>
            </div>
        </div>
      </Popup>
    </div>
  );
};
export default SimilarLocPopup;

