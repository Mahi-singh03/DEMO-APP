const getRandomQuestions = (questions, count) => {
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const allQuestions = [
    {
      "question": "What does CPU stand for in computing?",
      "options": ["Computer Processing Unit", "Central Processing Unit", "Control Program Unit", "Central Power Unit"],
      "answer": "Central Processing Unit"
    },
    {
      "question": "In MS Word, which shortcut key is used to bold text?",
      "options": ["Ctrl+I", "Ctrl+U", "Ctrl+B", "Ctrl+T"],
      "answer": "Ctrl+B"
    },
    {
      "question": "What is the full form of RAM?",
      "options": ["Run Active Memory", "Random Access Memory", "Rapid Access Module", "Read Access Memory"],
      "answer": "Random Access Memory"
    },
    {
      "question": "Which MS Word feature allows you to create a list with bullet points?",
      "options": ["Table", "Indent", "Bullets", "Header"],
      "answer": "Bullets"
    },
    {
      "question": "What does USB stand for?",
      "options": ["Universal Serial Bus", "Ultra Speed Bus", "Unified Serial Bus", "Universal System Bus"],
      "answer": "Universal Serial Bus"
    },
    {
      "question": "In MS Word, what is the function of the 'Ctrl+S' shortcut?",
      "options": ["Print the document", "Save the document", "Open a new document", "Close the document"],
      "answer": "Save the document"
    },
    {
      "question": "What is the main function of an operating system?",
      "options": ["Create documents", "Run applications", "Design graphics", "Manage hardware and software resources"],
      "answer": "Manage hardware and software resources"
    },
    {
      "question": "What does LAN stand for?",
      "options": ["Local Area Network", "Large Area Network", "Local Access Network", "Long Access Node"],
      "answer": "Local Area Network"
    },
    {
      "question": "In MS Word, which tab contains the 'Font' settings?",
      "options": ["View", "Home", "Insert", "Review"],
      "answer": "Home"
    },
    {
      "question": "What is a byte in computing?",
      "options": ["16 bits", "8 bits", "4 bits", "32 bits"],
      "answer": "8 bits"
    },
    {
      "question": "What does the 'Ctrl+P' shortcut do in MS Word?",
      "options": ["Print the document", "Paste text", "Create a new page", "Preview the document"],
      "answer": "Print the document"
    },
    {
      "question": "What does HTML stand for?",
      "options": ["Home Tool Markup Language", "Hyperlink Text Machine Language", "Hyper Text Markup Language", "High Tech Multi Language"],
      "answer": "Hyper Text Markup Language"
    },
    {
      "question": "In MS Word, what is the purpose of the 'Find and Replace' feature?",
      "options": ["Insert images", "Change page layout", "Search and modify text", "Add comments"],
      "answer": "Search and modify text"
    },
    {
      "question": "What does GUI stand for in computing?",
      "options": ["Guided User Input", "General Utility Interface", "Graphical User Interface", "Global User Interface"],
      "answer": "Graphical User Interface"
    },
    {
      "question": "Which MS Word feature is used to align text to the left, center, or right?",
      "options": ["Text Wrap", "Paragraph Alignment", "Line Spacing", "Font Style"],
      "answer": "Paragraph Alignment"
    },
    {
      "question": "What does ROM stand for?",
      "options": ["Read Only Memory", "Run Only Module", "Random Output Memory", "Read Output Memory"],
      "answer": "Read Only Memory"
    },
    {
      "question": "In MS Word, what does the 'Ctrl+Z' shortcut do?",
      "options": ["Copy text", "Undo an action", "Paste text", "Redo an action"],
      "answer": "Undo an action"
    },
    {
      "question": "What is the full form of URL?",
      "options": ["Unique Retrieval Link", "Uniform Resource Locator", "Unified Resource Language", "Universal Reference Link"],
      "answer": "Uniform Resource Locator"
    },
    {
      "question": "Which MS Word tab is used to insert a table?",
      "options": ["Insert", "Design", "Home", "View"],
      "answer": "Insert"
    },
    {
      "question": "What does OS stand for in computing?",
      "options": ["Optimal Software", "Operating System", "Open Source", "Output System"],
      "answer": "Operating System"
    },
    {
      "question": "In MS Word, what is the purpose of the 'Mail Merge' feature?",
      "options": ["Edit images", "Send bulk emails or letters", "Create charts", "Format paragraphs"],
      "answer": "Send bulk emails or letters"
    },
    {
      "question": "What does HTTP stand for?",
      "options": ["Home Text Protocol", "Hyper Text Transfer Protocol", "High Text Transfer Protocol", "Hyperlink Transfer Protocol"],
      "answer": "Hyper Text Transfer Protocol"
    },
    {
      "question": "In MS Word, which shortcut key is used to italicize text?",
      "options": ["Ctrl+U", "Ctrl+I", "Ctrl+B", "Ctrl+L"],
      "answer": "Ctrl+I"
    },
    {
      "question": "What is the full form of HDD?",
      "options": ["Hybrid Digital Drive", "Heavy Duty Disk", "Hard Disk Drive", "High Data Drive"],
      "answer": "Hard Disk Drive"
    },
    {
      "question": "In MS Word, what does the 'Track Changes' feature do?",
      "options": ["Counts words", "Monitors document edits", "Formats text", "Inserts comments"],
      "answer": "Monitors document edits"
    },
    {
      "question": "What does BIOS stand for?",
      "options": ["Built-In Operating System", "Basic Input Output System", "Binary Input Output System", "Basic Internal Operating System"],
      "answer": "Basic Input Output System"
    },
    {
      "question": "In MS Word, which option is used to change the page orientation?",
      "options": ["Insert > Page Break", "Page Layout > Orientation", "Home > Font", "Review > Spelling"],
      "answer": "Page Layout > Orientation"
    },
    {
      "question": "What does SSD stand for?",
      "options": ["System Storage Device", "Solid State Drive", "Secure Storage Drive", "Standard Software Disk"],
      "answer": "Solid State Drive"
    },
    {
      "question": "In MS Word, what is the purpose of the 'Clipboard'?",
      "options": ["Check spelling", "Store copied or cut content", "Format text", "Insert images"],
      "answer": "Store copied or cut content"
    },
    {
      "question": "What does IP stand for in networking?",
      "options": ["Internet Protocol", "Input Processor", "Internal Protocol", "Integrated Process"],
      "answer": "Internet Protocol"
    },
    {
      "question": "In MS Word, which shortcut key opens the 'Find' dialog box?",
      "options": ["Ctrl+J", "Ctrl+F", "Ctrl+H", "Ctrl+G"],
      "answer": "Ctrl+F"
    },
    {
      "question": "What does PDF stand for?",
      "options": ["Personal Document Format", "Portable Document Format", "Public Data File", "Printable Data File"],
      "answer": "Portable Document Format"
    },
    {
      "question": "In MS Word, what is the purpose of the 'Header and Footer' feature?",
      "options": ["Change font size", "Insert repeating text at top or bottom", "Create tables", "Add text to margins"],
      "answer": "Insert repeating text at top or bottom"
    },
    {
      "question": "What does GPU stand for?",
      "options": ["Grid Processing Unit", "Graphics Processing Unit", "General Processing Unit", "Global Program Unit"],
      "answer": "Graphics Processing Unit"
    },
    {
      "question": "In MS Word, which tab contains the 'Spelling and Grammar' check?",
      "options": ["Review", "Home", "Insert", "View"],
      "answer": "Review"
    },
    {
      "question": "What does WAN stand for?",
      "options": ["Web Application Network", "Wide Area Network", "Wireless Area Network", "Wide Access Network"],
      "answer": "Wide Area Network"
    },
    {
      "question": "In MS Word, what does the 'Ctrl+C' shortcut do?",
      "options": ["Paste text", "Copy text", "Cut text", "Undo text"],
      "answer": "Copy text"
    },
    {
      "question": "What is the full form of WWW?",
      "options": ["World Wide Web", "Wide Web World", "Web World Wide", "World Web Wide"],
      "answer": "World Wide Web"
    },
    {
      "question": "In MS Word, which feature is used to create columns in a document?",
      "options": ["View > Zoom", "Page Layout > Columns", "Insert > Table", "Home > Paragraph"],
      "answer": "Page Layout > Columns"
    },
    {
      "question": "What does DBMS stand for?",
      "options": ["Database Management System", "Digital Base Management System", "Data Business Management System", "Data Backup Management System"],
      "answer": "Database Management System"
    },
    {
      "question": "In MS Word, what is the purpose of the 'Word Count' feature?",
      "options": ["Count tables", "Count characters and words", "Count pages", "Count images"],
      "answer": "Count characters and words"
    },
    {
      "question": "What does FTP stand for?",
      "options": ["Formatted Text Protocol", "File Transfer Protocol", "Fast Text Protocol", "File Transmission Process"],
      "answer": "File Transfer Protocol"
    },
    {
      "question": "In MS Word, which shortcut key is used to underline text?",
      "options": ["Ctrl+L", "Ctrl+U", "Ctrl+B", "Ctrl+I"],
      "answer": "Ctrl+U"
    },
    {
      "question": "What does ISP stand for?",
      "options": ["Integrated Software Platform", "Internet Service Provider", "Internet Security Program", "Internal System Protocol"],
      "answer": "Internet Service Provider"
    },
    {
      "question": "In MS Word, what is the purpose of the 'Page Break' feature?",
      "options": ["Start a new page", "Insert an image", "Change font size", "Add a comment"],
      "answer": "Start a new page"
    },
    {
      "question": "What does VPN stand for?",
      "options": ["Virtual Private Network", "Variable Processing Node", "Virtual Public Network", "Visual Program Network"],
      "answer": "Virtual Private Network"
    },
    {
      "question": "In MS Word, which tab contains the 'Page Borders' option?",
      "options": ["Design", "Home", "Insert", "Review"],
      "answer": "Design"
    },
    {
      "question": "What does ASCII stand for?",
      "options": ["American Standard Code for Information Interchange", "Advanced System Code for Integration", "Automated Standard Code for Interaction", "American System for Computer Information"],
      "answer": "American Standard Code for Information Interchange"
    },
    {
      "question": "In MS Word, what does the 'Ctrl+V' shortcut do?",
      "options": ["Cut text", "Paste text", "Copy text", "Undo text"],
      "answer": "Paste text"
    },
    {
      "question": "What does DNS stand for?",
      "options": ["Digital Network System", "Domain Name System", "Data Node Service", "Dynamic Network Server"],
      "answer": "Domain Name System"
    }
  ]
    const questions = getRandomQuestions(allQuestions, 30);

const Question = ({ currentQuestion, onAnswerSubmit }) => {
    const [selectedAnswer, setSelectedAnswer] = useState('');
    
    const handleOptionSelect = (option) => {
      setSelectedAnswer(option);
    };
  
    const handleSubmit = () => {
      if (selectedAnswer) {
        onAnswerSubmit(selectedAnswer);
        setSelectedAnswer('');
      }
    };
  
    if (!questions[currentQuestion]) {
      return <div>No question available</div>;
    }
  
    const question = questions[currentQuestion];
  
    return (
      <div className="question-container">
        <h3>{question.question}</h3>
        <div className="options-container">
          {question.options.map((option, index) => (
            <div key={index} className="option">
              <input
                type="radio"
                id={`option-${index}`}
                name="question-option"
                value={option}
                checked={selectedAnswer === option}
                onChange={() => handleOptionSelect(option)}
              />
              <label htmlFor={`option-${index}`}>{option}</label>
            </div>
          ))}
        </div>
        <button 
          className="submit-button"
          onClick={handleSubmit}
          disabled={!selectedAnswer}
        >
          Submit Answer
        </button>
      </div>
    );
};

// Only export the 30 random questions and the component
export { questions };
export default Question;
export const WE_16 = getRandomQuestions(questions, 30);    