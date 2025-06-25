import React from "react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { generateSessionId } from "../../utils/helper"; // write this if not already

const SummaryCard = ({
  colors,
  role = "Untitled Role",
  topicsToFocus = "",
  experience = "",
  questions = 0,
  description = "",
  lastUpdated = "",
  sessionId,
  onSelect = () => {},
  onDelete = () => {},
}) => {
  const navigate = useNavigate();

  const initials = role
    .split(" ")
    .map((word) => word[0] || "")
    .join("")
    .toUpperCase()
    .substring(0, 2);

  const formattedTopics = topicsToFocus.split(",").slice(0, 3).join(", ");
  const formattedDate = lastUpdated
    ? moment(lastUpdated).format("MMM D, YYYY")
    : "Not available";

  const handleStartTest = (e) => {
    e.stopPropagation();
    const newSessionId = generateSessionId();
    localStorage.setItem("currentSessionId", newSessionId);
    navigate(`/interview-prep/${newSessionId}/test`, {
      state: {
        role,
        topicsToFocus,
        experience,
      },
    });
  };

  return (
    <div
      className="relative bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group cursor-pointer h-full flex flex-col"
      style={{ background: colors || "#e8faf5" }}
      onClick={(e) => {
        if (!e.target.closest(".delete-button")) {
          onSelect();
        }
      }}
      data-testid="summary-card"
    >
      {/* Delete button */}
      <button
        className="delete-button absolute top-3 right-3 text-red-400 hover:text-red-600 transition-colors duration-200 p-1 z-10 bg-white/80 rounded-full"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        aria-label="Delete session"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M3 6h18"></path>
          <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
        </svg>
      </button>

      {/* Card content */}
      <div className="p-5 flex-grow flex flex-col">
        <div className="flex items-center mb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/90 text-gray-700 text-lg font-bold mr-3 border border-gray-200">
            {initials}
          </div>

          <div className="flex flex-col">
            <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
              {role}
            </h3>
            {formattedTopics && (
              <div className="text-xs text-gray-600 line-clamp-1">
                {formattedTopics}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {experience && (
            <span className="text-xs bg-white/80 text-gray-700 px-3 py-1 rounded-full border border-gray-200">
              Exp: {experience} {experience === "1" ? "Year" : "Years"}
            </span>
          )}
          <span className="text-xs bg-white/80 text-gray-700 px-3 py-1 rounded-full border border-gray-200">
            {questions} Q&A
          </span>
          <span className="text-xs bg-white/80 text-gray-700 px-3 py-1 rounded-full border border-gray-200">
            Updated: {formattedDate}
          </span>
        </div>

        {description && (
          <div className="mt-2 flex-grow">
            <p className="text-sm text-gray-600 line-clamp-3">{description}</p>
          </div>
        )}
      </div>

      {/* Start Test button only */}
      <div className="px-5 pb-4">
        <button
          onClick={handleStartTest}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1.5 rounded-full"
        >
          Start Test
        </button>
      </div>

      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );
};

export default SummaryCard;
