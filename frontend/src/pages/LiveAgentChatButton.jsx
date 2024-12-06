import { useEffect } from 'react';

const LiveAgentChatButton = () => {
  useEffect(() => {
    // Dynamically load the script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.defer = true;
    script.id = 'la_x2s6df8d';
    script.src = 'https://dollytech.ladesk.com/scripts/track.js';

    script.onload = script.onreadystatechange = function () {
      const rs = this.readyState;
      if (!rs || rs === 'complete' || rs === 'loaded') {
        if (window.LiveAgent) {
          window.LiveAgent.createButton('ol5irb6p', this);
        }
      }
    };

    // Append the script to the document
    document.body.appendChild(script);

    // Cleanup script when the component unmounts
    return () => {
      document.getElementById('la_x2s6df8d')?.remove();
    };
  }, []);

  return null; // No visible UI for the script
};

export default LiveAgentChatButton;
