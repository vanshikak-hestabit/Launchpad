const { Router } = require('express');
const router = Router();

router.get('/', (req, res) => {
  res.send('API is working!');
});

module.exports = router;

//creates API endpoints, counts how many routes exists
