const getRandomQuestions = (questions, count) => {
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const allQuestions = [
    {
      "question": "In MS Excel, what is the shortcut to undo the last action?",
      "options": ["Ctrl+Y", "Ctrl+Z", "Ctrl+X", "Ctrl+W"],
      "answer": "Ctrl+Z"
    },
    {
      "question": "What does the VLOOKUP function in MS Excel do?",
      "options": [
        "Counts the number of cells with a specific value",
        "Searches for a value in a column and returns a value from the same row",
        "Merges two worksheets",
        "Sorts data in ascending order"
      ],
      "answer": "Searches for a value in a column and returns a value from the same row"
    },
    {
      "question": "In MS Word, which tab contains the 'Page Layout' options?",
      "options": ["View", "Home", "Insert", "Layout"],
      "answer": "Layout"
    },
    {
      "question": "What is the purpose of the 'Track Changes' feature in MS Word?",
      "options": [
        "To insert comments automatically",
        "To highlight spelling errors",
        "To monitor edits made to a document",
        "To change the document font"
      ],
      "answer": "To monitor edits made to a document"
    },
    {
      "question": "In MS PowerPoint, what is the shortcut to start a slideshow from the first slide?",
      "options": ["F7", "F12", "F5", "F3"],
      "answer": "F5"
    },
    {
      "question": "What does the 'Freeze Panes' option in MS Excel do?",
      "options": [
        "Merges cells together",
        "Locks specific rows or columns in place",
        "Hides selected cells",
        "Applies conditional formatting"
      ],
      "answer": "Locks specific rows or columns in place"
    },
    {
      "question": "In MS Word, what is the shortcut to copy selected text?",
      "options": ["Ctrl+X", "Ctrl+V", "Ctrl+P", "Ctrl+C"],
      "answer": "Ctrl+C"
    },
    {
      "question": "What is a 'Pivot Table' in MS Excel used for?",
      "options": [
        "Merging worksheets",
        "Creating charts",
        "Formatting cells",
        "Summarizing and analyzing data"
      ],
      "answer": "Summarizing and analyzing data"
    },
    {
      "question": "In MS PowerPoint, which tab allows you to add animations to slides?",
      "options": ["Design", "Animations", "Insert", "Home"],
      "answer": "Animations"
    },
    {
      "question": "What is the default file extension for an MS Excel workbook in newer versions?",
      "options": [".csv", ".docx", ".xlsx", ".xls"],
      "answer": ".xlsx"
    },
    {
      "question": "In MS Word, what does the 'Mail Merge' feature do?",
      "options": [
        "Formats tables",
        "Sends emails directly",
        "Combines multiple documents",
        "Creates personalized documents from a template"
      ],
      "answer": "Creates personalized documents from a template"
    },
    {
      "question": "What is the full form of RAM in computer terminology?",
      "options": [
        "Random Active Memory",
        "Rapid Access Module",
        "Random Access Memory",
        "Read Always Memory"
      ],
      "answer": "Random Access Memory"
    },
    {
      "question": "In Tally, what is the shortcut key to create a new ledger?",
      "options": ["F12", "Ctrl+L", "F2", "Alt+C"],
      "answer": "Alt+C"
    },
    {
      "question": "What does the term 'URL' stand for in Internet terminology?",
      "options": [
        "Unified Resource Language",
        "Uniform Resource Locator",
        "Unique Retrieval Location",
        "Universal Reference Link"
      ],
      "answer": "Uniform Resource Locator"
    },
    {
      "question": "In MS Excel, what does the IF function do?",
      "options": [
        "Sums a range of cells",
        "Performs a logical test and returns one value for TRUE, another for FALSE",
        "Counts non-empty cells",
        "Finds the average of numbers"
      ],
      "answer": "Performs a logical test and returns one value for TRUE, another for FALSE"
    },
    {
      "question": "In MS Word, which shortcut aligns text to the center?",
      "options": ["Ctrl+J", "Ctrl+R", "Ctrl+E", "Ctrl+L"],
      "answer": "Ctrl+E"
    },
    {
      "question": "What is the purpose of the 'Slide Master' in MS PowerPoint?",
      "options": [
        "To add animations",
        "To set the default design for all slides",
        "To create new slides",
        "To insert charts"
      ],
      "answer": "To set the default design for all slides"
    },
    {
      "question": "In basic computer knowledge, what does CPU stand for?",
      "options": [
        "Core Processing Unit",
        "Central Program Utility",
        "Computer Power Unit",
        "Central Processing Unit"
      ],
      "answer": "Central Processing Unit"
    },
    {
      "question": "In Tally, what is the function of the 'Gateway of Tally'?",
      "options": [
        "Report generator",
        "Backup tool",
        "Main menu for accessing all features",
        "Data export tool"
      ],
      "answer": "Main menu for accessing all features"
    },
    {
      "question": "What does the term 'HTTP' stand for in Internet terminology?",
      "options": [
        "Host Text Transfer Process",
        "HyperText Transfer Protocol",
        "High Transfer Text Protocol",
        "Hyperlink Transport Protocol"
      ],
      "answer": "HyperText Transfer Protocol"
    },
    {
      "question": "In MS Excel, what is the purpose of the 'Conditional Formatting' feature?",
      "options": [
        "To sort data",
        "To automatically format cells based on their values",
        "To merge cells",
        "To create charts"
      ],
      "answer": "To automatically format cells based on their values"
    },
    {
      "question": "In MS Word, what is the shortcut to paste copied text?",
      "options": ["Ctrl+C", "Ctrl+Z", "Ctrl+V", "Ctrl+X"],
      "answer": "Ctrl+V"
    },
    {
      "question": "In MS PowerPoint, what does the 'Transition' feature control?",
      "options": [
        "The slide size",
        "The slide background color",
        "The font style of text",
        "The movement between slides"
      ],
      "answer": "The movement between slides"
    },
    {
      "question": "What is the purpose of an operating system in a computer?",
      "options": [
        "To create documents",
        "To browse the internet",
        "To manage hardware and software resources",
        "To design graphics"
      ],
      "answer": "To manage hardware and software resources"
    },
    {
      "question": "In Tally, which key is used to post a journal entry?",
      "options": ["F6", "F8", "F7", "F5"],
      "answer": "F7"
    },
    {
      "question": "What does the term 'IP Address' refer to in Internet terminology?",
      "options": [
        "A website hosting service",
        "A file transfer method",
        "A unique address for a device on a network",
        "A type of internet protocol"
      ],
      "answer": "A unique address for a device on a network"
    },
    {
      "question": "In MS Excel, what does the COUNTIF function do?",
      "options": [
        "Sums cells in a range",
        "Counts cells that meet a specific criterion",
        "Averages a range of cells",
        "Finds the minimum value"
      ],
      "answer": "Counts cells that meet a specific criterion"
    },
    {
      "question": "In MS Word, what is the purpose of the 'Thesaurus' tool?",
      "options": [
        "To insert images",
        "To find synonyms for words",
        "To check spelling",
        "To format paragraphs"
      ],
      "answer": "To find synonyms for words"
    },
    {
      "question": "In MS PowerPoint, which option allows you to rehearse slide timings?",
      "options": ["Insert", "Design", "Slide Show", "Review"],
      "answer": "Slide Show"
    },
    {
      "question": "What is the full form of USB in computer terminology?",
      "options": [
        "Unique System Backup",
        "Unified Storage Base",
        "Universal Software Bundle",
        "Universal Serial Bus"
      ],
      "answer": "Universal Serial Bus"
    },
    {
      "question": "In Tally, what is the purpose of the 'Balance Sheet' report?",
      "options": [
        "To track daily sales",
        "To summarize assets, liabilities, and capital",
        "To show all transactions",
        "To manage inventory"
      ],
      "answer": "To summarize assets, liabilities, and capital"
    },
    {
      "question": "What does 'DNS' stand for in Internet terminology?",
      "options": [
        "Digital Network Service",
        "Domain Name System",
        "Dynamic Name Server",
        "Data Node System"
      ],
      "answer": "Domain Name System"
    },
    {
      "question": "In MS Excel, what does the 'Text to Columns' feature do?",
      "options": [
        "Formats text alignment",
        "Merges text from multiple cells",
        "Splits text in a column into multiple columns",
        "Changes text case"
      ],
      "answer": "Splits text in a column into multiple columns"
    },
    {
      "question": "In MS Word, which feature allows you to create a table of contents?",
      "options": [
        "Insert",
        "References",
        "Home",
        "View"
      ],
      "answer": "References"
    },
    {
      "question": "In MS PowerPoint, what is the default slide layout for a new slide?",
      "options": [
        "Blank",
        "Title Slide",
        "Comparison",
        "Title and Content"
      ],
      "answer": "Title and Content"
    },
    {
      "question": "What is a 'byte' in computer terminology?",
      "options": [
        "A storage device",
        "A type of software",
        "A unit of digital information with 8 bits",
        "A computer processor"
      ],
      "answer": "A unit of digital information with 8 bits"
    },
    {
      "question": "In Tally, which key is used to generate a sales voucher?",
      "options": [
        "F5",
        "F6",
        "F9",
        "F8"
      ],
      "answer": "F8"
    },
    {
      "question": "What does the term 'Firewall' refer to in Internet terminology?",
      "options": [
        "A web browser",
        "A security system to protect networks",
        "A file compression tool",
        "A type of email server"
      ],
      "answer": "A security system to protect networks"
    },
    {
      "question": "In MS Excel, what does the CONCATENATE function do?",
      "options": [
        "Sorts data",
        "Joins text from multiple cells",
        "Counts unique values",
        "Creates charts"
      ],
      "answer": "Joins text from multiple cells"
    },
    {
      "question": "In MS Word, what is the shortcut to italicize text?",
      "options": [
        "Ctrl+E",
        "Ctrl+U",
        "Ctrl+I",
        "Ctrl+B"
      ],
      "answer": "Ctrl+I"
    },
    {
      "question": "In MS PowerPoint, what is the purpose of the 'SmartArt' feature?",
      "options": [
        "To insert videos",
        "To create visual diagrams",
        "To format text",
        "To add slide transitions"
      ],
      "answer": "To create visual diagrams"
    },
    {
      "question": "What is the purpose of a web browser in basic computer knowledge?",
      "options": [
        "To manage files",
        "To access and display websites",
        "To edit images",
        "To create presentations"
      ],
      "answer": "To access and display websites"
    },
    {
      "question": "In Tally, what is the purpose of the 'Profit and Loss' statement?",
      "options": [
        "To list all vouchers",
        "To track inventory",
        "To manage ledgers",
        "To show income and expenses"
      ],
      "answer": "To show income and expenses"
    },
    {
      "question": "What does 'FTP' stand for in Internet terminology?",
      "options": [
        "Folder Transfer Path",
        "File Transfer Protocol",
        "Fast Transmission Process",
        "File Tracking Program"
      ],
      "answer": "File Transfer Protocol"
    },
    {
      "question": "In MS Excel, what does the 'Sort' feature do?",
      "options": [
        "Formats text",
        "Arranges data in a specific order",
        "Merges cells",
        "Creates charts"
      ],
      "answer": "Arranges data in a specific order"
    },
    {
      "question": "In MS Word, what is the purpose of the 'Header and Footer' feature?",
      "options": [
        "To format paragraphs",
        "To add text at the top or bottom of every page",
        "To insert images",
        "To create tables"
      ],
      "answer": "To add text at the top or bottom of every page"
    },
    {
      "question": "In MS PowerPoint, which tab contains the 'Slide Sorter' view?",
      "options": [
        "Design",
        "Insert",
        "View",
        "Home"
      ],
      "answer": "View"
    },
    {
      "question": "What is the full form of ROM in computer terminology?",
      "options": [
        "Rapid Operating Module",
        "Read-Only Memory",
        "Random Output Module",
        "Read Output Memory"
      ],
      "answer": "Read-Only Memory"
    },
    {
      "question": "In Tally, what is the shortcut to view the 'Day Book'?",
      "options": [
        "F12",
        "F4",
        "F2",
        "F5"
      ],
      "answer": "F2"
    },
    {
      "question": "What does the term 'Cloud Computing' refer to in Internet terminology?",
      "options": [
        "A programming language",
        "A type of web browser",
        "Storing and accessing data over the internet",
        "A file compression method"
      ],
      "answer": "Storing and accessing data over the internet"
    },
    {
      "question": "In MS Excel, what does the 'AVERAGE' function do?",
      "options": [
        "Sums a range of cells",
        "Calculates the mean of a range of numbers",
        "Counts cells",
        "Finds the maximum value"
      ],
      "answer": "Calculates the mean of a range of numbers"
    },
    {
      "question": "In MS Word, what is the shortcut to underline text?",
      "options": [
        "Ctrl+B",
        "Ctrl+E",
        "Ctrl+U",
        "Ctrl+I"
      ],
      "answer": "Ctrl+U"
    },
    {
      "question": "In MS PowerPoint, what does the 'Presenter View' show?",
      "options": [
        "Slide animations",
        "Audience feedback",
        "Slide notes and a timer",
        "Slide transitions"
      ],
      "answer": "Slide notes and a timer"
    },
    {
      "question": "What is a 'hard drive' in computer terminology?",
      "options": [
        "A network adapter",
        "A storage device for data",
        "A type of processor",
        "A graphics card"
      ],
      "answer": "A storage device for data"
    },
    {
      "question": "In Tally, what is the purpose of a 'Stock Journal'?",
      "options": [
        "To create sales invoices",
        "To record stock transfers or manufacturing",
        "To track payments",
        "To manage ledgers"
      ],
      "answer": "To record stock transfers or manufacturing"
    },
    {
      "question": "What does 'VPN' stand for in Internet terminology?",
      "options": [
        "Verified Packet Node",
        "Virtual Public Network",
        "Virtual Private Network",
        "Variable Protocol Node"
      ],
      "answer": "Virtual Private Network"
    },
    {
      "question": "In MS Excel, what is the purpose of the 'Data Validation' feature?",
      "options": [
        "To create charts",
        "To sort data",
        "To merge cells",
        "To restrict data entry to specific criteria"
      ],
      "answer": "To restrict data entry to specific criteria"
    },
    {
      "question": "In MS Word, what is the purpose of the 'Find and Replace' feature?",
      "options": [
        "To create tables",
        "To insert images",
        "To search for text and replace it with new text",
        "To format text"
      ],
      "answer": "To search for text and replace it with new text"
    },
    {
      "question": "In MS PowerPoint, what is the purpose of the 'Design Ideas' feature?",
      "options": [
        "To insert animations",
        "To suggest slide layouts and designs",
        "To create charts",
        "To add transitions"
      ],
      "answer": "To suggest slide layouts and designs"
    },
    {
      "question": "What is the purpose of a 'modem' in computer terminology?",
      "options": [
        "To store data",
        "To connect a network to the internet",
        "To process graphics",
        "To manage software"
      ],
      "answer": "To connect a network to the internet"
    },
    {
      "question": "In Tally, which key is used to create a payment voucher?",
      "options": [
        "F6",
        "F5",
        "F7",
        "F8"
      ],
      "answer": "F5"
    },
    {
      "question": "What does 'HTML' stand for in Internet terminology?",
      "options": [
        "Hosted Text Markup Language",
        "Hyperlink Text Mode Language",
        "HyperText Markup Language",
        "High Text Media Language"
      ],
      "answer": "HyperText Markup Language"
    },
    {
      "question": "In MS Excel, what does the 'MAX' function do?",
      "options": [
        "Counts cells",
        "Sums a range of cells",
        "Finds the largest value in a range",
        "Averages numbers"
      ],
      "answer": "Finds the largest value in a range"
    },
    {
      "question": "In MS Word, what is the default page orientation?",
      "options": [
        "Square",
        "Portrait",
        "Landscape",
        "Custom"
      ],
      "answer": "Portrait"
    },
    {
      "question": "In MS PowerPoint, what is the shortcut to duplicate a slide?",
      "options": [
        "Ctrl+S",
        "Ctrl+C",
        "Ctrl+D",
        "Ctrl+V"
      ],
      "answer": "Ctrl+D"
    },
    {
      "question": "What is a 'bit' in computer terminology?",
      "options": [
        "A type of software",
        "The smallest unit of digital information",
        "A storage device",
        "A network protocol"
      ],
      "answer": "The smallest unit of digital information"
    },
    {
      "question": "In Tally, what is the purpose of the 'Cash Flow' report?",
      "options": [
        "To track inventory",
        "To show cash inflows and outflows",
        "To list all ledgers",
        "To manage sales"
      ],
      "answer": "To show cash inflows and outflows"
    },
    {
      "question": "What does 'Wi-Fi' stand for in Internet terminology?",
      "options": [
        "Wide Frequency",
        "Wireless Fidelity",
        "Web Interface",
        "Wireless Function"
      ],
      "answer": "Wireless Fidelity"
    },
    {
      "question": "In MS Excel, what is the purpose of the 'Goal Seek' feature?",
      "options": [
        "To sort data",
        "To find the input needed to achieve a specific result",
        "To merge cells",
        "To create charts"
      ],
      "answer": "To find the input needed to achieve a specific result"
    },
    {
      "question": "In MS Word, what is the purpose of the 'Styles' feature?",
      "options": [
        "To insert images",
        "To apply consistent formatting to text",
        "To create tables",
        "To check grammar"
      ],
      "answer": "To apply consistent formatting to text"
    },
    {
      "question": "In MS PowerPoint, what does the 'Reading View' allow you to do?",
      "options": [
        "Edit slide content",
        "View slides in a simplified format",
        "Add animations",
        "Create charts"
      ],
      "answer": "View slides in a simplified format"
    },
    {
      "question": "In basic computer knowledge, what is the purpose of a 'router'?",
      "options": [
        "To store data",
        "To connect multiple networks",
        "To process graphics",
        "To manage software"
      ],
      "answer": "To connect multiple networks"
    },
    {
      "question": "In Tally, which key is used to access the 'Stock Summary' report?",
      "options": [
        "F9",
        "F8",
        "F7",
        "F6"
      ],
      "answer": "F9"
    },
    {
      "question": "What does 'SSL' stand for in Internet terminology?",
      "options": [
        "Secure Socket Layer",
        "System Security Link",
        "Standard Service Layer",
        "Simple Socket Language"
      ],
      "answer": "Secure Socket Layer"
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
export const WE_15 = getRandomQuestions(questions, 30);    