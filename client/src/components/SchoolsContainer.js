import { useAppContext } from '../context/appContext';
import { useEffect, useRef } from 'react';
import Loading from './Loading';
import ResponseGroup from './ResponseGroup';
import Alert from './Alert';
import Wrapper from '../assets/wrappers/JobsContainer';

const SchoolsContainer = ({ shouldReload, stopReload }) => {
  const {
    getResponseGroups,
    responseGroups,
    isLoading,
    page,
    totalResponseGroups,
    searchState,
    searchCounty,
    searchDistrict,
    searchCity,
    searchSchool,
    searchGrade,
    searchPeriod,
    searchBeforeAfter,
    searchType,
    searchTeacher,
    changePage,
    numOfPages,
    showAlert,
    currentSchoolIndex
  } = useAppContext();

  const endDivRef = useRef(null);
  const currentSchoolIndexRef = useRef(currentSchoolIndex);

  const handleEndDivIntersection = (entries) => {
    const [entry] = entries;
    if (entry.isIntersecting) {
      console.log(currentSchoolIndexRef.current);
      getResponseGroups(currentSchoolIndexRef.current);
    }
  };

  useEffect(() => {
    currentSchoolIndexRef.current = currentSchoolIndex;
  }, [currentSchoolIndex]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };
    const observer = new IntersectionObserver(handleEndDivIntersection, options);

    if (endDivRef.current) {
      observer.observe(endDivRef.current);
    }

    return () => {
      if (endDivRef.current) {
        observer.unobserve(endDivRef.current);
      }
    };
  }, [endDivRef.current]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      getResponseGroups(currentSchoolIndexRef.current);
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    if (shouldReload) {
      const timeout = setTimeout(() => {
        stopReload();
        getResponseGroups(0, shouldReload);
      }, 500);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [shouldReload]);




  if (isLoading &&responseGroups.length === 0 ) {
    return <Loading center />;
  }

  if (responseGroups.length === 0) {
    return (
      <Wrapper>
        <h2>No classes to display...</h2>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      {showAlert && <Alert />}
      <h5>
        {/* {totalResponseGroups} class{responseGroups.length > 1 && 'es'} found */}
      </h5>
      <div className='jobs'>
        {responseGroups.map((ResponseGroupItem, index) => (
          <ResponseGroup key={index} {...ResponseGroupItem} />
        ))}
      </div>
      <div ref={endDivRef} className='end'>
        {currentSchoolIndex}
      </div>
      {isLoading?<Loading center />:null}
    </Wrapper>
  );
};

export default SchoolsContainer;
