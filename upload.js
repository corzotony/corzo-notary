// Upload handler for Corzo Notary
// Sends file to the Worker API at api.notaryservices.work

const API_URL = 'https://api.notaryservices.work';

document.getElementById('uploadForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const submitBtn = document.getElementById('submitBtn');
    const errorMsg = document.getElementById('errorMsg');
    const successMsg = document.getElementById('successMsg');
    const fileInput = document.getElementById('fileInput');
    const nameInput = document.getElementById('uploaderName');
    const passwordInput = document.getElementById('uploadPassword');

    // Hide previous messages
    errorMsg.style.display = 'none';
    successMsg.style.display = 'none';

    // Validate
    if (!fileInput.files || fileInput.files.length === 0) {
        errorMsg.textContent = 'Please select a file to upload.';
        errorMsg.style.display = 'block';
        return;
    }

    const file = fileInput.files[0];
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
        errorMsg.textContent = 'File is too large. Maximum size is 50MB.';
        errorMsg.style.display = 'block';
        return;
    }

    // Build form data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('uploaderName', nameInput.value);
    formData.append('password', passwordInput.value);

    submitBtn.disabled = true;
    submitBtn.textContent = 'Uploading...';

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            successMsg.textContent = 'Document uploaded successfully! We will contact you shortly.';
            successMsg.style.display = 'block';
            // Reset form
            document.getElementById('uploadForm').reset();
            // Redirect to success page after 2 seconds
            setTimeout(() => {
                window.location.href = 'success.html';
            }, 2000);
        } else {
            const errorText = await response.text();
            errorMsg.textContent = 'Upload failed: ' + (errorText || 'Please check your password and try again.');
            errorMsg.style.display = 'block';
        }
    } catch (err) {
        errorMsg.textContent = 'Network error. Please check your connection and try again.';
        errorMsg.style.display = 'block';
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Upload Securely';
    }
});