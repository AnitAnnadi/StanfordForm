import React, { useState, useEffect } from 'react';
import { useAppContext } from "../context/appContext";

const SchoolYearCheckboxes = ({ schoolYears }) => {
  const { handleChange } = useAppContext();

  // Initialize the state based on the schoolYears prop
  const [checkedYears, setCheckedYears] = useState({});

  useEffect(() => {
    const initialCheckedYears = schoolYears.reduce((acc, year) => {
      acc[year] = true;
      return acc;
    }, {});
    setCheckedYears(initialCheckedYears);
    console.log("Default State:", initialCheckedYears);
    handleChange({ name: "checkedYears", value: initialCheckedYears });
}, [schoolYears]); // Dependency array ensures this runs once when schoolYears changes

  const handleCheckboxChange = (event) => {
    const year = event.target.value;
    setCheckedYears(prevState => {
      const updatedState = {
        ...prevState,
        [year]: !prevState[year]
      };

      console.log("Updated State:", updatedState);
      handleChange({ name: "checkedYears", value: updatedState });

      return updatedState;
    });
  };

  return (
    <div>
      {schoolYears.map((year) => (
        <div key={year}>
          <input
            type="checkbox"
            id={year}
            name="schoolYears"
            value={year}
            checked={checkedYears[year] || false}
            onChange={handleCheckboxChange}
          />
          <label htmlFor={year}>{year}</label>
        </div>
      ))}
    </div>
  );
};

export default SchoolYearCheckboxes;
