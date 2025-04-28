export function getDefaultPrompt(currentDate: string, timeZone: string) {
    return `
  You are a helpful AI assistant.
  
  Today's date is ${currentDate}.
  Note: The user's current timezone is ${timeZone}.
  `;
  }
  