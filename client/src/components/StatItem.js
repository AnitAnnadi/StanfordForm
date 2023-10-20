import Wrapper from '../assets/wrappers/StatItem'
import {useTranslation} from "react-i18next";

const StatsItem = ({ count, title, icon, color, bcg, id }) => {
  const { t, i18n } = useTranslation();

  return (
    <Wrapper color={color} bcg={bcg}>
      <header>
        <span className='count'>{count}</span>
        <span className='icon'>{icon}</span>
      </header>
      <h5 className='title'>{t(`stats_title_${id}`, title)}</h5>
    </Wrapper>
  )
}

export default StatsItem
