import React, { useState } from 'react';
import axios from 'axios';

export const RazorpayCheckoutButton = ({
  amount = 49900, // ₹499 in paise (min 100 paise)
  currency = 'INR',
  name = 'PackWise Pro',
  description = 'PackWise AI Pro Subscription',
  onSuccess,
  onError,
  className = '',
  buttonText = 'Pay with Razorpay',
}) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const getApiUrl = () => {
    return import.meta.env?.VITE_API_URL || '/api';
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && window.Razorpay) {
        return resolve(true);
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      // 1. Ensure script is loaded
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error('Could not load Razorpay SDK. Please check your internet connection.');
      }

      const apiUrl = getApiUrl();

      // 2. STEP 1: Call Backend create-order
      const orderResponse = await axios.post(`${apiUrl}/create-order`, {
        amount,
        currency,
        receipt: `receipt_${Date.now()}`,
      });

      const { order_id, amount: orderAmount, currency: orderCurrency, key_id } = orderResponse.data;

      if (!order_id) {
        throw new Error('Backend failed to return order_id');
      }

      const razorpayKey = key_id || import.meta.env?.VITE_RAZORPAY_KEY_ID || 'rzp_test_U3yA0Th7GB3iXU';

      // 3. STEP 2: Configure and open Razorpay modal
      const options = {
        key: razorpayKey,
        amount: orderAmount,
        currency: orderCurrency || 'INR',
        name,
        description,
        order_id,
        theme: {
          color: '#10B981', // PackWise Emerald accent
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            console.log('Payment modal closed by user');
          },
        },
        handler: async (response) => {
          try {
            setLoading(true);
            // 4. STEP 3: Call Backend verify-payment
            const verifyResponse = await axios.post(`${apiUrl}/verify-payment`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyResponse.data?.success) {
              setLoading(false);
              if (onSuccess) onSuccess(verifyResponse.data);
            } else {
              throw new Error(verifyResponse.data?.error || 'Payment signature verification failed');
            }
          } catch (verifyErr) {
            setLoading(false);
            const msg = verifyErr.response?.data?.error || verifyErr.message || 'Verification error';
            setErrorMsg(msg);
            if (onError) onError(verifyErr);
          }
        },
      };

      const rzpInstance = new window.Razorpay(options);

      rzpInstance.on('payment.failed', (failResponse) => {
        setLoading(false);
        const msg = failResponse.error?.description || 'Payment failed. Please try again.';
        setErrorMsg(msg);
        if (onError) onError(failResponse.error);
      });

      rzpInstance.open();
    } catch (err) {
      setLoading(false);
      const msg = err.response?.data?.error || err.message || 'Payment initiation failed';
      setErrorMsg(msg);
      if (onError) onError(err);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={handlePayment}
        disabled={loading}
        className={
          className ||
          'px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 cursor-pointer'
        }
      >
        {loading ? 'Initializing Checkout...' : buttonText}
      </button>
      {errorMsg && (
        <span className="text-xs text-rose-400 font-semibold text-center">{errorMsg}</span>
      )}
    </div>
  );
};

export default RazorpayCheckoutButton;
