"use client";

import { useState, useEffect } from "react";

const categories = [
  "Basic Computer",
  "MS Word",
  "AutoCAD",
  "Programming",
  "Web Designing",
  "Graphic Designing",
  "Animation",
  "Computer Accountancy",
  "Other",
];

export default function ResourcesPage() {
  const [resources, setResources] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Other",
    publishedDate: "",
    pdfFile: null,
    coverPhoto: null,
  });
  const [editingResource, setEditingResource] = useState(null);
  const [searchName, setSearchName] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch resources
  const fetchResources = async (name = "", category = "") => {
    setIsLoading(true);
    try {
      let url = "/api/resources";
      if (name) url += `?name=${encodeURIComponent(name)}`;
      else if (category) url += `?category=${encodeURIComponent(category)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) setResources(data);
      else setError(data.error || "Failed to fetch resources");
    } catch (err) {
      setError("Error fetching resources");
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchResources();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file input
  const handleFileChange = (e) => {
    if (e.target.name === "pdfFile") {
      setFormData({ ...formData, pdfFile: e.target.files[0] });
    } else {
      setFormData({ ...formData, coverPhoto: e.target.files[0] });
    }
  };

  // Handle form submission (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("category", formData.category);
    if (formData.publishedDate) data.append("publishedDate", formData.publishedDate);
    if (formData.pdfFile) data.append("pdfFile", formData.pdfFile);
    if (formData.coverPhoto) data.append("coverPhoto", formData.coverPhoto);

    try {
      const url = editingResource 
        ? `/api/resources/${editingResource.id}` 
        : "/api/resources";
      const method = editingResource ? "PUT" : "POST";
      
      const res = await fetch(url, { method, body: data });
      const result = await res.json();
      
      if (res.ok) {
        fetchResources();
        resetForm();
      } else {
        setError(result.error || "Failed to save resource");
      }
    } catch (err) {
      setError("Error saving resource: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "Other",
      publishedDate: "",
      pdfFile: null,
      coverPhoto: null,
    });
    setEditingResource(null);
  };

  // Handle edit button click
  const handleEdit = (resource) => {
    setEditingResource(resource);
    setFormData({
      title: resource.title,
      description: resource.description || "",
      category: resource.category,
      publishedDate: resource.publishedDate ? resource.publishedDate.split("T")[0] : "",
      pdfFile: null,
      coverPhoto: null,
    });
  };

  // Handle delete button click
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this resource?")) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/resources/${id}`, { method: "DELETE" });
      const result = await res.json();
      if (res.ok) fetchResources();
      else setError(result.error || "Failed to delete resource");
    } catch (err) {
      setError("Error deleting resource");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search
  const handleSearch = () => {
    fetchResources(searchName, searchCategory);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800 animate-fade-in">
        Resources Management
      </h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 sm:p-6 rounded-lg shadow-lg mb-8 transform transition-all duration-300"
      >
        <h2 className="text-lg sm:text-xl font-semibold mb-4">
          {editingResource ? "Edit Resource" : "Add New Resource"}
        </h2>
        {error && (
          <p className="text-red-500 mb-4 animate-slide-down">{error}</p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title*</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              rows="3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Published Date</label>
            <input
              type="date"
              name="publishedDate"
              value={formData.publishedDate}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              PDF File*
              {editingResource && (
                <span className="text-xs text-gray-500 ml-2">
                  (Leave empty to keep current file)
                </span>
              )}
            </label>
            <input
              type="file"
              name="pdfFile"
              onChange={handleFileChange}
              accept=".pdf"
              className="w-full p-2 border rounded file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-500 file:text-white hover:file:bg-blue-600 transition-all duration-200"
              required={!editingResource}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cover Photo
              {editingResource && (
                <span className="text-xs text-gray-500 ml-2">
                  (Leave empty to keep current photo)
                </span>
              )}
            </label>
            <input
              type="file"
              name="coverPhoto"
              onChange={handleFileChange}
              accept="image/*"
              className="w-full p-2 border rounded file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-500 file:text-white hover:file:bg-blue-600 transition-all duration-200"
            />
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transform hover:scale-105 transition-all duration-200 disabled:opacity-50"
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 mx-auto text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            ) : editingResource ? (
              "Update Resource"
            ) : (
              "Add Resource"
            )}
          </button>
          {editingResource && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transform hover:scale-105 transition-all duration-200"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Search and Filter */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg mb-8 transform transition-all duration-300">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Search Resources</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="p-2 border rounded flex-1 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          />
          <select
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
            className="p-2 border rounded focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transform hover:scale-105 transition-all duration-200 disabled:opacity-50"
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 mx-auto text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            ) : (
              "Search"
            )}
          </button>
        </div>
      </div>

      {/* Resources List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {isLoading ? (
          <div className="col-span-full text-center">
            <svg
              className="animate-spin h-8 w-8 mx-auto text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          </div>
        ) : resources.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">No resources found.</p>
        ) : (
          resources.map((resource, index) => (
            <div
              key={resource.id}
              className="bg-white p-4 rounded-lg shadow-lg transform transition-all duration-500 hover:scale-105 hover:shadow-xl animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {resource.coverPhotoUrl && (
                <img
                  src={resource.coverPhotoUrl}
                  alt={resource.title}
                  className="w-full h-48 object-cover rounded mb-4 transform transition-all duration-300 hover:scale-110"
                />
              )}
              <h3 className="text-base sm:text-lg font-semibold text-gray-800">{resource.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-3">{resource.description}</p>
              <p className="text-sm text-gray-500">Category: {resource.category}</p>
              <p className="text-sm text-gray-500">
                Published: {resource.publishedDate ? new Date(resource.publishedDate).toLocaleDateString() : "N/A"}
              </p>
              <p className="text-sm">
                <a
                  href={resource.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline transition-all duration-200"
                >
                  View PDF (MEGA)
                </a>
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleEdit(resource)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transform hover:scale-105 transition-all duration-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(resource.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transform hover:scale-105 transition-all duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}