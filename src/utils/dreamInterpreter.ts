// API Response interface
interface DreamInterpretationResponse {
  data: {
    interpretation: string;
  };
}

/**
 * Calls the ChatGPT API to interpret dreams
 * @param {string} dreamText - The user's dream description
 * @returns {Promise<string>} - The interpreted dream analysis from ChatGPT
 */
export const interpretDream = async (dreamText: string): Promise<string> => {
  try {
    const response = await fetch('http://localhost:3000/api/dreams/interpret', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dreamText: dreamText
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const res: DreamInterpretationResponse = await response.json();
    
    // Return the interpretation from the API response
    // The response structure is: { "data": { "interpretation": "" } }
    return res.data?.interpretation || 'No interpretation received from the server';
    
  } catch (error) {
    console.error('Error calling dream interpretation API:', error);
    
    // Provide a user-friendly error message
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Unable to connect to the dream interpretation service. Please make sure the server is running on http://localhost:3000');
    } else if (error instanceof Error && error.message.includes('HTTP error')) {
      throw new Error('The dream interpretation service returned an error. Please try again later.');
    } else {
      throw new Error('An unexpected error occurred while interpreting your dream. Please try again.');
    }
  }
}; 