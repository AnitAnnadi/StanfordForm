import schoolData from '../assets/school-data.json'

const narrowCounties = (state) => {
    const counties = schoolData
        .filter((school) => school.state === state)
        .map((school) => school.county)
        .sort();

    return [...new Set(counties)]
}

const narrowDistricts = (state, county) => {
    const districts = schoolData
        .filter((school) => school.state === state && school.county === county)
        .map((school) => school.district)
        .sort();

    return [...new Set(districts)]
}

const narrowCities = (state) => {
    const cities = schoolData
        .filter((school) => school.state === state)
        .map((school) => school.city)
        .sort();

    return [...new Set(cities)]
}

const narrowSchools = (state, city) => {
    const schools = schoolData
        .filter((school) => school.state === state && school.city === city)
        .map((school) => school.name)
        .sort();

    return [...new Set(schools)]
}

const getDistrictCounty = (state, city, schoolName) => {
    const {county, district} = schoolData
        .find((school) => school.state === state && school.city === city && school.name === schoolName)

    return { district, county }
}

const getSchoolDataValue = (value) => {
    return [...new Set(schoolData.map((school) => school[value]).sort())]
}


export { narrowCounties, narrowCities, narrowDistricts, narrowSchools, getDistrictCounty, getSchoolDataValue }
