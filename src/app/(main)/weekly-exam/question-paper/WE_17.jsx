const getRandomQuestions = (questions, count) => {
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const allQuestions = [
    {
      "question": "In Tally, which feature is used to track additional costs incurred on inventory, such as freight or insurance?",
      "options": ["Cost Centres", "Cost Categories", "Additional Cost of Purchase", "Inventory Vouchers"],
      "answer": "Additional Cost of Purchase"
    },
    {
      "question": "In MS Excel, which function returns the position of a value in a range?",
      "options": ["VLOOKUP", "INDEX", "MATCH", "FIND"],
      "answer": "MATCH"
    },
    {
      "question": "In Tally, how can you enable the use of multiple currencies in a company?",
      "options": ["Gateway of Tally > Accounts Info > Currencies", "Gateway of Tally > Inventory Info > Units", "F11: Features > Accounting Features", "F12: Configure > General"],
      "answer": "F11: Features > Accounting Features"
    },
    {
      "question": "In MS Excel, what does the IFERROR function do?",
      "options": ["Checks if a cell is empty", "Returns a value if a formula results in an error", "Rounds a number to a specified decimal", "Counts cells with errors"],
      "answer": "Returns a value if a formula results in an error"
    },
    {
      "question": "In Tally, which voucher type is used to record the payment made to a supplier?",
      "options": ["Sales Voucher", "Payment Voucher", "Receipt Voucher", "Contra Voucher"],
      "answer": "Payment Voucher"
    },
    {
      "question": "In MS Excel, which feature allows you to analyze data by creating summarized reports from large datasets?",
      "options": ["Conditional Formatting", "PivotTable", "Data Validation", "Goal Seek"],
      "answer": "PivotTable"
    },
    {
      "question": "In Tally, what is the purpose of the 'Cost Centre' feature?",
      "options": ["To track inventory stock", "To allocate expenses to specific departments or projects", "To manage tax calculations", "To create financial statements"],
      "answer": "To allocate expenses to specific departments or projects"
    },
    {
      "question": "In MS Excel, what is the correct syntax to sum values in cells A1 to A10 only if B1 to B10 are greater than 50?",
      "options": ["=SUMIF(A1:A10, \">50\", B1:B10)", "=SUMIF(B1:B10, \">50\", A1:A10)", "=SUM(A1:A10, B1:B10>50)", "=SUMIFS(A1:A10, B1:B10>50)"],
      "answer": "=SUMIF(B1:B10, \">50\", A1:A10)"
    },
    {
      "question": "In Tally, which report displays the outstanding receivables from customers?",
      "options": ["Balance Sheet", "Ledger Outstandings", "Profit & Loss A/c", "Stock Summary"],
      "answer": "Ledger Outstandings"
    },
    {
      "question": "In MS Excel, which shortcut key copies the value from the cell above the active cell?",
      "options": ["Ctrl+D", "Ctrl+R", "Ctrl+Shift+\"", "Ctrl+'"],
      "answer": "Ctrl+'"
    },
    {
      "question": "In Tally, how can you enable GST compliance for a company?",
      "options": ["Gateway of Tally > Create > Ledger", "F11: Features > Statutory & Taxation", "F12: Configure > General", "Gateway of Tally > Display > Statutory Reports"],
      "answer": "F11: Features > Statutory & Taxation"
    },
    {
      "question": "In MS Excel, what does the VLOOKUP function do when the range_lookup parameter is set to FALSE?",
      "options": ["Returns an approximate match", "Returns an exact match", "Searches horizontally", "Returns the last value"],
      "answer": "Returns an exact match"
    },
    {
      "question": "In Tally, which voucher is used to record goods returned by a customer?",
      "options": ["Credit Note", "Debit Note", "Sales Voucher", "Purchase Voucher"],
      "answer": "Credit Note"
    },
    {
      "question": "In MS Excel, which function combines text from multiple cells into one cell?",
      "options": ["TEXTJOIN", "CONCATENATE", "MERGE", "JOIN"],
      "answer": "TEXTJOIN"
    },
    {
      "question": "In Tally, what is the purpose of the 'Stock Journal' voucher?",
      "options": ["To record sales transactions", "To transfer stock between godowns", "To record cash payments", "To adjust tax liabilities"],
      "answer": "To transfer stock between godowns"
    },
    {
      "question": "In MS Excel, what does the 'Freeze Panes' feature do?",
      "options": ["Locks formulas in cells", "Keeps rows or columns visible while scrolling", "Prevents data entry in selected cells", "Formats cells automatically"],
      "answer": "Keeps rows or columns visible while scrolling"
    },
    {
      "question": "In Tally, which report provides a summary of inventory movements?",
      "options": ["Stock Summary", "Day Book", "Trial Balance", "Cash Flow Statement"],
      "answer": "Stock Summary"
    },
    {
      "question": "In MS Excel, which function counts the number of cells that meet multiple criteria?",
      "options": ["COUNT", "COUNTA", "COUNTIF", "COUNTIFS"],
      "answer": "COUNTIFS"
    },
    {
      "question": "In Tally, how can you enable payroll processing for a company?",
      "options": ["F12: Configure > Payroll", "F11: Features > Accounting Features", "Gateway of Tally > Payroll Info", "F11: Features > Statutory & Taxation"],
      "answer": "F11: Features > Accounting Features"
    },
    {
      "question": "In MS Excel, what is the purpose of the 'What-If Analysis' tool?",
      "options": ["To create charts", "To test scenarios and predict outcomes", "To sort data", "To filter data"],
      "answer": "To test scenarios and predict outcomes"
    },
    {
      "question": "In Tally, which key is used to duplicate a voucher entry?",
      "options": ["Alt+2", "Ctrl+D", "Alt+D", "Ctrl+2"],
      "answer": "Alt+2"
    },
    {
      "question": "In MS Excel, what does the '$' symbol in a cell reference like $A$1 indicate?",
      "options": ["Relative reference", "Absolute reference", "Mixed reference", "Dynamic reference"],
      "answer": "Absolute reference"
    },
    {
      "question": "In Tally, which feature allows you to track expenses by project or department?",
      "options": ["Budgeting", "Cost Centre", "Ledger Grouping", "Inventory Tracking"],
      "answer": "Cost Centre"
    },
    {
      "question": "In MS Excel, which function returns the current date and time?",
      "options": ["TODAY()", "NOW()", "DATE()", "TIME()"],
      "answer": "NOW()"
    },
    {
      "question": "In Tally, what is the purpose of the 'Contra Voucher'?",
      "options": ["To record sales", "To record bank or cash transactions between accounts", "To adjust inventory", "To record purchases"],
      "answer": "To record bank or cash transactions between accounts"
    },
    {
      "question": "In MS Excel, which tool is used to find the input value needed to achieve a specific goal?",
      "options": ["Solver", "Goal Seek", "Data Table", "Scenario Manager"],
      "answer": "Goal Seek"
    },
    {
      "question": "In Tally, which report shows the profit or loss for a specific period?",
      "options": ["Balance Sheet", "Profit & Loss A/c", "Trial Balance", "Cash Flow Statement"],
      "answer": "Profit & Loss A/c"
    },
    {
      "question": "In MS Excel, what does the 'Data Validation' feature do?",
      "options": ["Formats cells based on conditions", "Restricts data entry to specific criteria", "Summarizes data in tables", "Sorts data automatically"],
      "answer": "Restricts data entry to specific criteria"
    },
    {
      "question": "In Tally, how can you generate a GST-compliant invoice?",
      "options": ["Enable GST in F11 > Statutory & Taxation", "Use F12 > Configure > Invoice", "Create a new ledger", "Modify the sales voucher type"],
      "answer": "Enable GST in F11 > Statutory & Taxation"
    },
    {
      "question": "In MS Excel, which function rounds a number up to the nearest whole number?",
      "options": ["ROUND", "ROUNDUP", "ROUNDDOWN", "CEILING"],
      "answer": "ROUNDUP"
    },
    {
      "question": "In Tally, which key is used to post a voucher to the ledger?",
      "options": ["Ctrl+Enter", "Alt+Enter", "Ctrl+P", "Alt+P"],
      "answer": "Ctrl+Enter"
    },
    {
      "question": "In MS Excel, what is the purpose of a 'Named Range'?",
      "options": ["To format cells", "To assign a name to a cell or range for easier reference", "To create charts", "To filter data"],
      "answer": "To assign a name to a cell or range for easier reference"
    },
    {
      "question": "In Tally, which feature is used to manage stock items with different units of measure?",
      "options": ["Stock Groups", "Units of Measure", "Godown Management", "Batch-wise Details"],
      "answer": "Units of Measure"
    },
    {
      "question": "In MS Excel, which function returns the largest value in a range?",
      "options": ["MAX", "LARGE", "MIN", "AVERAGE"],
      "answer": "MAX"
    },
    {
      "question": "In Tally, what is the purpose of the 'Optional Voucher' feature?",
      "options": ["To delete a voucher", "To create a temporary voucher not affecting accounts", "To print a voucher", "To modify a ledger"],
      "answer": "To create a temporary voucher not affecting accounts"
    },
    {
      "question": "In MS Excel, what does the 'AND' function do?",
      "options": ["Combines text strings", "Checks if all conditions are true", "Counts cells with text", "Sums values based on criteria"],
      "answer": "Checks if all conditions are true"
    },
    {
      "question": "In Tally, which report shows the details of all transactions for a specific ledger?",
      "options": ["Day Book", "Ledger Voucher Report", "Stock Summary", "Trial Balance"],
      "answer": "Ledger Voucher Report"
    },
    {
      "question": "In MS Excel, which shortcut key selects an entire row?",
      "options": ["Ctrl+Space", "Shift+Space", "Ctrl+Shift+Arrow", "Alt+Space"],
      "answer": "Shift+Space"
    },
    {
      "question": "In Tally, how can you enable batch-wise details for inventory?",
      "options": ["F12: Configure > Inventory", "F11: Features > Inventory Features", "Gateway of Tally > Create > Stock Item", "F12: Configure > General"],
      "answer": "F11: Features > Inventory Features"
    },
    {
      "question": "In MS Excel, what is the purpose of the 'Conditional Formatting' feature?",
      "options": ["To restrict data entry", "To highlight cells based on specific rules", "To create pivot tables", "To sort data"],
      "answer": "To highlight cells based on specific rules"
    },
    {
      "question": "In Tally, which voucher is used to record goods returned to a supplier?",
      "options": ["Credit Note", "Debit Note", "Purchase Voucher", "Receipt Voucher"],
      "answer": "Debit Note"
    },
    {
      "question": "In MS Excel, which function calculates the average of a range of cells?",
      "options": ["SUM", "AVERAGE", "MEAN", "MEDIAN"],
      "answer": "AVERAGE"
    },
    {
      "question": "In Tally, which feature allows you to set a credit limit for a customer?",
      "options": ["Ledger Creation", "Cost Centre", "Budgeting", "Credit Control"],
      "answer": "Ledger Creation"
    },
    {
      "question": "In MS Excel, what does the 'HLOOKUP' function do?",
      "options": ["Searches vertically in a column", "Searches horizontally in a row", "Counts cells with text", "Sums values in a range"],
      "answer": "Searches horizontally in a row"
    },
    {
      "question": "In Tally, which report displays the ageing analysis of receivables?",
      "options": ["Stock Ageing", "Bills Receivable", "Trial Balance", "Cash Flow Statement"],
      "answer": "Bills Receivable"
    },
    {
      "question": "In MS Excel, which function extracts a substring from a text string?",
      "options": ["LEFT", "TRIM", "LEN", "CONCAT"],
      "answer": "LEFT"
    },
    {
      "question": "In Tally, what is the purpose of the 'Godown' feature?",
      "options": ["To manage tax rates", "To track inventory in different locations", "To create ledgers", "To generate invoices"],
      "answer": "To track inventory in different locations"
    },
    {
      "question": "In MS Excel, what does the 'SUMIFS' function do?",
      "options": ["Sums values based on a single criterion", "Sums values based on multiple criteria", "Counts cells with numbers", "Averages values in a range"],
      "answer": "Sums values based on multiple criteria"
    },
    {
      "question": "In Tally, which key is used to cancel a voucher entry?",
      "options": ["Ctrl+C", "Alt+X", "Ctrl+X", "Alt+C"],
      "answer": "Alt+X"
    },
    {
      "question": "In MS Excel, which feature allows you to record and automate repetitive tasks?",
      "options": ["PivotTable", "Macro", "Data Validation", "Conditional Formatting"],
      "answer": "Macro"
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
export const WE_17 = getRandomQuestions(questions, 30);    