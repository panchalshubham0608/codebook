// imports
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { execSync } = require('child_process');
const logger = require('./logger');

// creates a directory with given name
// and returns the path to the directory
const createDirectory = () => {
    const dirName = uuidv4();
    const dirPath = path.join("/tmp", dirName);
    logger.info(`Creating directory ${dirPath}`);
    fs.mkdirSync(dirPath);
    return dirPath;
}

// deletes the directory with given path
const deleteDirectory = (dirPath) => {
    logger.info(`Deleting directory ${dirPath}`);
    try {
        fs.rmSync(dirPath, { recursive: true });
    } catch (err) {
        logger.error(`Error deleting directory ${dirPath}: ${err.message}`);
    }
}

// generates the command to compile the source code
const getExecuteCommands = (language) => {
    switch (language) {
        case 'c':
            return {
                filename: 'main',
                ext: '.c',
                compile: 'gcc',
                run: './a.out'               
            }
        case 'cpp':
            return {
                filename: 'main',
                ext: '.cpp',
                compile: 'g++',
                run: './a.out'
            }
        case 'java':
            return {
                filename: 'Main',
                ext: '.java',
                compile: 'javac',
                run: 'java Main'
            }
        case 'py':
            return {
                filename: 'main',
                ext: '.py',
                compile: null,
                run: 'python3 main.py'
            }
        case 'js':
            return {
                filename: 'main',
                ext: '.js',
                compile: null,
                run: 'node main.js'
            }            
        default:
            throw new Error('Unsupported language');
    }
}

// writes the source code to a file
// based on the language
const writeSourceCodeToFile = (sourceCode, language, dirPath) => {
    let props = getExecuteCommands(language);
    let fileName = props.filename + props.ext;
    let filePath = path.join(dirPath, fileName);
    fs.writeFileSync(filePath, sourceCode);
    return {
        fileName,
        compileCommand: props.compile ? `${props.compile} ${fileName}` : null,
        runCommand: props.run
    }
};

// Execute user's source code for given language
// and validate the output against given problemId
const executeSourceCode = ({sourceCode, language, testCase}) => {
    // create a directory to store the source code
    const dirPath = createDirectory();
    try {
        // write the source code to a file
        const { fileName, compileCommand, runCommand } = writeSourceCodeToFile(sourceCode, language, dirPath);
        // compile the source code
        if (compileCommand) {
            logger.info(`Compiling source code ${fileName} with command ${compileCommand}`);
            try {
                const compileOutput = execSync(compileCommand, { cwd: dirPath });
                logger.info(`Compilation successful with output: ${compileOutput.toString()}`);
            } catch (err) {
                // compilation failed
                logger.error(`Compilation error: ${err}`);
                return {
                    status: 'CE',
                    output: err.message
                }
            }
        }


        // run the source code against test case
        logger.info(`Running source code ${fileName} with command ${runCommand}`);
        try {
            const runOutput = execSync(runCommand, { 
                cwd: dirPath, 
                input: testCase.input,
                timeout: testCase.timeout
            });
            if (runOutput.toString().trim() !== testCase.output.trim()) {
                // output is incorrect
                return {
                    status: 'WA',
                    input: testCase.input,
                    output: runOutput.toString().trim(),
                    expectedOutput: testCase.output
                };
            } else {
                // output is correct
                return {
                    status: 'AC',
                    input: testCase.input,
                    output: runOutput.toString().trim(),
                    expectedOutput: testCase.output
                };
            }
        } catch (err) {
            // execution failed
            logger.info(`Execution error:\n${err}`);
            if (err.signal === 'SIGTERM') {
                // execution timed out
                return {
                    status: 'TLE',
                    input: testCase.input,
                    output: '',
                    expectedOutput: testCase.output
                };
            } else {
                return {
                    status: 'RE',
                    input: testCase.input,
                    output: err.message,
                    expectedOutput: testCase.output
                };    
            }
        }
    } catch (err) {
        // some error occured
        return {
            status: 'error',
            output: err.message
        };
    } finally {
        // delete the directory
        deleteDirectory(dirPath);
    }
};

// exports
module.exports = executeSourceCode;
