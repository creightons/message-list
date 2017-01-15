var express = require('express'),
	controller = require('../controllers/record');

var router = express.Router();

router.post('/:email', controller.create);
router.put('/suspend/:email', controller.suspend);
router.put('/reactivate/:email', controller.reactivate);
router.delete('/:email', controller.cancel);

module.exports = router;