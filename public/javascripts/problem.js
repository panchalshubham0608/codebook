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

// add elements
document.addEventListener('DOMContentLoaded', function() {
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
});

// select a test case
function selectTestCase(testCaseNumber) {
    let container = document.getElementById(`test_case_${testCaseNumber}`);
    let locked = container.getAttribute('data-locked');
    if (locked === 'true') {
        document.getElementById('inputOutputContainer').style.display = 'none';
        document.getElementById('lockedTestCaseContainer').style.display = 'block';
    } else {
        document.getElementById('inputOutputContainer').style.display = 'block';
        document.getElementById('lockedTestCaseContainer').style.display = 'none';
        document.getElementById('input').innerHTML = container.getAttribute('data-input');
        document.getElementById('output').innerHTML = container.getAttribute('data-output');
    }
    // hide the test case instructions
    document.getElementById('testCaseInstructions').style.display = 'none';
}
