const API_KEY = "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";

        async function handleQuery() {
            const query = document.getElementById('queryInput').value;
            if (!query || query.length < 15) {
                alert("Please provide detailed query (minimum 15 characters)");
                return;
            }

            const responseBox = document.getElementById('responseBox');
            responseBox.innerHTML = "<p>🔍 Analyzing under IPC, CrPC, Constitution...</p>";
            responseBox.style.display = 'block';

            try {
                const response = await generateResponse(query);
                responseBox.innerHTML = `
                    <h3>📜 Legal Analysis:</h3>
                    <div class="legal-card">${formatResponse(response)}</div>
                    <p style="margin-top: 1rem; color: #FFD700;">Note: Informational only. Consult licensed lawyer.</p>
                `;
            } catch (error) {
                responseBox.innerHTML = `<p class="error">Error: ${error.message}</p>`;
            }
        }

        async function generateResponse(query) {
            const prompt = `**Indian Legal Expert System**\n${query}\nFormat response with clear headings. Base strictly on Indian law.`;

            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': location.href,
                    'X-Title': "Indian Legal AI"
                },
                body: JSON.stringify({
                    model: "meta-llama/llama-3.3-70b-instruct:free",
                    messages: [
                        { role: "system", content: "Legal expert specializing in Indian law" },
                        { role: "user", content: prompt }
                    ],
                    temperature: 0.3,
                    max_tokens: 2500
                })
            });

            const data = await response.json();
            return data.choices[0].message.content + addLegalResources();
        }

        function formatResponse(text) {
            return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                       .replace(/\n/g, '<br>');
        }

        function addLegalResources() {
            return `
                \n\nEmergency Legal Resources:
                - Police: 100
                - Women Helpline: 1091
                - Legal Aid: 155345
                - Cyber Crime: 1930
                Key Acts: IPC, CrPC, Evidence Act, Consumer Protection Act`;
        }

        function showEmergency() {
            const contacts = document.getElementById('emergencyContacts');
            contacts.style.display = contacts.style.display === 'none' ? 'grid' : 'none';
            
            if (contacts.innerHTML === '') {
                const emergencyList = {
                    'Police': '100',
                    'Women Helpline': '1091',
                    'Legal Aid': '155345',
                    'Cyber Crime': '1930'
                };

                contacts.innerHTML = Object.entries(emergencyList)
                    .map(([service, number]) => `
                        <div class="contact-card">
                            <h3>${service}</h3>
                            <p>${number}</p>
                        </div>
                    `).join('');
            }
        }
    