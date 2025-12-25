import React, { useState, useRef, useEffect } from 'react'

const DropDown = ({ trigger, children, onClick }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-[#1a1420] border border-white/10 rounded-lg shadow-lg overflow-hidden z-50" onClick={onClick}>
          {children}
        </div>
      )}
    </div>
  )
}

export const DropDownItem = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full px-4 py-3 text-left text-zinc-300 hover:bg-[#060010] hover:text-white transition-colors"
    >
      {children}
    </button>
  )
}

export default DropDown
