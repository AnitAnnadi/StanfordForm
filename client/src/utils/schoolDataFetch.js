import schoolData from '../assets/school-data.json'
import {common} from "@mui/material/colors";

const narrowCounties = ({state}) => {
   const counties = schoolData
        .filter((school) => school.state.toUpperCase() === state.toUpperCase())
        .map((school) => school.county)
        .sort();

    return [...new Set(counties)]
}

const narrowStates = ({country}) => {
    const states = schoolData
        .filter((school) => school.country.toUpperCase() === country.toUpperCase())
        .map((school) => school.state)
        .sort();

    return [...new Set(states.map((state) => state.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')))]
}

const narrowDistricts = ({state, county, city}) => {
    const districts = schoolData
        .filter((school) => {
            if (!school?.district) {
              return false
            }

            if (state && county && city) {
                return (school.state.toUpperCase() === state.toUpperCase() && school.county.toUpperCase() === county.toUpperCase() && school.city.toUpperCase() === city.toUpperCase())
            } else if (state && county) {
                return (school.state.toUpperCase() === state.toUpperCase() && school.county.toUpperCase() === county.toUpperCase())
            } else if (city) {
                return (school.city.toUpperCase() === city.toUpperCase())
            } else if (county) {
                return (school.county.toUpperCase() === county.toUpperCase())
            } else if (state) {
                return (school.state.toUpperCase() === state.toUpperCase())
            } else {
                return false
            }
        })
        .map((school) => school.district.toUpperCase())
        .sort();

    return [...new Set(districts)]
}

const narrowCities = ({state, county, country}) => {
    const cities = schoolData
        .filter((school) => {
            if (country && state) {
               return school?.country.toUpperCase() === country.toUpperCase() && school?.state.toUpperCase() === state.toUpperCase()
            } else if (country) {
              return school?.country.toUpperCase() === country.toUpperCase()
            } else if (county === undefined) {
                return school?.state.toUpperCase() === state.toUpperCase()
            } else if (state === undefined) {
                return school?.county.toUpperCase() === county.toUpperCase()
            } else {
                return school?.state.toUpperCase() === state.toUpperCase() && school?.county?.toUpperCase() === county?.toUpperCase()
            }
        })
        .map((school) => school.city.toUpperCase())
        .sort();

    return [...new Set(cities)]
}

const narrowSchools = ({state, county, city, district}) => {
    const schools = schoolData
        .filter((school) => {
          // Seems like there should be a better way to do this but I can't think of it right now
          if (state && county && district) {
              return (school.state.toUpperCase() === state.toUpperCase() && school.county.toUpperCase() === county.toUpperCase() && school.district?.toUpperCase() === district.toUpperCase())
          } else if (state && city) {
              return (school.state.toUpperCase() === state.toUpperCase() && school.city.toUpperCase() === city.toUpperCase())
          } else if (state) {
              return (school.state.toUpperCase() === state.toUpperCase())
          } else if (county) {
              return (school.county.toUpperCase() === county.toUpperCase())
          } else if (city) {
              return (school.city.toUpperCase() === city.toUpperCase())
          } else if (district) {
              return (school.district?.toUpperCase() === district.toUpperCase())
          } else {
              return false
          }
        })
        .map((school) => school.name.toUpperCase())
        .sort();

    return [...new Set(schools)]
}

const getSchoolObject = ({state, county, city, school: schoolName}) => {
    return schoolData
        .find((school) =>
          school.state.toUpperCase() === state.toUpperCase()
          && school.county.toUpperCase() === county.toUpperCase()
          && school.city.toUpperCase() === city.toUpperCase()
          && school.name.toUpperCase() === schoolName.toUpperCase())
}

const getDistrictCounty = (state, city, schoolName) => {
    const {district, county} = schoolData
        .find((school) => school.state.toUpperCase() === state.toUpperCase() && school.city.toUpperCase() === city.toUpperCase() && school.name.toUpperCase() === schoolName.toUpperCase() && school.district)

    return { foundDistrict: district.toUpperCase(), foundCounty: county.toUpperCase()}
}

const getSchoolDataValue = (value) => {
    return [...new Set(schoolData.map((school) => school[value].toUpperCase()).sort())]
}


export { narrowCounties, narrowStates, narrowCities, narrowDistricts, narrowSchools, getDistrictCounty, getSchoolDataValue, getSchoolObject }
