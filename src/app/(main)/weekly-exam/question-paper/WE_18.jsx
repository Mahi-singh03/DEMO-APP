const getRandomQuestions = (questions, count) => {
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const allQuestions = [
    {
        "question": "In MS Word, which feature allows you to create a dynamic table of contents that updates automatically?",
        "options": ["Insert > Table", "References > Table of Contents", "Layout > Contents", "View > Document Map"],
        "answer": "References > Table of Contents"
    },
    {
        "question": "What is the purpose of the 'Hyper-V' feature in Windows?",
        "options": ["To manage network connections", "To create and manage virtual machines", "To optimize system performance", "To encrypt files"],
        "answer": "To create and manage virtual machines"
    },
    {
        "question": "Which Internet protocol is used to securely transfer files between a local and a remote host?",
        "options": ["FTP", "SFTP", "HTTP", "SMTP"],
        "answer": "SFTP"
    },
    {
        "question": "In MS Word, how can you track changes made by multiple users in a document?",
        "options": ["Review > Track Changes", "View > Markup", "Insert > Comments", "Home > Edit Tracking"],
        "answer": "Review > Track Changes"
    },
    {
        "question": "In computer systems, what does RAID Level 5 provide?",
        "options": ["Data mirroring", "Data striping with distributed parity", "Data backup", "Data encryption"],
        "answer": "Data striping with distributed parity"
    },
    {
        "question": "Which Internet standard is used for secure communication over a computer network?",
        "options": ["HTTP", "TLS", "FTP", "POP3"],
        "answer": "TLS"
    },
    {
        "question": "In MS Word, what is the purpose of the 'Mail Merge' feature?",
        "options": ["To combine multiple documents", "To create personalized documents using a data source", "To split a document into sections", "To encrypt document content"],
        "answer": "To create personalized documents using a data source"
    },
    {
        "question": "What is the function of a computer's BIOS?",
        "options": ["Manages network protocols", "Controls peripheral devices", "Initializes hardware during boot", "Encrypts system files"],
        "answer": "Initializes hardware during boot"
    },
    {
        "question": "Which Internet tool is used to resolve domain names to IP addresses?",
        "options": ["DNS", "DHCP", "SNMP", "ICMP"],
        "answer": "DNS"
    },
    {
        "question": "In MS Word, which shortcut key is used to apply the 'Heading 1' style?",
        "options": ["Ctrl + Alt + 1", "Ctrl + Shift + H", "Alt + H", "Ctrl + 1"],
        "answer": "Ctrl + Alt + 1"
    },
    {
        "question": "What is the purpose of a computer's cache memory?",
        "options": ["To store permanent data", "To provide fast access to frequently used data", "To manage network traffic", "To encrypt system files"],
        "answer": "To provide fast access to frequently used data"
    },
    {
        "question": "Which Internet protocol is used for sending emails?",
        "options": ["IMAP", "POP3", "SMTP", "HTTP"],
        "answer": "SMTP"
    },
    {
        "question": "In MS Word, how can you protect a document with a password?",
        "options": ["File > Info > Protect Document", "Review > Restrict Editing", "Home > Security", "Insert > Protect"],
        "answer": "File > Info > Protect Document"
    },
    {
        "question": "What does the term 'overclocking' refer to in computing?",
        "options": ["Increasing CPU clock speed beyond specifications", "Reducing system power consumption", "Optimizing network bandwidth", "Encrypting processor data"],
        "answer": "Increasing CPU clock speed beyond specifications"
    },
    {
        "question": "Which Internet technology allows secure remote access to a private network?",
        "options": ["VPN", "FTP", "HTTP", "Telnet"],
        "answer": "VPN"
    },
    {
        "question": "In MS Word, what does the 'Format Painter' tool do?",
        "options": ["Copies formatting from one section to another", "Changes font size", "Inserts images", "Creates tables"],
        "answer": "Copies formatting from one section to another"
    },
    {
        "question": "What is the role of a computer's GPU?",
        "options": ["Manages system memory", "Handles graphics rendering", "Controls network traffic", "Encrypts data"],
        "answer": "Handles graphics rendering"
    },
    {
        "question": "Which Internet protocol is used for retrieving emails from a server?",
        "options": ["SMTP", "IMAP", "HTTP", "FTP"],
        "answer": "IMAP"
    },
    {
        "question": "In MS Word, which feature allows you to create reusable document templates?",
        "options": ["Themes", "Styles", "Templates", "Macros"],
        "answer": "Templates"
    },
    {
        "question": "What is the purpose of a computer's registry in Windows?",
        "options": ["Stores system and application settings", "Manages network connections", "Encrypts user data", "Controls hardware drivers"],
        "answer": "Stores system and application settings"
    },
    {
        "question": "What is the function of a Content Delivery Network (CDN) on the Internet?",
        "options": ["Encrypts web traffic", "Delivers content from servers closer to the user", "Manages domain names", "Blocks malicious websites"],
        "answer": "Delivers content from servers closer to the user"
    },
    {
        "question": "In MS Word, which shortcut key opens the 'Find and Replace' dialog box?",
        "options": ["Ctrl + H", "Ctrl + F", "Alt + F", "Ctrl + R"],
        "answer": "Ctrl + H"
    },
    {
        "question": "What is the purpose of a computer's virtual memory?",
        "options": ["To store permanent data", "To extend RAM using disk space", "To manage network connections", "To optimize CPU performance"],
        "answer": "To extend RAM using disk space"
    },
    {
        "question": "Which Internet protocol is used for real-time communication, such as VoIP?",
        "options": ["HTTP", "RTP", "FTP", "SNMP"],
        "answer": "RTP"
    },
    {
        "question": "In MS Word, how can you insert a section break to start a new page?",
        "options": ["Insert > Break", "Layout > Breaks > Next Page", "Home > Section", "View > Page Break"],
        "answer": "Layout > Breaks > Next Page"
    },
    {
        "question": "What is the function of a computer's motherboard?",
        "options": ["Stores user files", "Connects and communicates between hardware components", "Manages network traffic", "Encrypts data"],
        "answer": "Connects and communicates between hardware components"
    },
    {
        "question": "Which Internet standard is used to secure websites with HTTPS?",
        "options": ["SSL/TLS", "FTP", "SMTP", "DHCP"],
        "answer": "SSL/TLS"
    },
    {
        "question": "In MS Word, what is the purpose of the 'Styles' pane?",
        "options": ["To manage document themes", "To apply consistent formatting to text", "To insert images", "To create macros"],
        "answer": "To apply consistent formatting to text"
    },
    {
        "question": "What does the term 'bottleneck' refer to in computing?",
        "options": ["A component limiting system performance", "A network security issue", "A software encryption method", "A type of storage device"],
        "answer": "A component limiting system performance"
    },
    {
        "question": "Which Internet protocol dynamically assigns IP addresses to devices?",
        "options": ["DNS", "DHCP", "FTP", "HTTP"],
        "answer": "DHCP"
    },
    {
        "question": "In MS Word, which feature allows you to record a series of actions for automation?",
        "options": ["Macros", "Templates", "Styles", "Themes"],
        "answer": "Macros"
    },
    {
        "question": "What is the purpose of a computer's SSD compared to an HDD?",
        "options": ["Slower data access", "Higher storage capacity", "Faster data access using flash memory", "Manages network connections"],
        "answer": "Faster data access using flash memory"
    },
    {
        "question": "What is the role of a proxy server on the Internet?",
        "options": ["Encrypts all web traffic", "Acts as an intermediary between client and server", "Manages domain names", "Stores website content"],
        "answer": "Acts as an intermediary between client and server"
    },
    {
        "question": "In MS Word, how can you insert a footnote in a document?",
        "options": ["Insert > Footnote", "References > Insert Footnote", "Home > Note", "View > Footnote"],
        "answer": "References > Insert Footnote"
    },
    {
        "question": "What is the purpose of a computer's DMA (Direct Memory Access)?",
        "options": ["To encrypt data", "To allow hardware to access memory directly", "To manage network traffic", "To store user files"],
        "answer": "To allow hardware to access memory directly"
    },
    {
        "question": "Which Internet protocol is used for network management and monitoring?",
        "options": ["SNMP", "FTP", "HTTP", "IMAP"],
        "answer": "SNMP"
    },
    {
        "question": "In MS Word, what does the 'SmartArt' feature allow you to create?",
        "options": ["Dynamic charts", "Visual diagrams and graphics", "Automated tables", "Encrypted documents"],
        "answer": "Visual diagrams and graphics"
    },
    {
        "question": "What is the role of a computer's kernel?",
        "options": ["Manages user applications", "Controls core operating system functions", "Encrypts system files", "Manages network connections"],
        "answer": "Controls core operating system functions"
    },
    {
        "question": "What is the purpose of the Internet's BGP (Border Gateway Protocol)?",
        "options": ["Encrypts web traffic", "Routes data between autonomous systems", "Manages email delivery", "Resolves domain names"],
        "answer": "Routes data between autonomous systems"
    },
    {
        "question": "In MS Word, which shortcut key aligns text to the center?",
        "options": ["Ctrl + E", "Ctrl + J", "Ctrl + L", "Ctrl + R"],
        "answer": "Ctrl + E"
    },
    {
        "question": "What is the function of a computer's interrupt in a CPU?",
        "options": ["To store data", "To signal the CPU to handle an event", "To manage network traffic", "To encrypt files"],
        "answer": "To signal the CPU to handle an event"
    },
    {
        "question": "Which Internet protocol is used for time synchronization across networks?",
        "options": ["NTP", "FTP", "HTTP", "SMTP"],
        "answer": "NTP"
    },
    {
        "question": "In MS Word, how can you restrict editing to specific parts of a document?",
        "options": ["Review > Restrict Editing", "File > Protect Document", "Home > Lock", "Insert > Restrict"],
        "answer": "Review > Restrict Editing"
    },
    {
        "question": "What is the purpose of a computer's paging file?",
        "options": ["To manage network connections", "To act as virtual memory on disk", "To store permanent data", "To encrypt system files"],
        "answer": "To act as virtual memory on disk"
    },
    {
        "question": "What is the role of an Internet firewall?",
        "options": ["Manages domain names", "Blocks unauthorized network traffic", "Delivers web content", "Encrypts all data"],
        "answer": "Blocks unauthorized network traffic"
    },
    {
        "question": "In MS Word, which feature allows you to create a custom dictionary for spell-checking?",
        "options": ["File > Options > Proofing", "Review > Spelling > Custom Dictionary", "Home > Dictionary", "Insert > Spell Check"],
        "answer": "File > Options > Proofing"
    },
    {
        "question": "What does the term 'multithreading' refer to in computing?",
        "options": ["Running multiple applications", "Executing multiple threads within a process", "Managing network connections", "Encrypting data"],
        "answer": "Executing multiple threads within a process"
    },
    {
        "question": "Which Internet protocol is used for remote terminal access?",
        "options": ["FTP", "SSH", "HTTP", "SMTP"],
        "answer": "SSH"
    },
    {
        "question": "In MS Word, what is the purpose of the 'Quick Parts' feature?",
        "options": ["To insert reusable content like text or images", "To create charts", "To manage document themes", "To encrypt documents"],
        "answer": "To insert reusable content like text or images"
    },
    {
        "question": "What is the role of a computer's firmware?",
        "options": ["Manages user applications", "Provides low-level control for hardware", "Encrypts system files", "Manages network traffic"],
        "answer": "Provides low-level control for hardware"
    },
    {
        "question": "What is the purpose of the Internet's ICMP protocol?",
        "options": ["Delivers web content", "Diagnoses network issues", "Manages email delivery", "Encrypts data"],
        "answer": "Diagnoses network issues"
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
export const WE_18 = getRandomQuestions(questions, 30);    