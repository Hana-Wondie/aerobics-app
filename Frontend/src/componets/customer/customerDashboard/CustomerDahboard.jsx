import React from 'react'
import CustomerHero from '../customerHero/CustomerHero'
import CustomerSchedule from '../customerSchedule/CustomerSchedule'
import CustomerAttendance from '../CustomerAttendance/CustomerAttendance'
import CustomerUploadReceipt from '../CustomerUploadReceipt/CustomerUploadReceipt'
import NotificationSection from '../NotificationSection/NotificationSection'

function CustomerDahboard() {
  return (
    <>
    <CustomerHero/>
    <CustomerSchedule/>
    <CustomerAttendance/>
    <CustomerUploadReceipt/>
    <NotificationSection/>
    </>
  )
}

export default CustomerDahboard
