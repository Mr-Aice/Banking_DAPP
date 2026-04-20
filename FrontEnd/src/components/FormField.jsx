import React from 'react'

const FormField = ({ labelName, placeholder, inputType, isTextArea, value, handleChange, error }) => {
  const borderColor = error ? 'border-red-500' : 'border-[#3a3a43]';
  const baseInputClass = `py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] ${borderColor} bg-transparent font-epilogue text-white text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px]`;

  return (
    <label className="flex-1 w-full flex flex-col">
      {labelName && (
        <span className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px]">{labelName}</span>
      )}
      {isTextArea ? (
        <textarea 
          required
          value={value}
          onChange={handleChange}
          rows={10}
          placeholder={placeholder}
          className={baseInputClass}
        />
      ) : (
        <input 
          required
          value={value}
          onChange={handleChange}
          type={inputType}
          step="0.1"
          placeholder={placeholder}
          className={baseInputClass}
        />
      )}
      {error && (
        <span className="mt-1 text-red-500 text-sm font-epilogue">{error}</span>
      )}
    </label>
  )
}

export default FormField