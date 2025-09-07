# LeetCode-Buddy

LeetCode-Buddy is a **Chrome extension** designed to enhance your coding interview and competitive programming experience on [LeetCode](https://leetcode.com). It provides **hints, algorithm suggestions, and problem-solving guidance** directly on the LeetCode platform, helping users learn more efficiently while solving problems.

## Demo

1. CodeBuddy Button on LeetCode Page : 
After enabling the extension, a CodeBuddy button appears on the right side of the screen.
<img width="1919" height="953" alt="CodeBuddy Button" src="https://github.com/user-attachments/assets/4d3b2640-36b3-4bb8-8833-a311431935b3" />

2. Sidebar Opens with Problem Details : 
Clicking the CodeBuddy button opens a sidebar that accesses the problem title and description.
It has two main buttons: “Get Hint” and “Show Similar Problems”.
The problem description is collapsible for a clean view.
<img width="1919" height="968" alt="Sidebar with Buttons" src="https://github.com/user-attachments/assets/b6f12e29-45a3-40dc-9204-2e0ab2f286c4" />

3. Similar Problems List : 
Clicking “Show Similar Problems” lists related problems from LeetCode that match the current problem’s topic.
<img width="1919" height="960" alt="Similar Problems List" src="https://github.com/user-attachments/assets/d883b0d7-0121-466b-bdf8-bf17b78f6b7d" />

4. Progressive Hints Displayed in Real-Time :
Clicking “Get Hint” shows progressive hints in real-time, helping users approach the solution step by step.
<img width="1919" height="964" alt="Hints Display" src="https://github.com/user-attachments/assets/77a4bdb7-38d0-4778-b9e0-54142ac256a7" />
<img width="953" height="906" alt="Hints Example" src="https://github.com/user-attachments/assets/7927d1d5-d656-493c-b099-1d4036832db5" />


## Features

- **Problem Hints:** Displays helpful hints for the current problem.
- **Algorithmic Guidance:** Suggests approaches and strategies for solving problems.
- **Sidebar Integration:** Injects a clean, non-intrusive sidebar directly into LeetCode.
- **User-Friendly UI:** Simple and responsive design for smooth interaction.


## Tech Stack

- **Frontend:** JavaScript, HTML, CSS
- **Chrome Extension APIs:** `chrome.runtime`, `chrome.storage`, content scripts


## Installation (Local Setup)

To try LeetCode-Buddy locally:

1. Clone the repo:
   ```bash
   git clone https://github.com/drishti-cs1251/leetcode-buddy.git
2. Open Chrome and go to chrome://extensions/.

3. Enable Developer Mode (toggle in top-right corner).

4. Click Load unpacked and select the cloned repo folder.

4. The extension sidebar should now appear on LeetCode pages.
Note: Replace the placeholder API key in background.js or use Chrome storage for your own key.
 
## Usage

- Open any problem on LeetCode.

- The LeetCode-Buddy sidebar will appear on the page.

- Hints and suggestions will display in real-time.


## Contributing

Contributions are welcome! Feel free to submit a pull request or open an issue for suggestions and bug fixes.

## About

Developed by Drishti Gupta.
Aimed at helping beginner developers improve problem-solving efficiency and prepare effectively for coding interviews.
