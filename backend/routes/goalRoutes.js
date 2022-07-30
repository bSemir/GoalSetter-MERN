const express = require('express');
const router = express.Router();
const { getGoals, setGoal, updateGoals, deleteGoal } = require('../controllers/goalController');

router.route('/').get(getGoals).post(setGoal);

router.route('/:id').delete(deleteGoal).put(updateGoals);

module.exports = router;