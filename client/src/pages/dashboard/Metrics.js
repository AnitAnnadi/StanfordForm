import { SchoolsContainer, SearchContainer } from '../../components'
import { useState } from 'react'

const Metrics = () => {

  const [reloadSchools, setReloadSchools] = useState(false);

  const startReloadSchools = () => {
    setReloadSchools(true);
  };

  const stopReloadSchools = () => {
    setReloadSchools(false);
  };

  return (
    <>
      <SearchContainer startReload={startReloadSchools}/>
      <SchoolsContainer stopReload={stopReloadSchools} shouldReload={reloadSchools}/>
    </>
  )
}

export default Metrics
