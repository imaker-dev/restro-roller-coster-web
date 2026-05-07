import React, { useEffect } from 'react'
import PageHeader from '../../layout/PageHeader'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllSuperAdminSubscriptionPricing } from '../../redux/slices/subscriptionSlice';

const SuperAdminSubcriptionPricingPage = () => {
    const dispatch = useDispatch();
    const {isFetchingSuperAdminSubscriptionPricing,allSuperAdminSubscriptionPricing} = useSelector((state) => state.subscription);
    console.log(allSuperAdminSubscriptionPricing);
    
    useEffect(() => {
        dispatch(fetchAllSuperAdminSubscriptionPricing())
    },[])
  return (
    <div>
      <PageHeader title={'Super Admin Subscriptions'}/>
    </div>
  )
}

export default SuperAdminSubcriptionPricingPage
