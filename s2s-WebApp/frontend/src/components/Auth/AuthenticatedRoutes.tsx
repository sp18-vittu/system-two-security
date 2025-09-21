import React, { useEffect } from 'react'
import { usePostHog } from 'posthog-js/react'
import { useSelector } from 'react-redux'
import { useNavigate, Outlet } from 'react-router-dom'
import DashboardLayout from '../../layouts/Dashboard/Dashboard'

export default function AuthenticatedRoutes() {
  const auth = useSelector((state: any) => state.auth)
  const indUserDetails = useSelector((state: any) => state.indUserdetailreducer)
  const { induserDetail } = indUserDetails
  const navigateTo = useNavigate()
  const posthog = usePostHog()

  function redirectToLogin() {
    navigateTo('/')
  }

  useEffect(() => {
    if (!auth || !auth?.isAuthenticated) {
      redirectToLogin()
    }
  }, [auth])

  useEffect(() => {
    if (induserDetail) {
      posthog?.identify(induserDetail.id, { email: induserDetail?.email })
    }
  }, [posthog, induserDetail?.email])

  return (
    <div>
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </div>
  )
}
