import React, { useState, useEffect } from 'react';
import { useAppContext } from "../context/appContext";

const SchoolYearRadios = ({ schoolYears }) => {
  const { handleChange, selectedYear } = useAppContext();
  const [chosenYear, setChosenYear] = useState(selectedYear);

  useEffect(() => {
    // Synchronize component state with context
    setChosenYear(selectedYear);
  }, [selectedYear]); // Runs when selectedYear in context changes

  useEffect(() => {
    // Initialize the state if schoolYears is updated and selectedYear is not set
    if (schoolYears.length > 0 && !selectedYear) {
      const initialYear = schoolYears[0]; // Default to the first year
      setChosenYear(initialYear);
      handleChange({ name: "selectedYear", value: initialYear });
    }
  }, [schoolYears]); // Runs when schoolYears changes

  const handleRadioChange = (event) => {
    const year = event.target.value;
    setChosenYear(year);
    handleChange({ name: "selectedYear", value: year });
  };

  return (
    <div>
      {schoolYears.map((year) => (
        <div key={year}>
          <input
            type="radio"
            id={year}
            name="schoolYears"
            value={year}
            checked={chosenYear === year}
            onChange={handleRadioChange}
          />
          <label htmlFor={year}>{year}</label>
        </div>
      ))}
      <div>
        <input
          type="radio"
          id="Summer-to-September"
          name="schoolYears"
          value="Summer-to-September"
          checked={chosenYear === "Summer-to-September"}
          onChange={handleRadioChange}
        />
        <label htmlFor="Summer-to-September">Summer to September</label>
      </div>
    </div>
  );
};

export default SchoolYearRadios;
