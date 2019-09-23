const { Router } = require('express');
const controller = require('./notes.controller.js');

var router = new Router();

router.get('/', controller.index);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);
router.get('/:id', controller.get);

module.exports = router;