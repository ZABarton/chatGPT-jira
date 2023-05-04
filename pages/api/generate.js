import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const description = req.body.description || '';
  if (description.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a description",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(description),
      temperature: 0.6,
      max_tokens: 2000,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(description) {
  return `Based on the following description
    
    ${description}
  
    Create the text of a Jira Ticket based on this description
    The Jira Ticket should have a title that quickly summarizes the description
    
    The body of the Jira ticket should contain a section subtitled "Background"
    This background suggestion should provide additional context for why we need the work described in the description.

    After the "Background" section, the body of the Jira ticket should contain a section subtitled "Expected Work"
    The "Expected Work" section should contain the list of steps to complete the described work.
    This list of steps is considered "high-level" and should not focus too strongly on technical details.
    The list should be bulleted and ordered in the sequence needed to complete the work.
    
    The final section of the ticket body should be titled "Acceptance Criteria"
    This section should contain a bulleted list of requirements that need to be met in order to consider this ticket complete.
   
    Assume that any code that needs to be written will be written in the latest version of Ruby on Rails.
`;
}
