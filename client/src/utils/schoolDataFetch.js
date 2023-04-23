import schoolData from '../assets/school-data.json'

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
            if (state && county) {
                return (school.state.toUpperCase() === state.toUpperCase() && school.county === county)
            } else if (city) {
                return (school.city === city)
            } else if (county) {
                return (school.county === county)
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
                return school.county === county
            } else {
                return school.state.toUpperCase() === state.toUpperCase() && school.county === county
            }
        })
        .map((school) => school.city)
        .sort();

    return [...new Set(cities)]
}

const narrowSchools = ({state, county, city, district}) => {
    const schools = schoolData
        .filter((school) => {
            if (state && city) {
                return (school.state.toUpperCase() === state.toUpperCase() && school.city === city)
            } else if (state) {
                return (school.state.toUpperCase() === state.toUpperCase())
            } else if (county) {
                return (school.county === county)
            } else if (city) {
                return (school.city === city)
            } else if (district) {
                return (school.district === district)
            } else {
                return school
            }
        })
        .map((school) => school.name)
        .sort();

    return [...new Set(schools)]
}

const getDistrictCounty = (state, city, schoolName) => {
    const {district, county} = schoolData
        .find((school) => school.state.toUpperCase() === state.toUpperCase() && school.city === city && school.name === schoolName)

    return { foundDistrict: district, foundCounty: county}
}

const getSchoolDataValue = (value) => {
    return [...new Set(schoolData.map((school) => school[value]).sort())]
}


export { narrowCounties, narrowCities, narrowDistricts, narrowSchools, getDistrictCounty, getSchoolDataValue }
