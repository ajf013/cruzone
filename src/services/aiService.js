// Azure OpenAI Config loading (from environment or fallback to localStorage config)
const getAzureOpenAIConfig = () => {
  const endpoint = import.meta.env.VITE_AZURE_OPENAI_ENDPOINT || localStorage.getItem('cruz_portal_azure_openai_endpoint') || "";
  const key = import.meta.env.VITE_AZURE_OPENAI_KEY || localStorage.getItem('cruz_portal_azure_openai_key') || "";
  const deployment = import.meta.env.VITE_AZURE_OPENAI_DEPLOYMENT || localStorage.getItem('cruz_portal_azure_openai_deployment') || "gpt-4o";
  const apiVersion = import.meta.env.VITE_AZURE_OPENAI_API_VERSION || localStorage.getItem('cruz_portal_azure_openai_api_version') || "2024-02-15-preview";

  return { endpoint, key, deployment, apiVersion };
};

/**
 * Uses Azure OpenAI to deduce the live URL of a project based on its parameters and fcruz's project subdomain structures.
 * @param {string} title 
 * @param {string} category 
 * @param {string} description 
 * @param {string} repoUrl 
 * @returns {Promise<string|null>} Live URL or null if not found
 */
export const deduceLiveUrl = async (title, category, description, repoUrl) => {
  const { endpoint, key, deployment, apiVersion } = getAzureOpenAIConfig();

  if (!endpoint || !key) {
    throw new Error("Azure OpenAI endpoint or key is missing. Please configure them in your environment or admin settings.");
  }

  const cleanedEndpoint = endpoint.endsWith('/') ? endpoint.slice(0, -1) : endpoint;
  const targetUrl = `${cleanedEndpoint}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;

  const prompt = `You are a helper that finds the live website URL of a project. 
The developer 'fcruz' or 'ajf013' has added a project to their portfolio dashboard.
Details of the project:
- Title: ${title}
- Category: ${category}
- Description: ${description}
- GitHub Repo: ${repoUrl || 'Not provided'}

All of the developer's projects are hosted as subdomains under 'fcruz.org' (e.g., https://atsscore.fcruz.org/, https://cloudsentry.fcruz.org/, https://finops.fcruz.org/, https://pscli.fcruz.org/, https://unicompile.fcruz.org/, https://sticky-notes.fcruz.org/, https://convertme.fcruz.org/, https://music.fcruz.org/) or at fcruz.org directly.
Based on the details, identify or deduce the correct live URL for this project. 
Return ONLY the absolute URL. If you cannot find or deduce the URL, return the string "NONE". Do not write any markdown formatting, code block, or explanation.`;

  const response = await fetch(targetUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': key
    },
    body: JSON.stringify({
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 80
    })
  });

  if (!response.ok) {
    const errorDetails = await response.text().catch(() => "");
    throw new Error(`Azure OpenAI returned status ${response.status}: ${errorDetails || response.statusText}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content?.trim();
  
  if (!text || text.toUpperCase() === 'NONE' || !text.startsWith('http')) {
    return null;
  }
  
  return text;
};

/**
 * Generates the Microlink screenshot URL for the given live URL
 * @param {string} liveUrl 
 * @returns {string} Microlink screenshot URL
 */
export const getScreenshotUrl = (liveUrl) => {
  if (!liveUrl || !liveUrl.startsWith('http')) return '';
  return `https://api.microlink.io?url=${encodeURIComponent(liveUrl)}&screenshot=true&embed=screenshot.url`;
};
