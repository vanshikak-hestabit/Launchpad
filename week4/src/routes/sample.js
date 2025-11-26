const express = require('express');
const router = express.Router();

router.get('/sample', (req, res) => {
  res.json({ message: "Sample route working!" });
});

router.post('/sample', (req, res) => {
  const data = req.body; // <- reads JSON sent by client
  res.json({
    message: "Data received successfully!",
    yourData: data
  });
});


module.exports = router;
