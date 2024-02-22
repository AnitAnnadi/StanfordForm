import { Link } from 'react-router-dom'
import img from '../assets/images/not-found.svg'
import Wrapper from '../assets/wrappers/ErrorPage'
import {useTranslation} from "react-i18next";

const Error = () => {
  const { t, i18n } = useTranslation();

  return (
    <Wrapper className='full-page'>
      <div>
        <img src={img} alt='not found' />
        <h3>
          {t('oh_page_not_found', 'Ohh! page not found')}
        </h3>
        <p>
          {t('we_cant_seem_to_find_the_page', "We can't seem to find the page you're looking for")}
        </p>
        <Link to='/'>{t('back_home', 'back home')}</Link>
      </div>
    </Wrapper>
  )
}

export default Error
