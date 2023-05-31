// imports
const express = require('express');
const router = express.Router();
const validateProblem = require('../util/validation');
const sample_problem = require('../util/sample_problem');
const executeSourceCode = require('../util/executer');

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


// execute the code for a given test case number
router.post('/execute', function(req, res, next) {
  // check if problem is set
  if (!current_problem) {
    res.status(400).json({ error: 'Problem not found' });
    return;
  }
  // retrieve the code, language and test case number from the request body
  let { code, language, testCaseNumber } = req.body;
  // check if test case number is present
  if (!testCaseNumber) {
    res.status(400).json({ error: 'Test case number not found' });
    return;
  }
  // check if test case number is a number
  if (typeof testCaseNumber !== 'number') {
    res.status(400).json({ error: 'Test case number must be a number' });
    return;
  }
  // check if test case number is valid
  if (testCaseNumber <= 0 || testCaseNumber > current_problem.test_cases.length) {
    res.status(400).json({ error: 'Invalid test case number' });
    return;
  }
  // check if language is a string
  if (typeof language !== 'string') {
    res.status(400).json({ error: 'Language must be a string' });
    return;
  }
  // check if language is one of the supported languages
  if (!current_problem.supported_languages.includes(language)) {
    res.status(400).json({ error: 'Language not supported' });
    return;
  }
  // check if code is a string
  if (typeof code !== 'string') {
    res.status(400).json({ error: 'Code must be a string' });
    return;
  }


  // retrieve the test case
  let testCase = current_problem.test_cases[testCaseNumber - 1];
  // execute the code against the test case
  let result = executeSourceCode({ sourceCode: code, language, testCase });
  // if the test case is locked, drop the input and output
  if (testCase.locked) {
    delete result.input;
    delete result.expectedOutput;
  }
  // send the result
  res.status(200).json({ ...result });
});

// export the router
module.exports = router;
