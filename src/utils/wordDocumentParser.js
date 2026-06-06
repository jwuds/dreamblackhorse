import mammoth from 'mammoth';

export const parseWordDocument = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    
    // Extract raw text for basic analysis
    const textResult = await mammoth.extractRawText({ arrayBuffer });
    const rawText = textResult.value;

    // Convert to HTML for structured parsing
    const htmlResult = await mammoth.convertToHtml({ arrayBuffer }, {
      styleMap: [
        "p[style-name='Heading 1'] => h1:fresh",
        "p[style-name='Heading 2'] => h2:fresh",
        "p[style-name='Heading 3'] => h3:fresh"
      ]
    });
    const rawHtml = htmlResult.value;

    return {
      rawText,
      rawHtml,
      messages: htmlResult.messages
    };
  } catch (error) {
    console.error('Error parsing Word document:', error);
    throw new Error('Failed to parse Word document. Please ensure it is a valid .docx file.');
  }
};