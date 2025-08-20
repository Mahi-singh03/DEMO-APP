import { FiUser, FiUpload } from 'react-icons/fi';

const PhotoUpload = ({ previewUrl, onFileChange, currentPhoto }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileChange(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        // This would typically be handled by the parent component
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="sm:col-span-1 flex flex-col items-center">
      <div className="relative h-32 w-32 rounded-full bg-gray-200 overflow-hidden border-4 border-white shadow">
        {previewUrl ? (
          <img src={previewUrl} alt="Student" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-gray-400">
            <FiUser className="h-16 w-16" />
          </div>
        )}
      </div>
      <label className="mt-3 inline-flex items-center px-3 py-1 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer">
        <FiUpload className="mr-1" /> Upload
        <input
          type="file"
          className="sr-only"
          onChange={handleFileChange}
          accept="image/*"
        />
      </label>
    </div>
  );
};

export default PhotoUpload;