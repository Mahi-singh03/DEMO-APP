import { FiPlus, FiTrash2 } from 'react-icons/fi';

const InstallmentManager = ({ feeDetails, onFeeDetailsChange }) => {
  const addInstallment = () => {
    const newInstallment = {
      amount: 0,
      submissionDate: new Date().toISOString().split('T')[0],
      paid: false
    };
    
    onFeeDetailsChange({
      ...feeDetails,
      installmentDetails: [...feeDetails.installmentDetails, newInstallment],
      installments: feeDetails.installmentDetails.length + 1
    });
  };

  const removeInstallment = (index) => {
    const newInstallments = [...feeDetails.installmentDetails];
    newInstallments.splice(index, 1);
    
    onFeeDetailsChange({
      ...feeDetails,
      installmentDetails: newInstallments,
      installments: newInstallments.length
    });
  };

  const updateInstallment = (index, field, value) => {
    const newInstallments = [...feeDetails.installmentDetails];
    newInstallments[index] = {
      ...newInstallments[index],
      [field]: value
    };
    
    onFeeDetailsChange({
      ...feeDetails,
      installmentDetails: newInstallments
    });
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Total Fees (₹)</label>
          <input
            type="number"
            value={feeDetails.totalFees || 0}
            onChange={(e) => onFeeDetailsChange({
              ...feeDetails,
              totalFees: parseFloat(e.target.value)
            })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Remaining Fees (₹)</label>
          <input
            type="number"
            value={feeDetails.remainingFees || 0}
            onChange={(e) => onFeeDetailsChange({
              ...feeDetails,
              remainingFees: parseFloat(e.target.value)
            })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="flex justify-between items-center mb-2">
        <h4 className="text-sm font-medium text-gray-700">Installment Details</h4>
        <button
          type="button"
          onClick={addInstallment}
          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FiPlus className="mr-1" /> Add Installment
        </button>
      </div>

      {feeDetails.installmentDetails.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-4">No installments added yet</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {feeDetails.installmentDetails.map((installment, index) => (
                <tr key={index}>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={installment.amount}
                      onChange={(e) => updateInstallment(index, 'amount', parseFloat(e.target.value))}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="date"
                      value={installment.submissionDate?.split('T')[0] || ''}
                      onChange={(e) => updateInstallment(index, 'submissionDate', e.target.value)}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={installment.paid}
                        onChange={(e) => updateInstallment(index, 'paid', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">{installment.paid ? 'Paid' : 'Pending'}</span>
                    </label>
                  </td>
                  <td className="px-3 py-2">
                    <button
                      type="button"
                      onClick={() => removeInstallment(index)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default InstallmentManager;