// get the mode from supported language
function getModeFromLanguage(language) {
    switch (language) {
        case 'c':   return 'c_cpp';
        case 'cpp': return 'c_cpp';
        case 'java': return 'java';
        case 'py':  return 'python';
        case 'js':  return 'javascript';        
    }
}
// current language used
let current_language = null;
let previously_selected_test_case = null;

// construct the quill editor
let quill = new Quill('#problemContainer', {
    theme: 'snow',
    modules: {
        syntax: true,
        formula: true,
        toolbar: [],
    },
});
// disable editing
quill.enable(false);

// construct the ace editor
let editor = ace.edit('codeEditor');
editor.setTheme('ace/theme/eclipse');
let languageSelector = document.getElementById('supported_languages');
current_language = languageSelector.value;
editor.session.setMode(`ace/mode/${getModeFromLanguage(current_language)}`);
// update font size
editor.setFontSize(16);
    

// add event listener to the language selector
languageSelector.addEventListener('change', function() {
    // confirm the change
    if (!confirm('Changing the language will reset the code editor. Are you sure you want to continue?')) {
        // revert the change
        languageSelector.value = current_language;
        return;
    }
    // set the mode of the editor
    current_language = languageSelector.value;
    editor.session.setMode(`ace/mode/${getModeFromLanguage(current_language)}`);
    // clear the editor
    editor.setValue('');
});

// select a test case
function selectTestCase(testCaseNumber) {
    let container = document.getElementById(`test_case_${testCaseNumber}`);
    container.classList.add('test-case-selected');
    if (previously_selected_test_case) {
        previously_selected_test_case.classList.remove('test-case-selected');
    }
    previously_selected_test_case = container;
    let locked = container.getAttribute('data-locked');
    if (locked === 'true') {
        document.getElementById('inputOutputContainer').style.display = 'none';
    } else {
        document.getElementById('inputOutputContainer').style.display = 'block';
        document.getElementById('input').innerHTML = container.getAttribute('data-input');
        document.getElementById('output').innerHTML = container.getAttribute('data-output');
    }
    // update the output
    document.getElementById('youroutput').innerHTML = container.getAttribute('data-user-output');
    document.getElementById('result').innerHTML = container.getAttribute('data-result');
}

// handles the code submission
function handleCodeSubmission() {
    // get list of test cases
    let testCases = document.querySelectorAll('.test-case');
    let promises = [];
    // for each test case, make a request to the server
    for (let i = 0; i < testCases.length; i++) {
        // create a new promise
        let p = new Promise(function(resolve, reject) {
            let testCaseContainer = testCases[i];
            // hide the passed/failed items
            testCaseContainer.querySelector('.passed').style.display = 'none';
            testCaseContainer.querySelector('.failed').style.display = 'none';
            // show the loading item
            testCaseContainer.querySelector('.loader').style.display = 'inline-block';
            // make a new request
            let xhr = new XMLHttpRequest();
            xhr.open('POST', '/api/execute');
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onload = function() {
                // hide the loader
                testCaseContainer.querySelector('.loader').style.display = 'none';
                if (xhr.status === 200) {
                    let response = JSON.parse(xhr.responseText);
                    // update the output
                    let responseText = "";
                    switch (response.status) {
                        case 'AC': responseText = 'Accepted'; break;
                        case 'WA': responseText = 'Wrong Answer'; break;
                        case 'TLE': responseText = 'Time Limit Exceeded'; break;
                        case 'RE': responseText = 'Runtime Error'; break;
                        case 'CE': responseText = 'Compilation Error'; break;
                        default: responseText = 'Unknown Error';
                    }
                    // update the output
                    testCaseContainer.setAttribute('data-user-output', response.output || '');
                    testCaseContainer.setAttribute('data-result', responseText);
                    if (response.status === 'AC') {
                        // show the passed item
                        testCaseContainer.querySelector('.passed').style.display = 'inline-block';
                        // resolve the promise
                        resolve();
                    } else {
                        // show the failed item
                        testCaseContainer.querySelector('.failed').style.display = 'inline-block';
                        // reject the promise
                        reject();
                    }
                }
            };
            xhr.onerror = function() {
                // hide loader
                testCaseContainer.querySelector('.loader').style.display = 'none';
                // show output
                testCaseContainer.setAttribute('data-user-output', response.output);
                // reject the promise
                reject();
            };
            xhr.send(JSON.stringify({
                code: editor.getValue(),
                language: current_language,
                testCaseNumber: i + 1,
            }));    
        });
        // add the promise to the list
        promises.push(p);
    }

    // wait for all the promises to resolve
    let resultContainer = document.getElementById('resultContainer');
    resultContainer.innerHTML = '';
    Promise.all(promises).then(function() {
        // all test cases have been executed and passed
        resultContainer.innerHTML = `
        <p class="alert alert-success">Accepted</p>
        `
        resultContainer.style.display = 'block';
    }).catch(function() {
        // some test cases failed
        resultContainer.innerHTML = `
        <p class="alert alert-danger">Not yet there. Keep trying!</p>
        `
        resultContainer.style.display = 'block';
    }).finally(function() {
        // click the first test case
        document.getElementById('test_case_1').click();
    });
}