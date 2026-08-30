import Payment from '../models/Payment.js';
import Order from '../models/Order.js';
import crypto from 'crypto';

// Basic create payment
export const createPayment = async (req, res) => {
  try {
    const payment = new Payment(req.body);
    const savedPayment = await payment.save();

    if (savedPayment.status === 'Completed') {
      await Order.findByIdAndUpdate(savedPayment.orderId, { paymentStatus: 'Completed', isPaid: true, paidAt: Date.now() });
    }

    res.status(201).json({ success: true, data: savedPayment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate('orderId');
    res.status(200).json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- PayU Gateway Methods ---

// Generate Hash before submitting to PayU
export const generatePayUHash = async (req, res) => {
  try {
    const { txnid, amount, productinfo, firstname, email, udf1, udf2, udf3, udf4, udf5 } = req.body;
    
    if (!txnid || !amount || !productinfo || !firstname || !email) {
      return res.status(400).json({ success: false, message: 'Missing required PayU parameters' });
    }

    const key = process.env.PAYU_MERCHANT_KEY;
    const salt = process.env.PAYU_MERCHANT_SALT;

    // Hash format: key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||SALT
    const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|${udf1||''}|${udf2||''}|${udf3||''}|${udf4||''}|${udf5||''}||||||${salt}`;
    
    const hash = crypto.createHash('sha512').update(hashString).digest('hex');

    res.status(200).json({ success: true, hash, key });
  } catch (error) {
    console.error('Error generating PayU hash:', error);
    res.status(500).json({ success: false, message: 'Hash generation failed' });
  }
};

// Success Webhook from PayU
export const payuSuccess = async (req, res) => {
  try {
    const {
      txnid, status, amount, productinfo, firstname, email, hash: incomingHash,
      udf1, udf2, udf3, udf4, udf5, mihpayid, mode, error, error_Message
    } = req.body;

    const key = process.env.PAYU_MERCHANT_KEY;
    const salt = process.env.PAYU_MERCHANT_SALT;

    // Reverse Hash string format: SALT|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key
    const reverseHashString = `${salt}|${status}||||||${udf5||''}|${udf4||''}|${udf3||''}|${udf2||''}|${udf1||''}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;
    const generatedHash = crypto.createHash('sha512').update(reverseHashString).digest('hex');

    const frontendBaseUrl = process.env.PAYU_BASE_FRONTEND_URL || 'http://localhost:4200';

    if (generatedHash === incomingHash) {
      if (status === 'success') {
        // Find order and mark as paid
        // Note: We use txnid as the Order ID
        await Order.findByIdAndUpdate(txnid, {
          paymentStatus: 'Completed',
          isPaid: true,
          paidAt: Date.now(),
          payuTransactionId: mihpayid,
          paymentMode: mode,
          payuResponse: req.body
        });

        // Redirect user to frontend success page
        return res.redirect(`${frontendBaseUrl}/order/success/${txnid}`);
      } else {
        await Order.findByIdAndUpdate(txnid, { 
          paymentStatus: 'Failed',
          payuTransactionId: mihpayid,
          paymentMode: mode,
          paymentError: error_Message || error,
          payuResponse: req.body
        });
        return res.redirect(`${frontendBaseUrl}/order/failed/${txnid}?reason=payment_failed`);
      }
    } else {
      // Hash mismatch - possible tampering!
      console.warn('PayU Reverse Hash Mismatch!', { expected: generatedHash, received: incomingHash, txnid });
      await Order.findByIdAndUpdate(txnid, { 
        paymentStatus: 'Failed',
        paymentError: 'Hash mismatch / Security Error',
        payuResponse: req.body
      });
      return res.redirect(`${frontendBaseUrl}/order/failed/${txnid}?reason=hash_mismatch`);
    }
  } catch (err) {
    console.error('Error in PayU Success webhook:', err);
    res.status(500).send('Internal Server Error');
  }
};

// Failure Webhook from PayU
export const payuFailure = async (req, res) => {
  try {
    const { txnid, error_Message, mihpayid, mode, error } = req.body;
    const frontendBaseUrl = process.env.PAYU_BASE_FRONTEND_URL || 'http://localhost:4200';

    if (txnid) {
      await Order.findByIdAndUpdate(txnid, { 
        paymentStatus: 'Failed',
        payuTransactionId: mihpayid,
        paymentMode: mode,
        paymentError: error_Message || error,
        payuResponse: req.body
      });
    }

    return res.redirect(`${frontendBaseUrl}/order/failed/${txnid || 'unknown'}?reason=${encodeURIComponent(error_Message || 'failed')}`);
  } catch (err) {
    console.error('Error in PayU Failure webhook:', err);
    res.status(500).send('Internal Server Error');
  }
};
