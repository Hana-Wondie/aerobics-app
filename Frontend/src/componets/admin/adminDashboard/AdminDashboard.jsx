import React from 'react'
import AdminHero from '../AdminHero/AdminHero'
import AdminStats from '../AdminStats/AdminStats'
import AdminSendNotification from '../AdminSendNotification/AdminSendNotification'
import AdminSeeUploads from '../AdminSeeUploads/AdminSeeUploads'

function AdminDashboard() {
  return (
    <>
     <AdminHero/>
     <AdminStats/>
     <AdminSendNotification/>
     <AdminSeeUploads/>
     
    </>
  )
}

export default AdminDashboard
