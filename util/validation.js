// list of allowed languages
const ALLOWED_LANGUAGES = ['c', 'cpp', 'java', 'py', 'js'];

// check if a test case is valid
const validateTestCase = (testCase) => {
    // check if the test case is an object
    if (typeof testCase != 'object') {
        throw new Error('Test case must be an object');
    }

    // check if the input is a string
    if (!testCase.hasOwnProperty('input') || typeof testCase.input != 'string') {
        throw new Error('Test case must have a key \'input\'');
    }

    // check if the output is a string
    if (!testCase.hasOwnProperty('output') || typeof testCase.output != 'string') {
        throw new Error('Test case must have a key \'output\'');
    }

    // check if the score is a number
    if (!testCase.hasOwnProperty('score') || typeof testCase.score != 'number') {
        throw new Error('Test case must have a key \'score\'');
    }

    // check if the score is a positive number
    if (testCase.score < 0) {
        throw new Error('Test case score must be a positive number');
    }

    // check if the timeout is a number
    if (!testCase.hasOwnProperty('timeout') || typeof testCase.timeout != 'number') {
        throw new Error('Test case must have a key \'timeout\'');
    }

    // check if the timeout is a positive number
    if (testCase.timeout < 0) {
        throw new Error('Test case timeout must be a positive number');
    }

    // check if the locked is a boolean
    if (!testCase.hasOwnProperty('locked') || typeof testCase.locked != 'boolean') {
        throw new Error('Test case must have a key \'locked\'');
    }
}

// validate if the list of supported languages is valid
const validateSupportedLanguages = (supportedLanguages) => {
    // check if the supported_languages is an array
    if (supportedLanguages == null || !Array.isArray(supportedLanguages)) {
        throw new Error('\'supported_languages\' must be an array');
    }

    // check if the supported_languages array is empty
    if (supportedLanguages.length == 0) {
        throw new Error('\'supported_languages\' array cannot be empty');
    }
    // check if elements of supported_languages array are strings
    for (let i = 0; i < supportedLanguages.length; i++) {
        if (typeof supportedLanguages[i] != 'string') {
            throw new Error('Elements of \'supported_languages\' array must be strings');
        }
        // check if the supported_languages array contains only allowed languages
        if (!ALLOWED_LANGUAGES.includes(supportedLanguages[i])) {
            throw new Error(`Language ${supportedLanguages[i]} is not supported`);
        }
    }
}

// validate if the problem is valid
const validateProblem = (data) => {
    // parse the data
    let json = null;
    try {
        json = JSON.parse(data);
    } catch (err) {
        console.log(err);
        throw new Error('Invalid JSON');
    }
    // check if the json is an array
    if (Array.isArray(json)) {
        throw new Error('JSON must be an object');
    }
    // check if the json has a key 'title'
    if (!json.hasOwnProperty('title') || typeof json.title != 'string' ) {
        throw new Error('JSON must have a key \'title\'');
    }

    // check if the json has a key 'description'
    if (!json.hasOwnProperty('description') || typeof json.description != 'string' ) {
        throw new Error('JSON must have a key \'description\'');
    }

    // check if the json has a key 'supported_languages'
    if (!json.hasOwnProperty('supported_languages') || !Array.isArray(json.supported_languages)) {
        throw new Error('JSON must have a key \'supported_languages\'');
    }
    // check if supported_languages is valid
    validateSupportedLanguages(json.supported_languages);

    // check if the json has a key 'test_cases'
    if (!json.hasOwnProperty('test_cases') || !Array.isArray(json.test_cases)) {
        throw new Error('JSON must have a key \'test_cases\'');
    }
    // check if the test_cases array is empty
    if (json.test_cases.length == 0) {
        throw new Error('\'test_cases\' array cannot be empty');
    }
    // check if elements of test_cases are valid
    for (let i = 0; i < json.test_cases.length; i++) {
        validateTestCase(json.test_cases[i]);
    }
};

// export the validateProblem function
module.exports = validateProblem;
