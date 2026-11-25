const express = require('express');
const router = express.Router();
const plantController = require('../controllers/plantController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', plantController.list);
router.post('/', plantController.create);
router.get('/:id', plantController.getOne);
router.put('/:id', plantController.update);
router.delete('/:id', plantController.remove);
router.get('/:id/readings', plantController.readings);

module.exports = router;
