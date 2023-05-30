// imports
const express = require('express');
const router = express.Router();
const validateProblem = require('../util/validation');
const sample_problem = require('../util/sample_problem');

// the problem object
let current_problem = sample_problem;

// GET /api/problem
router.get('/problem', function(req, res, next) {
  // check if problem is set
  if (!current_problem) {
    // redirect to home page
    res.redirect('/');
    return;
  }
  // take a deep copy of the problem object
  let problem = JSON.parse(JSON.stringify(current_problem));
  // for locked test cases, drop the input and output
  for (let i = 0; i < problem.test_cases.length; i++) {
    if (problem.test_cases[i].locked) {
      delete problem.test_cases[i].input;
      delete problem.test_cases[i].output;
    }
  }
  // render the problem page
  res.render('problem', { problem: problem });
});

// POST /api/problem
router.post('/problem', function(req, res, next) {
  // retrieve the problem from the request body
  let { problem } = req.body;
  // check if problem is present
  if (!problem) {
    res.status(400).json({ error: 'Problem not found' });
    return;
  }
  // check if problem is valid
  try {
    validateProblem(problem);
  } catch (err) {
    res.status(400).json({ error: err.message });
    return;
  }
  // set the problem object
  current_problem = JSON.parse(String(problem));
  // send success response
  res.status(200).json({ message: 'Problem set successfully' });
});

// export the router
module.exports = router;
