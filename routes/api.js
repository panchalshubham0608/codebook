// imports
const express = require('express');
const router = express.Router();
const validateProblem = require('../util/validation');

// the problem object
let current_problem = {
  "title": "Compute the sum",
  "description": "Write a program to input two integers A and B from user and output the value of expression  `$$A^2 + B^2$$`\n\n**Input Format:** Two space separated integers A and B\n\n**Output Format:** Single line of output containing the value of the given expression.\n\n\n**Example**\n```\n1 2\n5\n```",
  "supported_languages": [
      "c",
      "cpp"
  ],
  "test_cases": [
      {
          "input": "1 2\n",
          "output": "5\n",
          "score": 2,
          "timeout": 1000,
          "locked": false
      },
      {
          "input": "2 2\n",
          "output": "8\n",
          "score": 2,
          "timeout": 1000,
          "locked": true
      },
      {
          "input": "2 3\n",
          "output": "13\n",
          "score": 2,
          "timeout": 1000,
          "locked": true
      }
  ],
  "templates": []
}

// GET /api/problem
router.get('/problem', function(req, res, next) {
  res.send('respond with a resource');
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
  current_problem = problem;
  // send success response
  res.status(200).json({ message: 'Problem set successfully' });
});

// export the router
module.exports = router;
