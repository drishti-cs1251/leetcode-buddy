const apiKey = "YOUR_API_KEY_HERE"; // Replace with your real Google API key

// --- 1. Get Hints ---
async function getHints(problemTitle, userCode = "") {
    const prompt = `
You are a friendly coding tutor for absolute beginners.
Explain ${problemTitle} in simple terms.

Rules:
1. Give exactly 3 progressive hints.
2. Use short, beginner-friendly language.
3. Use analogies or plain English.
4. Optional 1-2 line code snippet.
5. Do NOT give full solution.

${userCode ? "User's code:\n" + userCode : ""}
`;

    try {
        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": apiKey
                },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            }
        );

        const data = await response.json();
        if (data.error) return `❌ API Error: ${data.error.message}`;
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "⚠️ No hint generated.";
    } catch (err) {
        console.error("Error fetching hints:", err);
        return "❌ Failed to fetch hints. Try again later.";
    }
}

// --- 2. Get Similar Problems ---
async function getSimilar(problemTitle) {
    const prompt = `
Suggest 5 beginner-friendly LeetCode problems similar to "${problemTitle}".
List as short problem titles only.
`;

    try {
        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": apiKey
                },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            }
        );

        const data = await response.json();
        if (data.error) return ["❌ API Error: " + data.error.message];

        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        const problems = rawText.split(/\n|•/).map(p => p.trim()).filter(p => p);
        return problems.length ? problems : ["⚠️ No similar problems generated."];
    } catch (err) {
        console.error("Error fetching similar problems:", err);
        return ["❌ Failed to fetch similar problems. Try again later."];
    }
}

// --- 3. Listen for messages from content.js ---
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getHints") {
        getHints(request.problemTitle, request.userCode).then(hints => sendResponse({ hints }));
        return true;  // Indicates async response
    }
    if (request.action === "getSimilar") {
        getSimilar(request.problemTitle).then(problems => sendResponse({ problems }));
        return true;
    }
});
