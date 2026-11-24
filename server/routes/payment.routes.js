import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const router = express.Router();

function getRazorpayInstance() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return null;
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}

// STEP 1: BACKEND - Create Order
// POST /api/create-order
router.post('/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;

    const parsedAmount = Number(amount);
    if (!parsedAmount || isNaN(parsedAmount) || parsedAmount < 100) {
      return res.status(400).json({
        error: 'Amount is required and must be at least 100 paise (1 INR)',
      });
    }

    const razorpay = getRazorpayInstance();
    if (!razorpay) {
      return res.status(500).json({
        error: 'Razorpay keys not configured on server. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env',
      });
    }

    const options = {
      amount: Math.round(parsedAmount),
      currency: String(currency).toUpperCase(),
      receipt: String(receipt || `rcpt_${Date.now()}`),
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error('Razorpay Create Order Error:', err);
    return res.status(500).json({
      error: err?.error?.description || err?.message || 'Failed to create Razorpay order',
    });
  }
});

// STEP 3: BACKEND - Verify Signature
// POST /api/verify-payment
router.post('/verify-payment', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: razorpay_order_id, razorpay_payment_id, razorpay_signature',
      });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return res.status(500).json({
        success: false,
        error: 'Razorpay secret key not configured on server',
      });
    }

    // Algorithm: HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
    const hmac = crypto.createHmac('sha256', keySecret);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        error: 'Invalid signature. Payment verification failed.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
    });
  } catch (err) {
    console.error('Razorpay Verify Signature Error:', err);
    return res.status(500).json({
      success: false,
      error: err?.message || 'Error verifying payment signature',
    });
  }
});

export default router;

