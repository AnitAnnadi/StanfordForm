import { FormRow, FormRowSelect } from '.';
import { useAppContext } from '../context/appContext';
import Wrapper from '../assets/wrappers/SearchContainer';
import { useState, useMemo } from 'react';
import {narrowCities, narrowCounties, narrowDistricts, narrowSchools} from "../utils/schoolDataFetch";
const SearchContainer = () => {
  const {
    isLoading,
    searchState,
    searchCounty,
    searchDistrict,
    searchCity,
    searchSchool,
    searchGrade,
    searchPeriod,
    searchType,
    searchBeforeAfter,
    stateOptions,
    countyOptions,
    districtOptions,
    cityOptions,
    schoolOptions,
    periodOptions,
    gradeOptions,
    typeOptions,
    beforeAfterOptions,
    handleChange,
    handleChanges,
    clearFilters,
  } = useAppContext();

  const handleSearch = (e) => {
    handleChange({ name: e.target.name, value: e.target.value });

    switch (e.target.name) {
      case 'searchState':
        handleChanges({
          [e.target.name]: e.target.value,
          searchCounty: 'all',
          searchCity: 'all',
          searchDistrict: 'all',
          searchSchool: 'all',
          countyOptions: narrowCounties(e.target.value),
          cityOptions: narrowCities(e.target.value),
          schoolOptions: narrowSchools(e.target.value),
          districtOptions: narrowDistricts(e.target.value),
        });
        break;
      case 'searchCounty':
        handleChanges({
          [e.target.name]: e.target.value,
          searchCity: 'all',
          searchDistrict: 'all',
          searchSchool: 'all',
          cityOptions: narrowCities(e.target.value),
          schoolOptions: narrowSchools(e.target.value),
          districtOptions: narrowDistricts(e.target.value),
        });
        break;
      case 'searchCity':
        handleChanges({
          [e.target.name]: e.target.value,
          searchDistrict: 'all',
          searchSchool: 'all',
          districtOptions: narrowDistricts(e.target.value),
          schoolOptions: narrowSchools(e.target.value),
        });
        break;
      case 'searchDistrict':
        handleChanges({
          [e.target.name]: e.target.value,
          searchSchool: 'all',
          schoolOptions: narrowSchools(e.target.value),
        });
        break;
      default:
        handleChanges({[e.target.name]: e.target.value});
        break;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    clearFilters();
  };
  // const debounce = () => {
  //   let timeoutID;
  //   return (e) => {
  //     switch (e.target.name) {
  //         case 'state':
  //             setLocalSearchState(e.target.value);
  //             break;
  //         case 'county':
  //             setLocalSearchCounty(e.target.value);
  //             break;
  //         case 'district':
  //             setLocalSearchDistrict(e.target.value);
  //             break;
  //         case 'city':
  //             setLocalSearchCity(e.target.value);
  //             break;
  //         case 'school':
  //             setLocalSearchSchool(e.target.value);
  //             break;
  //         default:
  //             break;
  //     }
  //     clearTimeout(timeoutID);
  //     timeoutID = setTimeout(() => {
  //       handleChange({ name: e.target.name, value: e.target.value });
  //     }, 1000);
  //   };
  // };
  // const optimizedDebounce = useMemo(() => debounce(), []);
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
            handleChange={handleSearch}
            list={stateOptions}
          />
          {/* search by county */}
          <FormRowSelect
            labelText='county'
            name='searchCounty'
            value={searchCounty}
            handleChange={handleSearch}
            list={countyOptions}
          />
          {/* search by district */}
          <FormRowSelect
            labelText='district'
            name='searchState'
            value={searchDistrict}
            handleChange={handleSearch}
            list={districtOptions}
          />
          {/* search by city */}
          <FormRowSelect
            labelText='city'
            name='searchCity'
            value={searchCity}
            handleChange={handleSearch}
            list={cityOptions}
          />
          {/* search by school */}
          <FormRowSelect
            labelText='school'
            name='searchSchool'
            value={searchSchool}
            handleChange={handleSearch}
            list={schoolOptions}
          />
          {/* search by grade */}
          <FormRowSelect
            labelText='grade'
            name='searchGrade'
            value={searchGrade}
            handleChange={handleSearch}
            list={['all', ...gradeOptions]}
          />
          {/* search by period */}
          <FormRowSelect
            labelText='period'
            name='searchPeriod'
            value={searchPeriod}
            handleChange={handleSearch}
            list={periodOptions}
          />
          {/* search by type */}
          <FormRowSelect
            labelText='type'
            name='searchType'
            value={searchType}
            handleChange={handleSearch}
            list={typeOptions}
          />
          {/* search by before/after */}
          <FormRowSelect
            labelText='beforeAfter'
            name='searchBeforeAfter'
            value={searchBeforeAfter}
            handleChange={handleSearch}
            list={beforeAfterOptions}
          />
          <button
            className='btn btn-block btn-danger'
            disabled={isLoading}
            onClick={handleSubmit}
          >
            clear filters
          </button>
        </div>
      </form>
    </Wrapper>
  );
};

export default SearchContainer;
