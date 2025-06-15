// utils/gptService.js

// Ensure 'type": "module"' is in your package.json for Node.js to recognize imports/exports.
// And make sure you have '@google/generative-ai' installed: npm install @google/generative-ai

import genAI from '../config/gemini.js'; // Imports the configured Gemini AI instance

/**
 * Sends a prompt to the Gemini AI, gets the plain text response, and then formats it into HTML.
 * @param {string} prompt The user's message to send to the AI.
 * @returns {Promise<string>} The AI's generated response, formatted as an HTML string.
 */
export async function getGPTResponse(prompt) {
  try {
    const model = genAI.getGenerativeModel({ model: 'models/gemini-1.5-flash' });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text(); // Get the plain text response from Gemini

    // Format the plain text response into HTML using your utility function
    const formattedHtml = formatToHTML(text);

    return formattedHtml; // Return the HTML string
  } catch (err) {
    console.error('❌ Gemini API Error:', err);
    // Re-throw the error so calling functions (like in flaskBridge.js) can handle it.
    throw err;
  }
}

/**
 * Formats plain text (expected to be from AI responses, potentially markdown-like)
 * into HTML with Tailwind CSS classes for chatbot styling.
 * Corrected syntax for template literals and bold regex.
 * @param {string} text The input text to format.
 * @returns {string} The HTML string.
 */
export function formatToHTML(text) {
  const lines   = text.split('\n');
  let html      = '';
  let inCard    = false;
  let inList    = false;

  const openCard  = () => {
    if (!inCard) {
      // Corrected: Use backticks for template literals
      html += `<div class="bg-[#F3E8FF] border-l-4 border-purple-500 p-4 rounded-lg shadow-sm mb-4 space-y-2">`;
      inCard = true;
    }
  };
  const closeList = () => { if (inList) { html += '</ul>'; inList = false; } };
  const closeCard = () => { if (inCard) { closeList(); html += '</div>'; inCard = false; } };

  lines.forEach(raw => {
    const line = raw.trim();
    if (line === '') { closeCard(); return; }

    openCard();

    /* ### Headings -------------------------------------------------------- */
    if (line.startsWith('###')) {
      html += `<h3 class="text-lg font-semibold text-purple-800 flex items-center gap-1">
                 <span></span>${line.slice(3).trim()}
               </h3>`;
      return;
    }

    /* Bold label (like "**Title:** Rest of text") ------------------------ */
    // Corrected regex to match actual markdown **text** and template literal syntax
    const boldLabelMatch = line.match(/^\*\*(.+?)\*\*[:：]?(.*)/);
    if (boldLabelMatch) {
      const boldPart = boldLabelMatch[1].trim();
      const rest = boldLabelMatch[2].trim();
      html += `<p class="font-semibold text-gray-800">${boldPart}${rest ? `: ${rest}` : ''}</p>`;
      return;
    }

    /* Bullet list items --------------------------------------------------- */
    if (line.startsWith('- ') || line.startsWith('* ')) {
      if (!inList) {
        html += '<ul class="list-disc list-inside ml-5 space-y-1 text-gray-700">';
        inList = true;
      }
      // Corrected: Use backticks for template literals
      html += `<li>${line.slice(2).trim().replace(/\*\*/g, '')}</li>`;
      return;
    } else {
      closeList();
    }

    /* Emoji‑led callout — removed emoji but handle layout still ---------- */
    // Assuming replace(/\*\*/g, '') is to clean up any bold markers inside these lines
    if (/^(\p{Extended_Pictographic}|\p{Emoji_Presentation})/u.test(line)) {
      html += `<div class="flex items-start gap-2 bg-white border border-purple-200 rounded-md p-3">
                  <p class="text-sm text-gray-700">${line.slice(1).trim().replace(/\*\*/g, '')}</p>
                </div>`;
      return;
    }

    /* Regular paragraph --------------------------------------------------- */
    // Corrected: Use backticks for template literals
    html += `<p class="text-sm text-gray-700 leading-relaxed">${line.replace(/\*\*/g, '')}</p>`;
  });

  closeCard();
  return html;
}