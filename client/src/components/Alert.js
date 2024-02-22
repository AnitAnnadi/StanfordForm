import { useAppContext } from '../context/appContext'
import {useTranslation} from "react-i18next";

const Alert = () => {
  const { t, i18n } = useTranslation();

  const { alertType, alertText } = useAppContext()
  return <div className={`alert alert-${alertType}`}>{t(alertText, alertText)}</div>
}

export default Alert
