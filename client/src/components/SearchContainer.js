import { FormRow, FormRowSelect } from '.';
import { useAppContext } from '../context/appContext';
import Wrapper from '../assets/wrappers/SearchContainer';
import { useState, useMemo } from 'react';
const SearchContainer = () => {
  const [localSearchState, setLocalSearchState] = useState('');
  const [localSearchCounty, setLocalSearchCounty] = useState('');
  const [localSearchDistrict, setLocalSearchDistrict] = useState('');
  const [localSearchCity, setLocalSearchCity] = useState('');
  const [localSearchSchool, setLocalSearchSchool] = useState('');

  const {
    isLoading,
    searchGrade,
    searchPeriod,
    searchType,
    searchBeforeAfter,
    periodOptions,
    gradeOptions,
    typeOptions,
    beforeAfterOptions,
    handleChange,
    clearFilters,
  } = useAppContext();

  const handleSearch = (e) => {
    handleChange({ name: e.target.name, value: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalSearchState('');
    setLocalSearchCounty('');
    setLocalSearchDistrict('');
    setLocalSearchCity('');
    setLocalSearchSchool('');
    clearFilters();
  };
  const debounce = () => {
    let timeoutID;
    return (e) => {
      switch (e.target.name) {
          case 'state':
              setLocalSearchState(e.target.value);
              break;
          case 'county':
              setLocalSearchCounty(e.target.value);
              break;
          case 'district':
              setLocalSearchDistrict(e.target.value);
              break;
          case 'city':
              setLocalSearchCity(e.target.value);
              break;
          case 'school':
              setLocalSearchSchool(e.target.value);
              break;
          default:
              break;
      }
      clearTimeout(timeoutID);
      timeoutID = setTimeout(() => {
        handleChange({ name: e.target.name, value: e.target.value });
      }, 1000);
    };
  };
  const optimizedDebounce = useMemo(() => debounce(), []);
  return (
    <Wrapper>
      <form className='form'>
        <h4>search form</h4>
        <div className='form-center'>
          {/* search by state */}
          <FormRow
            type='text'
            name='searchState'
            value={localSearchState}
            handleChange={optimizedDebounce}
          />
          {/* search by county */}
          <FormRow
            type='text'
            name='searchCounty'
            value={localSearchCounty}
            handleChange={optimizedDebounce}
          />
          {/* search by district */}
          <FormRow
            type='text'
            name='searchDistrict'
            value={localSearchDistrict}
            handleChange={optimizedDebounce}
          />
          {/* search by city */}
          <FormRow
            type='text'
            name='searchCity'
            value={localSearchCity}
            handleChange={optimizedDebounce}
          />
          {/* search by school */}
          <FormRow
            type='text'
            name='searchSchool'
            value={localSearchSchool}
            handleChange={optimizedDebounce}
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
