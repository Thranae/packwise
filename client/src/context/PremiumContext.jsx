import React, { createContext, useContext, useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { Purchases } from '@revenuecat/purchases-capacitor';

const PremiumContext = createContext();

// TODO: Replace with your actual RevenueCat Public SDK Keys
const REVENUECAT_API_KEY_GOOGLE = "goog_xxxxxx"; 
const REVENUECAT_API_KEY_APPLE = "appl_xxxxxx";
const ENTITLEMENT_ID = "premium";

export const PremiumProvider = ({ children }) => {
  const [isPremium, setIsPremium] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    const initRevenueCat = async () => {
      try {
        if (!Capacitor.isNativePlatform()) {
          // Mock web behavior for now until purchases-js is implemented
          console.log('RevenueCat native plugin skipped on web/PWA.');
          setIsReady(true);
          return;
        }

        if (Capacitor.getPlatform() === 'android') {
          await Purchases.configure({ apiKey: REVENUECAT_API_KEY_GOOGLE });
        } else if (Capacitor.getPlatform() === 'ios') {
          await Purchases.configure({ apiKey: REVENUECAT_API_KEY_APPLE });
        }

        const customerInfo = await Purchases.getCustomerInfo();
        checkPremiumStatus(customerInfo);

        // Fetch available offerings (e.g. Monthly, Yearly)
        const offerings = await Purchases.getOfferings();
        if (offerings.current !== null && offerings.current.availablePackages.length !== 0) {
          setPackages(offerings.current.availablePackages);
        }
      } catch (error) {
        console.error("Error initializing RevenueCat:", error);
      } finally {
        setIsReady(true);
      }
    };

    initRevenueCat();
  }, []);

  const checkPremiumStatus = (customerInfo) => {
    if (typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== "undefined") {
      setIsPremium(true);
    } else {
      setIsPremium(false);
    }
  };

  const purchasePackage = async (pkg) => {
    try {
      if (!Capacitor.isNativePlatform()) {
        alert("In-App Purchases are only available on the native Android/iOS app right now.");
        return false;
      }
      
      const { customerInfo } = await Purchases.purchasePackage({ aPackage: pkg });
      checkPremiumStatus(customerInfo);
      return true;
    } catch (error) {
      if (!error.userCancelled) {
        console.error("Purchase error", error);
        alert("There was an error completing your purchase. Please try again.");
      }
      return false;
    }
  };

  const restorePurchases = async () => {
    try {
      if (!Capacitor.isNativePlatform()) return false;
      
      const customerInfo = await Purchases.restorePurchases();
      checkPremiumStatus(customerInfo);
      return true;
    } catch (error) {
      console.error("Restore error", error);
      return false;
    }
  };

  return (
    <PremiumContext.Provider 
      value={{ 
        isPremium, 
        isReady, 
        packages, 
        purchasePackage, 
        restorePurchases 
      }}
    >
      {children}
    </PremiumContext.Provider>
  );
};

export const usePremium = () => {
  return useContext(PremiumContext);
};
