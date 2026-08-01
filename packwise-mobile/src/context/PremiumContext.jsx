import React, { createContext, useContext, useState, useEffect } from 'react';

const PremiumContext = createContext();

export const PremiumProvider = ({ children }) => {
  const [isPremium, setIsPremium] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Mock packages for demonstration purposes
  const [packages, setPackages] = useState([
    {
      identifier: "monthly_sub",
      product: {
        title: "Voyage Genie Pro (Monthly)",
        description: "Unlimited AI features, offline sync, and smart packing.",
        priceString: "$4.99/mo"
      }
    },
    {
      identifier: "yearly_sub",
      product: {
        title: "Voyage Genie Pro (Yearly)",
        description: "Save 30% with an annual subscription.",
        priceString: "$39.99/yr"
      }
    }
  ]);

  useEffect(() => {
    // Check local storage to see if they "bought" it before
    const status = localStorage.getItem('packwise_is_premium');
    if (status === 'true') {
      setIsPremium(true);
    }
    
    // Simulate network delay for fetching packages
    setTimeout(() => {
      setIsReady(true);
    }, 800);
  }, []);

  const purchasePackage = async (pkg) => {
    return new Promise((resolve) => {
      // Simulate payment processing time
      setTimeout(() => {
        setIsPremium(true);
        localStorage.setItem('packwise_is_premium', 'true');
        resolve(true);
      }, 1500);
    });
  };

  const restorePurchases = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setIsPremium(true);
        localStorage.setItem('packwise_is_premium', 'true');
        resolve(true);
      }, 1000);
    });
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
