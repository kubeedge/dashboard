import { useState, useEffect } from 'react'
import styles from "@/components/_App/TopNavbar/CurrentDate.module.css"

function CurrentDate() {
  const [currentDate, setCurrentDate] = useState('')

  useEffect(() => {
    const options = { day: '2-digit', month: 'long', year: 'numeric' }
    const formatter = new Intl.DateTimeFormat('zh-CN', options)
    const date = new Date()
    setCurrentDate(formatter.format(date))
  }, [])

  return (
    <>
      <div className={styles.currentDate}>
        <i className="ri-calendar-2-line"></i>
        {currentDate}
      </div>
    </>
  )
}

export default CurrentDate
