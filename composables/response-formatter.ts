export const useResponseFormat = () => {
  const formatResponse = (textToFormat: string, format: string = 'text') => {
    if (format === 'markdown') {
      const formattedText = formatText(textToFormat);
      return formattedText;
    }

    return textToFormat;
  };

  const llmResponseFormat = (llmConf: any) => {
    if (!llmConf || llmConf._type === 'openai-chat') {
      return 'markdown';
    }

    return 'text';
  };

  const formatText = (textToFormat: string) => {
    //Regex for recognizing bold text ( **...** e __...__ )
    const boldRegex = /\*\*(.+?)\*\*|__(.+?)__/g;

    //Regex for recognizing titles ( ###.... )
    const titleRegex = /^(#{1,6})\s+(.+)$/gm;

    //Regex for code (`...`)
    const codeRegex = /`([^`]*)`/g;

    //Regex for Links
    const linkRegex = /\[(.*?)\]\((.*?)\)/g;

    const lines = textToFormat.split('\n');
    let formattedLines;
    formattedLines = lines.map((line) => {
      return line.replace(boldRegex, (_, boldType1, boldType2) => {
        const boldText = boldType1 || boldType2;
        return `<strong>${boldText}</strong>`;
      });
    });
    formattedLines = formattedLines.map((line) => {
      return line.replace(titleRegex, (_, hashes, titleText) => {
        const titleLevel = hashes.length;
        return `<h${titleLevel}>${titleText}</h${titleLevel}>`;
      });
    });
    formattedLines = formattedLines.map((line) => {
      return line.replace(codeRegex, (_, code) => {
        return `<code>${code}</code>`;
      });
    });
    formattedLines = formattedLines.map((line) => {
      return line.replace(linkRegex, (_, url, link) => {
        return `<a href="${url}" target="_blank" rel="noopener">${link}</a>`;
      });
    });
    return formattedLines.join('<br />');
  };

  return {
    llmResponseFormat,
    formatResponse,
  };
};
