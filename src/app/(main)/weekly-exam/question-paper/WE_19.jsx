const getRandomQuestions = (questions, count) => {
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const allQuestions = [
    {
        "question": "In Tally Prime, which feature allows you to track expenses by project or department?",
        "options": ["Ledger Grouping", "Cost Centre", "Voucher Class", "Budget Control"],
        "answer": "Cost Centre"
    },
    {
        "question": "In MS Excel, which function can be used to perform a two-way lookup in a table?",
        "options": ["VLOOKUP", "HLOOKUP", "INDEX with MATCH", "LOOKUP"],
        "answer": "INDEX with MATCH"
    },
    {
        "question": "In Tally, how can you enable multi-currency transactions for a company?",
        "options": ["Gateway of Tally > Accounts Info > Currencies", "F11 > Accounting Features > Enable Multi-Currency", "Gateway of Tally > Inventory Info > Currency Setup", "F12 > Configure > Multi-Currency"],
        "answer": "F11 > Accounting Features > Enable Multi-Currency"
    },
    {
        "question": "In Excel, what does the AGGREGATE function do?",
        "options": ["Combines multiple text strings", "Performs calculations like SUM or AVERAGE while ignoring hidden rows", "Returns the position of a value in a list", "Converts text to numbers"],
        "answer": "Performs calculations like SUM or AVERAGE while ignoring hidden rows"
    },
    {
        "question": "Which Tally shortcut key is used to view the Balance Sheet with detailed transactions?",
        "options": ["Alt + F1", "Ctrl + F1", "F2", "Alt + F2"],
        "answer": "Alt + F1"
    },
    {
        "question": "In Excel, how can you create a dynamic named range that adjusts automatically?",
        "options": ["Use the OFFSET function in Name Manager", "Use the RANGE function", "Define a static range in Formulas", "Use VLOOKUP with a fixed range"],
        "answer": "Use the OFFSET function in Name Manager"
    },
    {
        "question": "In Tally Prime, which voucher type is used to record inter-godown stock transfers?",
        "options": ["Stock Journal", "Delivery Note", "Receipt Note", "Journal Voucher"],
        "answer": "Stock Journal"
    },
    {
        "question": "In Excel, which formula retrieves the last non-blank cell in a column?",
        "options": ["LOOKUP(2,1/(A:A<>''),A:A)", "VLOOKUP('*',A:A,1,FALSE)", "INDEX(A:A,COUNT(A:A))", "MAX(A:A)"],
        "answer": "LOOKUP(2,1/(A:A<>''),A:A)"
    },
    {
        "question": "In Tally, what is the purpose of the ‘Bill-wise Details’ feature?",
        "options": ["To track inventory stock levels", "To manage outstanding receivables and payables", "To generate GST reports", "To create cost centres"],
        "answer": "To manage outstanding receivables and payables"
    },
    {
        "question": "In Excel, what does the FORMULATEXT function return?",
        "options": ["The result of a formula", "The formula itself as text", "The cell reference of a formula", "The sum of values in a range"],
        "answer": "The formula itself as text"
    },
    {
        "question": "In Tally, which report shows the stock valuation based on different methods like FIFO or LIFO?",
        "options": ["Stock Summary", "Inventory Valuation", "Stock Ageing", "Godown Summary"],
        "answer": "Inventory Valuation"
    },
    {
        "question": "In Excel, which feature allows you to restrict cell inputs to a predefined list?",
        "options": ["Conditional Formatting", "Data Validation", "Pivot Table", "Goal Seek"],
        "answer": "Data Validation"
    },
    {
        "question": "In Tally Prime, how can you enable the payroll feature?",
        "options": ["Gateway of Tally > Payroll Info", "F11 > Statutory & Taxation > Enable Payroll", "F12 > Configure > Payroll Settings", "F11 > Accounting Features > Enable Payroll"],
        "answer": "F11 > Accounting Features > Enable Payroll"
    },
    {
        "question": "In Excel, what is the purpose of the TRANSPOSE function?",
        "options": ["Converts text to uppercase", "Switches rows to columns or vice versa", "Replaces text in a string", "Rounds numbers to a specified decimal"],
        "answer": "Switches rows to columns or vice versa"
    },
    {
        "question": "In Tally, which shortcut key is used to export a report to Excel?",
        "options": ["Alt + P", "Alt + E", "Ctrl + E", "F12"],
        "answer": "Alt + E"
    },
    {
        "question": "In Excel, which function calculates the internal rate of return for a series of cash flows?",
        "options": ["NPV", "IRR", "PMT", "FV"],
        "answer": "IRR"
    },
    {
        "question": "In Tally, what is the purpose of the ‘Scenario Management’ feature?",
        "options": ["To track stock movements", "To forecast financial outcomes with provisional entries", "To manage GST compliance", "To reconcile bank statements"],
        "answer": "To forecast financial outcomes with provisional entries"
    },
    {
        "question": "In Excel, how can you extract unique values from a range in Excel 365?",
        "options": ["Use the UNIQUE function", "Use Advanced Filter", "Use VLOOKUP with IF", "Use COUNTIF"],
        "answer": "Use the UNIQUE function"
    },
    {
        "question": "In Tally, which voucher is used to record a transaction involving GST input credit?",
        "options": ["Purchase Voucher", "Journal Voucher", "Payment Voucher", "Contra Voucher"],
        "answer": "Purchase Voucher"
    },
    {
        "question": "In Excel, what does the IFS function do?",
        "options": ["Performs multiple IF conditions in a single formula", "Sums values based on criteria", "Finds the maximum value in a range", "Concatenates text strings"],
        "answer": "Performs multiple IF conditions in a single formula"
    },
    {
        "question": "In Tally, which report displays the details of all GST transactions?",
        "options": ["GSTR-1", "GST Portal", "Tax Ledger", "Statutory Reports"],
        "answer": "Statutory Reports"
    },
    {
        "question": "In Excel, how can you calculate the number of working days between two dates?",
        "options": ["NETWORKDAYS", "DATEDIF", "WORKDAY", "DAYS"],
        "answer": "NETWORKDAYS"
    },
    {
        "question": "In Tally, what is the shortcut key to access the ‘Stock Summary’ report?",
        "options": ["F5", "Alt + F5", "F7", "Alt + F7"],
        "answer": "Alt + F5"
    },
    {
        "question": "In Excel, which function rounds a number to the nearest multiple of a specified value?",
        "options": ["ROUND", "MROUND", "CEILING", "FLOOR"],
        "answer": "MROUND"
    },
    {
        "question": "In Tally, how can you enable cost tracking for inventory items?",
        "options": ["F12 > Inventory Features > Cost Tracking", "F11 > Inventory Features > Enable Cost Tracking", "Gateway of Tally > Stock Items > Cost Tracking", "F12 > Configure > Inventory Settings"],
        "answer": "F11 > Inventory Features > Enable Cost Tracking"
    },
    {
        "question": "In Excel, what does the XLOOKUP function improve over VLOOKUP?",
        "options": ["Only works with sorted data", "Allows bidirectional lookups and exact matches", "Supports text concatenation", "Calculates averages"],
        "answer": "Allows bidirectional lookups and exact matches"
    },
    {
        "question": "In Tally, which feature allows you to split company data into multiple financial periods?",
        "options": ["Backup Data", "Split Company Data", "Export Data", "Alter Company"],
        "answer": "Split Company Data"
    },
    {
        "question": "In Excel, how can you create a dynamic chart that updates automatically?",
        "options": ["Use a Pivot Table as the chart source", "Use a static range for the chart", "Use VLOOKUP for chart data", "Use CONCATENATE for chart labels"],
        "answer": "Use a Pivot Table as the chart source"
    },
    {
        "question": "In Tally, which shortcut key is used to create a new ledger during voucher entry?",
        "options": ["Alt + C", "Ctrl + C", "F11", "Alt + F1"],
        "answer": "Alt + C"
    },
    {
        "question": "In Excel, what is the purpose of the POWER function?",
        "options": ["Raises a number to a specified power", "Calculates the square root", "Returns the absolute value", "Converts text to numbers"],
        "answer": "Raises a number to a specified power"
    },
    {
        "question": "In Tally, which report shows the movement of stock between godowns?",
        "options": ["Stock Journal", "Godown Summary", "Stock Transfer Report", "Inventory Ledger"],
        "answer": "Godown Summary"
    },
    {
        "question": "In Excel, which function calculates the payment for a loan based on constant payments?",
        "options": ["PV", "FV", "PMT", "RATE"],
        "answer": "PMT"
    },
    {
        "question": "In Tally, how can you generate a report for outstanding payments?",
        "options": ["Display > Bills Payable", "Display > Outstandings > Payables", "Gateway of Tally > Ledger Report", "F12 > Outstandings"],
        "answer": "Display > Outstandings > Payables"
    },
    {
        "question": "In Excel, what does the LET function do in Excel 365?",
        "options": ["Assigns names to calculation results for reuse in a formula", "Replaces text in a string", "Filters data based on criteria", "Combines multiple ranges"],
        "answer": "Assigns names to calculation results for reuse in a formula"
    },
    {
        "question": "In Tally, which feature allows you to create multiple price levels for stock items?",
        "options": ["Price List", "Stock Category", "Cost Centre", "Batch-wise Details"],
        "answer": "Price List"
    },
    {
        "question": "In Excel, how can you extract the day of the week from a date?",
        "options": ["WEEKDAY", "DAY", "MONTH", "TODAY"],
        "answer": "WEEKDAY"
    },
    {
        "question": "In Tally, what is the purpose of the ‘Optional Voucher’ feature?",
        "options": ["To create temporary vouchers that do not affect accounts", "To lock vouchers from editing", "To generate GST reports", "To split company data"],
        "answer": "To create temporary vouchers that do not affect accounts"
    },
    {
        "question": "In Excel, which function combines multiple conditions with AND logic?",
        "options": ["IF", "AND", "OR", "NOT"],
        "answer": "AND"
    },
    {
        "question": "In Tally, which shortcut key is used to view the ‘Trial Balance’ report?",
        "options": ["F6", "F5", "Alt + F6", "Alt + F5"],
        "answer": "Alt + F6"
    },
    {
        "question": "In Excel, what is the purpose of the FORECAST.LINEAR function?",
        "options": ["Predicts a future value based on linear regression", "Calculates the average of a range", "Rounds numbers to a specified decimal", "Converts text to numbers"],
        "answer": "Predicts a future value based on linear regression"
    },
    {
        "question": "In Tally, how can you enable batch-wise stock tracking?",
        "options": ["F12 > Inventory Features > Batch-wise Details", "F11 > Inventory Features > Enable Batch-wise Details", "Gateway of Tally > Stock Items > Batch Settings", "F12 > Configure > Stock Settings"],
        "answer": "F11 > Inventory Features > Enable Batch-wise Details"
    },
    {
        "question": "In Excel, which function splits text into an array based on a delimiter?",
        "options": ["TEXTSPLIT", "TEXTJOIN", "SUBSTITUTE", "FIND"],
        "answer": "TEXTSPLIT"
    },
    {
        "question": "In Tally, which report provides details of stock items below reorder level?",
        "options": ["Stock Summary", "Reorder Status", "Stock Ageing", "Godown Summary"],
        "answer": "Reorder Status"
    },
    {
        "question": "In Excel, what is the purpose of the SEQUENCE function in Excel 365?",
        "options": ["Generates a list of sequential numbers", "Sorts data in a range", "Filters data based on criteria", "Combines text strings"],
        "answer": "Generates a list of sequential numbers"
    },
    {
        "question": "In Tally, which voucher type is used to record a fixed asset purchase?",
        "options": ["Purchase Voucher", "Journal Voucher", "Payment Voucher", "Contra Voucher"],
        "answer": "Purchase Voucher"
    },
    {
        "question": "In Excel, how can you calculate the correlation coefficient between two data sets?",
        "options": ["CORREL", "COVAR", "PEARSON", "SLOPE"],
        "answer": "CORREL"
    },
    {
        "question": "In Tally, what is the shortcut key to access the ‘GST Portal’ for filing returns?",
        "options": ["Ctrl + G", "Alt + G", "F12", "Alt + F12"],
        "answer": "Alt + G"
    },
    {
        "question": "In Excel, which function calculates the net present value of cash flows?",
        "options": ["NPV", "IRR", "PV", "FV"],
        "answer": "NPV"
    },
    {
        "question": "In Tally, which feature allows you to create budgets for ledgers or groups?",
        "options": ["Cost Centre", "Budgets", "Scenario Management", "Voucher Class"],
        "answer": "Budgets"
    },
    {
        "question": "In Excel, what does the FILTER function do in Excel 365?",
        "options": ["Returns a filtered range based on specified criteria", "Combines multiple ranges", "Sorts data in ascending order", "Replaces text in a string"],
        "answer": "Returns a filtered range based on specified criteria"
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
export const WE_19 = getRandomQuestions(questions, 30);    