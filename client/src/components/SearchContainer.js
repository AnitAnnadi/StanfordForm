import { FormRow, FormRowSelect } from '.';
import { useAppContext } from '../context/appContext';
import Wrapper from '../assets/wrappers/SearchContainer';
import { useState, useMemo } from 'react';
import {narrowCities, narrowCounties, narrowDistricts, narrowSchools} from "../utils/schoolDataFetch";
import {Link} from "react-router-dom";
const SearchContainer = ({startReload}) => {
  const {
    user,
    isLoading,
    searchState,
    searchCounty,
    searchDistrict,
    searchCity,
    searchSchool,
    searchGrade,
    searchPeriod,
    searchType,
    searchTeacher,
    searchBeforeAfter,
    stateOptions,
    countyOptions,
    districtOptions,
    cityOptions,
    schoolOptions,
    periodOptions,
    gradeOptions,
    teacherOptions,
    typeOptions,
    beforeAfterOptions,
    handleChanges,
    clearFilters,
    getResponseGroups,
    userLocations,
  } = useAppContext();

  const narrowAllowedOptions = (searchType, searchValues) => {
    if (user.role === "Teacher") {
      const allowedValues = userLocations.map(location => location[searchType]);
      return searchValues.filter(value => allowedValues.includes(value));
    } else if (user.role === "Standford Staff") {
      return searchValues;
    } else {
      if (userLocations[0][searchType] === null) {
        return searchValues;
      } else {
        return searchValues.filter(value => value === userLocations[0][searchType]);
      }
    }
  }

  const handleChange = (e) => {
    switch (e.target.name) {
      case 'searchState':
        console.log("searchState");
        handleChanges({
          [e.target.name]: e.target.value,
          // searchCounty: 'all',
          // searchCity: 'all',
          // searchDistrict: 'all',
          // searchSchool: 'all',
          // searchTeacher: 'all',
          // countyOptions: ['all', ...narrowAllowedOptions("county", narrowCounties({state: e.target.value}))],
          // cityOptions: ['all', ...narrowAllowedOptions("city", narrowCities({state: e.target.value}))],
          // schoolOptions: ['all', ...narrowAllowedOptions("school", narrowSchools({state: e.target.value}))],
          // districtOptions: ['all', ...narrowAllowedOptions("district", narrowDistricts({state: e.target.value}))],
        });
        break;
      case 'searchCounty':
        handleChanges({
          [e.target.name]: e.target.value,
          // searchCity: 'all',
          // searchDistrict: 'all',
          // searchSchool: 'all',
          // searchTeacher: 'all',
          // cityOptions: ['all', ...narrowAllowedOptions("city", narrowCities({county: e.target.value}))],
          // schoolOptions: ['all', ...narrowAllowedOptions("school", narrowSchools({county: e.target.value}))],
          // districtOptions: ['all', ...narrowAllowedOptions("district", narrowDistricts({county: e.target.value}))],
        });
        break;
      case 'searchCity':
        handleChanges({
          [e.target.name]: e.target.value,
          // searchDistrict: 'all',
          // searchSchool: 'all',
          // searchTeacher: 'all',
          // districtOptions: ['all', ...narrowAllowedOptions("district", narrowDistricts({city: e.target.value}))],
          // schoolOptions: ['all', ...narrowAllowedOptions("school", narrowSchools({city: e.target.value}))],
        });
        break;
      case 'searchDistrict':
        handleChanges({
          [e.target.name]: e.target.value,
          // searchSchool: 'all',
          // searchTeacher: 'all',
          // schoolOptions: ['all', ...narrowAllowedOptions("school", narrowSchools({district: e.target.value}))],
        });
        break;
      case 'searchSchool':
        handleChanges({
          // searchTeacher: 'all',
          [e.target.name]: e.target.value,
        });
        break;
      case 'searchTeacher':
        // get the second element of the teacher option array
        if (e.target.value === 'all') {
          handleChanges({
            [e.target.name]: 'all',
          });
          break;
        } else {
          const selectedTeacher = teacherOptions.find(
            (teacher) => teacher[0] === e.target.value
          );
          handleChanges({
            [e.target.name]: selectedTeacher ? selectedTeacher : 'all',
          });
          break;
        }
      default:
        handleChanges({[e.target.name]: e.target.value});
        break;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const timeout = setTimeout(() => {
      startReload();
    }, 1000);

    return () => clearTimeout(timeout);
  };

  const handleClearFilters = (e) => {
    e.preventDefault();

    const timeout = setTimeout(() => {
      clearFilters();
      startReload();
    }, 1000);

    return () => clearTimeout(timeout);
  };

  return (
    <Wrapper>
      <form className='form'>
        <h4>search form</h4>
        <div className='form-center'>
          {/* search by state */}
          <FormRowSelect
            labelText='state'
            name='searchState'
            value={searchState}
            handleChange={handleChange}
            list={stateOptions}
          />
          {/* search by county */}
          <FormRowSelect
            labelText='county'
            name='searchCounty'
            value={searchCounty}
            handleChange={handleChange}
            list={countyOptions}
          />
          {/* search by city */}
          <FormRowSelect
            labelText='city'
            name='searchCity'
            value={searchCity}
            handleChange={handleChange}
            list={cityOptions}
          />
          {/* search by district */}
          <FormRowSelect
            labelText='district'
            name='searchDistrict'
            value={searchDistrict}
            handleChange={handleChange}
            list={districtOptions}
          />
          {/* search by school */}
          <FormRowSelect
            labelText='school'
            name='searchSchool'
            value={searchSchool}
            handleChange={handleChange}
            list={schoolOptions}
          />
          {/* search by teacher */}
          <FormRowSelect
            labelText='teacher'
            name='searchTeacher'
            value={
              user.role === 'Teacher' ? user.name :
                  searchTeacher === 'all' ? 'all' :
                    searchTeacher[0]
            }
            handleChange={handleChange}
            list={
              user.role === 'Teacher' ? [user.name] :
                ['all', ...teacherOptions.map((teacher) => teacher[0])]
            }
          />
          {/* search by grade */}
          <FormRowSelect
            labelText='grade'
            name='searchGrade'
            value={searchGrade}
            handleChange={handleChange}
            list={gradeOptions}
          />
          {/* search by period */}
          <FormRowSelect
            labelText='period'
            name='searchPeriod'
            value={searchPeriod}
            handleChange={handleChange}
            list={periodOptions}
          />
          {/* search by type */}
          <FormRowSelect
            labelText='form type'
            name='searchType'
            value={searchType}
            handleChange={handleChange}
            list={typeOptions}
          />
          {/* search by before/after */}
          <FormRowSelect
            labelText='beforeAfter'
            name='searchBeforeAfter'
            value={searchBeforeAfter}
            handleChange={handleChange}
            list={beforeAfterOptions}
          />
          <button
            className='btn btn-block btn-danger'
            disabled={isLoading}
            onClick={handleSubmit}
          >
            search forms
          </button>
          <button
            className='btn btn-block btn-danger'
            disabled={isLoading}
            onClick={handleClearFilters}
          >
            clear filters
          </button>
          <Link
            className='btn btn-block btn-danger'
            to={`/api/v1/form/`}
            aria-disabled={isLoading}
          >
            Overall Breakdown
          </Link>
        </div>
      </form>
    </Wrapper>
  );
};

export default SearchContainer;
