export function speakTelugu(text: string): Promise<void> {
  return new Promise((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "te-IN";
    utterance.rate = 0.8;
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    speechSynthesis.speak(utterance);
  });
}

export function startSpeechRecognition(): Promise<string> {
  return new Promise((resolve, reject) => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      reject(new Error("Speech recognition not supported"));
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "te-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      resolve(transcript);
    };

    recognition.onerror = (event: any) => {
      reject(new Error(event.error));
    };

    recognition.onend = () => {
      // If no result was captured
    };

    recognition.start();
  });
}
