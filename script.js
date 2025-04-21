document.addEventListener('DOMContentLoaded', () => {
    const dreamInput = document.getElementById('dreamInput');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const loading = document.getElementById('loading');
    const analysis = document.getElementById('analysis');

    analyzeBtn.addEventListener('click', async () => {
        const dreamText = dreamInput.value.trim();
        
        if (!dreamText) {
            alert('Please enter your dream description');
            return;
        }

        // Show loading state
        loading.classList.remove('hidden');
        analysis.classList.add('hidden');
        analyzeBtn.disabled = true;

        try {
            const response = await fetch('https://dipayan-pal.app.n8n.cloud/webhook/7a3a3f46-8f9c-4bee-9d3a-19a935f7aa55', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ dream: dreamText })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseText = await response.text();
            let data;
            
            try {
                data = JSON.parse(responseText);
            } catch (e) {
                // If response is not JSON, use it as is
                data = responseText;
            }

            // Display the response
            if (typeof data === 'string') {
                analysis.textContent = data;
            } else if (data && typeof data === 'object') {
                // Try to find the message in common response formats
                const message = data.message || data.analysis || data.response || data.text || data.content;
                if (message) {
                    analysis.textContent = message;
                } else {
                    // If no specific message field found, show the whole response
                    analysis.textContent = JSON.stringify(data, null, 2);
                }
            } else {
                analysis.textContent = String(data);
            }
            
            analysis.classList.remove('hidden');
        } catch (error) {
            console.error('Error:', error);
            analysis.textContent = `Error: ${error.message}. Please try again later.`;
            analysis.classList.remove('hidden');
        } finally {
            loading.classList.add('hidden');
            analyzeBtn.disabled = false;
        }
    });
}); 