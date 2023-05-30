document.addEventListener('DOMContentLoaded', function() {
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
});
