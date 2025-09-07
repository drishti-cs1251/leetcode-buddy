(function () {
    // --- 1. Inject Sidebar HTML ---
    const sidebar = document.createElement("div");
    sidebar.id = "code-buddy-sidebar";
    sidebar.innerHTML = `
        <h2>👩‍💻 Code Buddy</h2>
        <div id="problem-title" style="font-weight:bold; margin-bottom:10px;"></div>
        <button id="get-hint-btn">Get Hint</button>
        <div id="hint-box" style="margin-top:15px;"></div>

        <!-- Collapsible Problem Description -->
        <div id="buddy-description">
            <div id="buddy-description-header">📖 Problem Description ▼</div>
            <div id="buddy-description-content"><p>Loading...</p></div>
        </div>

        <!-- Similar Problems Section -->
        <button id="get-similar-btn" style="margin-top:10px;">Show Similar Problems</button>
        <div id="similar-box" style="margin-top:10px;"></div>
    `;
    document.body.appendChild(sidebar);

    // --- 2. Toggle Button to Open/Close Sidebar ---
    const toggleBtn = document.createElement("button");
    toggleBtn.id = "buddy-toggle-btn";
    toggleBtn.innerText = "CodeBuddy";
    document.body.appendChild(toggleBtn);

    toggleBtn.addEventListener("click", () => {
        sidebar.classList.toggle("open");
        // Save sidebar state locally so it persists across page reloads
        chrome.storage.local.set({ sidebarOpen: sidebar.classList.contains("open") });
    });

    // --- 3. Collapsible Problem Description ---
    const descHeader = document.getElementById("buddy-description-header");
    const descWrapper = document.getElementById("buddy-description");
    descHeader.addEventListener("click", () => {
        descWrapper.classList.toggle("collapsed");
        descHeader.innerText = descWrapper.classList.contains("collapsed")
            ? "📖 Problem Description ▶"
            : "📖 Problem Description ▼";
    });

    // --- 4. Sidebar Styling ---
    const style = document.createElement("style");
    style.textContent = `
    /* Sidebar container */
    #code-buddy-sidebar { 
        position: fixed;
        top: 0;
        right: 0;
        width: 320px;
        height: 100vh;
        background: #0f0f0f;
        color: #dcdcdc;
        border-left: 2px solid #333;
        padding: 15px;
        overflow-y: auto;
        font-family: Arial, sans-serif;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease-in-out;
    }
    #code-buddy-sidebar.open { transform: translateX(0); }
    #code-buddy-sidebar h2 { color: #f89f1b; margin-bottom: 10px; }

    /* Buttons */
    #get-hint-btn, #get-similar-btn {
        background-color: #f89f1b;
        color: black;
        border: none;
        padding: 8px 12px;
        margin: 8px 0;
        border-radius: 5px;
        cursor: pointer;
        width: 100%;
    }
    #get-hint-btn:hover, #get-similar-btn:hover { background-color: #ffb84d; }

    /* Hint & Similar Boxes */
    #hint-box, #similar-box { margin-bottom: 12px; }

    /* Toggle Button */
    #buddy-toggle-btn {
        position: fixed;
        top: 15px;
        right: 15px;
        background-color: #f89f1b;
        color: black;
        border: none;
        padding: 8px 14px;
        border-radius: 8px;
        font-weight: bold;
        cursor: pointer;
        z-index: 10001;
        box-shadow: 0px 4px 6px rgba(0,0,0,0.2);
        transition: background 0.2s ease-in-out;
    }
    #buddy-toggle-btn:hover { background-color: #ffb84d; }

    /* Problem Description Styling */
    #buddy-description {
        margin-top: 15px;
        border: 1px solid #2a2a2a;
        border-radius: 6px;
        background-color: #0f0f0f;
        font-size: 14px;
        color:#dcdcdc;
    }
    #buddy-description-header {
        padding: 8px;
        font-weight: bold;
        cursor: pointer;
        background-color: #1e1e1e;
        border-bottom: 1px solid #333;
        color:#f0f0f0;
    }
    #buddy-description-content { padding: 10px; display: block; }
    #buddy-description.collapsed #buddy-description-content { display: none; }
    `;
    document.head.appendChild(style);

    // --- 5. Hint Progress Tracking ---
    const hintProgress = {}; 

    // --- 6. Update Sidebar Content from Page ---
    function updateSidebar() {
        const titleElement = document.querySelector("div[data-cy='question-title']") 
            || document.querySelector("div[class*='title']") 
            || document.querySelector("h1");
        const descElement = document.querySelector("div[data-key='description-content']") 
            || document.querySelector("div[data-track-load='description_content']");

        // Update problem title
        if (titleElement) {
            let problemTitle = titleElement.innerText.trim();
            problemTitle = problemTitle.replace(/^\d+\.\s*/, ""); // remove numbering
            document.getElementById("problem-title").innerText = problemTitle;
        }

        // Update problem description
        if (descElement) {
            document.getElementById("buddy-description-content").innerHTML = descElement.innerHTML;
        }
    }

    // --- 7. Fetch Hint from Background ---
    async function fetchHint() {
        const problemTitle = document.getElementById("problem-title").innerText.trim();
        const userCodeElement = document.querySelector(".view-lines");
        const userCode = userCodeElement ? userCodeElement.innerText : "";

        const hintBox = document.getElementById("hint-box");
        const loadingMsg = document.createElement("div");
        loadingMsg.style.color = "orange";
        loadingMsg.style.marginTop = "8px";
        loadingMsg.innerText = "⏳ Fetching hint...";
        hintBox.appendChild(loadingMsg);

        chrome.runtime.sendMessage(
            { action: "getHints", problemTitle, userCode },
            (response) => {
                hintBox.removeChild(loadingMsg);

                if (!response || !response.hints) {
                    const errorMsg = document.createElement("div");
                    errorMsg.style.color = "red";
                    errorMsg.innerText = "⚠️ No hint generated.";
                    hintBox.appendChild(errorMsg);
                    return;
                }

                if (!hintProgress[problemTitle]) hintProgress[problemTitle] = 0;

                const hintsArray = response.hints.split(/\n|•/).filter(h => h.trim() !== "");
                const index = hintProgress[problemTitle];

                if (index < hintsArray.length) {
                    const newHint = document.createElement("div");
                    newHint.style.marginTop = "10px";
                    newHint.style.padding = "6px";
                    newHint.style.background = "#222";
                    newHint.style.color = "#f8f8f2";
                    newHint.style.borderRadius = "6px";
                    newHint.style.fontSize = "14px";
                    newHint.innerText = hintsArray[index].trim();
                    hintBox.appendChild(newHint);
                    hintProgress[problemTitle]++;
                } else {
                    const doneMsg = document.createElement("div");
                    doneMsg.style.marginTop = "10px";
                    doneMsg.style.color = "lightgreen";
                    doneMsg.innerText = "✅ You’ve seen all hints!";
                    hintBox.appendChild(doneMsg);
                }
            }
        );
    }

    // --- 8. Fetch Similar Problems ---
    async function fetchSimilar() {
        const problemTitle = document.getElementById("problem-title").innerText.trim();
        const similarBox = document.getElementById("similar-box");
        similarBox.innerHTML = "";

        const loadingMsg = document.createElement("div");
        loadingMsg.style.color = "orange";
        loadingMsg.style.marginTop = "8px";
        loadingMsg.innerText = "⏳ Fetching similar problems...";
        similarBox.appendChild(loadingMsg);

        chrome.runtime.sendMessage(
            { action: "getSimilar", problemTitle },
            (response) => {
                similarBox.removeChild(loadingMsg);

                if (!response || !response.problems) {
                    similarBox.innerText = "⚠️ No similar problems generated.";
                    return;
                }

                const list = document.createElement("ul");
                response.problems.forEach(p => {
                    const item = document.createElement("li");
                    item.style.marginBottom = "6px";
                    item.innerText = p;
                    list.appendChild(item);
                });
                similarBox.appendChild(list);
            }
        );
    }

    // --- 9. Attach Event Listeners to Buttons ---
    document.addEventListener("click", (e) => {
        if (e.target && e.target.id === "get-hint-btn") fetchHint();
        if (e.target && e.target.id === "get-similar-btn") fetchSimilar();
    });

    // --- 10. Initial run & periodic update ---
    updateSidebar();
    setInterval(updateSidebar, 2000);  // updates content if user navigates between problems
})();
