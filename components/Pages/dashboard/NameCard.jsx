import styles from './index.module.css'
import dayjs from 'dayjs'

const NameCard = ({name, timestamp, status, onClick}) => {
  return (
    <div className={styles.card} onClick={() => onClick(name)}>
      <div className={styles['card-top']}>
        <div className={styles['card-top-name']}>
          {name}
        </div>
        <div className={styles['card-top-time']}>
          {dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss')}
        </div>
      </div>
      <div className={styles['card-bottom']}>
        <span>{status}</span>
        <span>10 天</span>
      </div>
    </div>
  )
}

export default NameCard