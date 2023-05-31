// add onchange handler to upload-button
document.addEventListener('DOMContentLoaded', () => {
    // get upload button
    let uploadButton = document.getElementById('upload-button');
    // add onchange handler
    uploadButton.addEventListener('change', () => {
        // check if any file is selected
        if (uploadButton.files.length == 0) return;
        // check if only one file is selected
        if (uploadButton.files.length > 1) {
            alert('Please upload only one file');
            return;
        }
        // get file and check if it is a *.json file
        let file = uploadButton.files[0];
        let parts = file.name.split('.');
        if (parts.length < 2) {
            alert('Please upload a *.json file');
            return;
        }
        if (
            // check if the file is a *.json file
            (parts[parts.length - 1] != 'json') &&
            // check if the file is a *.json.enc file
            (parts[parts.length - 2] != 'json' && parts[parts.length - 1] != 'enc')
        ) {
            alert('Please upload a *.json or *.json.enc file');
            return;
        }
        // read the file
        let reader = new FileReader();
        reader.onload = () => {
            // check if file is empty
            if (reader.result == '') {
                alert('File is empty');
                return;
            }
            // get the content of the file
            let content = String(reader.result);
            // if file is a *.json.enc file, decrypt it
            if (parts[parts.length - 1] == 'enc') {
                // ask for password
                let password = prompt('Enter password to unlock file');
                // decrypt the file
                try {
                    content = CryptoJS.AES.decrypt(content, password).toString(CryptoJS.enc.Utf8);
                } catch (err) {
                    alert('Wrong password');
                    window.location.href = '/';
                    return;
                }
            }
            // try to set the problem object at /api/problem
            // display loader
            document.getElementById('loading-wrapper').style.display = 'block';
            // send request to /api/problem
            try {
                let xhr = new XMLHttpRequest();
                xhr.open('POST', '/api/problem');
                xhr.setRequestHeader('Content-Type', 'application/json');
                // handle response
                xhr.onload = () => {
                    if (xhr.status == 200) {
                        // redirect to /api/problem
                        window.location.href = '/api/problem';
                    } else if (xhr.status == 400) {
                        alert(`Error: ${JSON.parse(xhr.responseText).error}`);
                    } else {
                        alert('Something went wrong');
                    }
                }
                // handle error
                xhr.onerror = () => {
                    if (xhr.status == 400) {
                        alert(JSON.parse(xhr.responseText).error);
                    } else {
                        alert('Something went wrong');
                    }
                }
                // send the request with the problem object
                xhr.send(JSON.stringify({ problem: content }));
            } catch (err) {
                console.log(err);
                alert('Something went wrong');
            } finally {
                // hide loader
                document.getElementById('loading-wrapper').style.display = 'none';
            }

        }
        // handle error while reading file
        reader.onerror = () => {
            alert('Error reading file');
            return;
        }
        // read the file as text
        reader.readAsText(file);
    });
});
