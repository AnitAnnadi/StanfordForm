import schoolData from '../assets/school-data.json'
import {common} from "@mui/material/colors";

const narrowCounties = ({state}) => {
    const counties = schoolData
        .filter((school) => school.state.toUpperCase() === state.toUpperCase())
        .map((school) => school.county)
        .sort();

    return [...new Set(counties)]
}

const narrowDistricts = ({state, county, city}) => {
    const districts = schoolData
        .filter((school) => {
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
                return school
            }
        })
        .map((school) => school.district)
        .sort();

    return [...new Set(districts)]
}

const narrowCities = ({state, county}) => {
    const cities = schoolData
        .filter((school) => {
            if (county === undefined) {
                return school.state.toUpperCase() === state.toUpperCase()
            } else if (state === undefined) {
                return school.county.toUpperCase() === county.toUpperCase()
            } else {
                return school.state.toUpperCase() === state.toUpperCase() && school.county.toUpperCase() === county.toUpperCase()
            }
        })
        .map((school) => school.city)
        .sort();

    return [...new Set(cities)]
}

const narrowSchools = ({state, county, city, district}) => {
    const schools = schoolData
        .filter((school) => {
          // Seems like there should be a better way to do this but I can't think of it right now
          if (state && county && district) {
              return (school.state.toUpperCase() === state.toUpperCase() && school.county.toUpperCase() === county.toUpperCase() && school.district.toUpperCase() === district.toUpperCase())
          } else if (state && city) {
              return (school.state.toUpperCase() === state.toUpperCase() && school.city.toUpperCase() === city.toUpperCase())
          } else if (state) {
              return (school.state.toUpperCase() === state.toUpperCase())
          } else if (county) {
              return (school.county.toUpperCase() === county.toUpperCase())
          } else if (city) {
              return (school.city.toUpperCase() === city.toUpperCase())
          } else if (district) {
              return (school.district.toUpperCase() === district.toUpperCase())
          } else {
              return school
          }
        })
        .map((school) => school.name)
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
        .find((school) => school.state.toUpperCase() === state.toUpperCase() && school.city.toUpperCase() === city.toUpperCase() && school.name.toUpperCase() === schoolName.toUpperCase())

    return { foundDistrict: district, foundCounty: county}
}

const getSchoolDataValue = (value) => {
    return [...new Set(schoolData.map((school) => school[value]).sort())]
}


export { narrowCounties, narrowCities, narrowDistricts, narrowSchools, getDistrictCounty, getSchoolDataValue, getSchoolObject }
