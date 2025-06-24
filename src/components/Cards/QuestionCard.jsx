import React from "react";
import { useState, useRef } from "react";
import { LuChevronDown, LuPin, LuPinOff, LuSparkles } from "react-icons/lu";
import AIResponsePreview from "../AIResponsePreview";

const QuestionCard = ({
  question,
  answer,
  onLearnMore,
  isPinned,
  onTogglePin,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef(null);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-white rounded-lg mb-4 overflow-hidden py-4 px-4 shadow-xl shadow-gray-100/70 border border-gray-100/60 group">
      <div className="flex items-start justify-between cursor-pointer">
        <div className="flex items-center gap-3.5">
          <span className="text-ms md:text-[15px] font-semibold text-gray-400 leading-[18px]">
            Q
          </span>
          <h3
            className="text-base md:text-lg font-extrabold text-blue-900 bg-gradient-to-r from-blue-100 to-purple-100 border-l-4 border-blue-500 px-4 py-2 rounded-md shadow-sm mr-0 md:mr-20 transition-all duration-200"
            onClick={toggleExpand}
          >
            {question}
          </h3>
        </div>
        <div className="flex items-center justify-end ml-4 relative">
          <div
            className={`flex ${
              isExpanded ? "md:flex-row" : "md:hidden group-hover:flex"
            }`}
          >
            <button
              className="flex items-center gap-2 text-xs text-indigo-800 font-medium bg-indigo-50 px-3 py-1 mr-2 rounded text-nowrap border border-indigo-50 hover:border-indigo-200 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onTogglePin();
              }}
            >
              {isPinned ? (
                <LuPinOff className="text-xs" />
              ) : (
                <LuPin className="text-xs" />
              )}
            </button>
            <button
              className="flex items-center gap-2 text-xs text-cyan-800 font-medium bg-cyan-50 px-3 py-1 mr-2 rounded text-nowrap border border-cyan-50 hover:border-cyan-200 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(true);
                onLearnMore();
              }}
            >
              <LuSparkles />
              <span className="hidden md:block">Learn More</span>
            </button>
          </div>
          <button
            className="text-gray-400 hover:text-gray-500 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              toggleExpand();
            }}
          >
            <LuChevronDown
              size={20}
              className={`transform transition-transform duration-300 ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Answer content with transition */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? "max-h-[1000px]" : "max-h-0"
        }`}
        ref={contentRef}
      >
        <div className="mt-4 text-gray-700 bg-gray-50 px-5 py-3 rounded-lg">
          <AIResponsePreview content={answer} />
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
