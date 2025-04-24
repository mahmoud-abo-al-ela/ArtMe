function ArtworkDetails({ formData, handleChange, categories, isMobile }) {
  const idSuffix = isMobile ? "" : "-desktop";
  const inputPadding = isMobile ? "py-2.5" : "py-3";
  const rows = isMobile ? 3 : 4;
  const descriptionPlaceholder = isMobile
    ? "Describe your artwork"
    : "Describe your artwork (media, inspiration, context...)";
  const spacing = isMobile ? "space-y-4" : "space-y-6";

  return (
    <div className={spacing}>
      <div>
        <label
          htmlFor={`title${idSuffix}`}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id={`title${idSuffix}`}
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="Enter artwork title"
          className={`w-full bg-gray-100 text-black border-gray-300 rounded-lg shadow-sm px-4 ${inputPadding} outline-none border-0 focus:border-1 focus:border-indigo-500 focus:ring-indigo-500`}
        />
      </div>

      <div>
        <label
          htmlFor={`category${idSuffix}`}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Category <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <select
            id={`category${idSuffix}`}
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className={`w-full bg-gray-100 text-black border-gray-300 rounded-lg shadow-sm px-4 ${inputPadding} outline-none border-0 focus:border-1 focus:border-indigo-500 focus:ring-indigo-500`}
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor={`description${idSuffix}`}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description <span className="text-gray-500">(optional)</span>
        </label>
        <textarea
          id={`description${idSuffix}`}
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={rows}
          placeholder={descriptionPlaceholder}
          className="w-full bg-gray-100 text-black placeholder:text-gray-500 px-4 py-2.5 outline-none border-0 focus:border-1 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg"
        />
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center mb-4">
          <div className="relative flex items-start">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                id={`isForSale${idSuffix}`}
                name="isForSale"
                checked={formData.isForSale}
                onChange={handleChange}
                className="h-5 w-5 outline-none border-2 border-gray-300 rounded appearance-none checked:bg-indigo-600 bg-white"
              />
            </div>
            <div className="ml-3 text-sm">
              <label
                htmlFor={`isForSale${idSuffix}`}
                className="font-medium text-gray-700"
              >
                This artwork is for sale
              </label>
            </div>
          </div>
        </div>

        {formData.isForSale && (
          <div className="border-t border-gray-200 pt-4 animate-fadein">
            <label
              htmlFor={`price${idSuffix}`}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Price <span className="text-red-500">*</span>
            </label>
            <div className="relative rounded-md shadow-sm">
              <input
                type="number"
                id={`price${idSuffix}`}
                name="price"
                value={formData.price}
                onChange={handleChange}
                required={formData.isForSale}
                min="0"
                step="0.01"
                placeholder="0.00"
                className={`w-full pl-4 bg-gray-100 text-black border-gray-300 rounded-lg shadow-sm px-4 ${inputPadding} outline-none border-0 focus:border-1 focus:border-indigo-500 focus:ring-indigo-500 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">EGP</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ArtworkDetails;
