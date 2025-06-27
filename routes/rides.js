const express = require('express');
const router = express.Router();
const db = require('../db');
const calculateFare = require('../utils/fareCalculator');

function generateBillNumber() {
  return 'BILL-' + Math.floor(Math.random() * 1000000);
}

// Add ride
router.post('/', async (req, res) => {
  try {
    const {
      customer,
      pickup_location,
      drop_location,
      distance_km,
      distance_source,
      start_km,
      end_km,
      night_charge,
      toll_charge,
      payment_mode,
      driver_name
    } = req.body;

    const fare_total = calculateFare(distance_km, night_charge, toll_charge);
    const bill_number = generateBillNumber();

    const insertQuery = `
      INSERT INTO rides (
        customer_name, email, phone, pickup_location, drop_location,
        driver_name, distance_km, distance_source, start_km, end_km,
        night_charge, toll_charge, fare_total, payment_mode, bill_number
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
      RETURNING id
    `;

    const values = [
      customer.name, customer.email, customer.phone,
      pickup_location, drop_location,
      driver_name, distance_km, distance_source, start_km, end_km,
      night_charge, toll_charge, fare_total, payment_mode, bill_number
    ];

    const result = await db.query(insertQuery, values);

    res.json({ rideId: result.rows[0].id, fare: fare_total, billNumber: bill_number });
  } catch (err) {
    console.error('🔥 Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get rides (optional filters)
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM rides ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('🔥 Error:', err);
    res.status(500).json({ error: 'Failed to fetch rides' });
  }
});

module.exports = router;
