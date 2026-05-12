import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { handleResponse } from "../utils/helpers";
import { verifyRazorPayPayment } from "../redux/slices/paymentSlice";

const RazorpayComponent = ({
  orderId,
  user,
  onPaymentSuccess,
  onPaymentFailure,
}) => {
  const dispatch = useDispatch();
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  // Dynamically load Razorpay script
  useEffect(() => {
    if (window.Razorpay) {
      setRazorpayLoaded(true); // Razorpay already loaded
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      setRazorpayLoaded(true); // Set Razorpay loaded when the script finishes loading
    };
    script.onerror = (err) => {
      console.error("Failed to load Razorpay script", err);
      if (onPaymentFailure) onPaymentFailure("Failed to load Razorpay");
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script); // Clean up on component unmount
    };
  }, []);

  // Initialize Razorpay Payment
  useEffect(() => {
    if (razorpayLoaded && orderId) {
      initializeRazorpayPayment(orderId);
    }
  }, [razorpayLoaded, orderId]);

  const initializeRazorpayPayment = (orderId) => {
    try {
      // Fetch Razorpay Order ID from your backend if not passed in the component
      const orderData = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        order_id: orderId,
        name: "iMaker Restro",
        description: "Subscription Renewal",
        method: {
          upi: true,
          card: true,
          netbanking: true,
          emi: false,
          wallet: false,
          paylater: false,
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: user?.contact || "",
        },

        handler: async function (response) {
          // Successful payment handler
          const values = {
            outletId: user?.outletId,
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          };
          await handleResponse(
            dispatch(verifyRazorPayPayment({ values })),
            (res) => {
              if (onPaymentSuccess) onPaymentSuccess({ res: res.payload });
            },
          );
        },
        modal: {
          ondismiss: function (reason) {
            if (onPaymentFailure) {
              onPaymentFailure({
                res: {
                  type: "dismissed",
                  message: "Payment popup closed by user",
                },
              });
            }
          },
        },
        theme: {
          color: "#3399cc",
        },
      };

      // Initialize Razorpay with the options
      const rzp1 = new window.Razorpay(orderData);
      rzp1.open();
    } catch (error) {
      console.error("Error initializing Razorpay", error);
      if (onPaymentFailure) onPaymentFailure(error);
    }
  };

  if (!razorpayLoaded) {
    return <div>Loading Razorpay...</div>; // Show loading message while Razorpay script is loading
  }

  return null; // No UI needed, as it's just for handling payment
};

export default RazorpayComponent;
