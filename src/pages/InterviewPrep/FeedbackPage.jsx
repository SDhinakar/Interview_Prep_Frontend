import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import * as Accordion from "@radix-ui/react-accordion";
import { FaChevronDown } from "react-icons/fa";

const FeedbackPage = () => {
  const { sessionId } = useParams();
  const [feedbackData, setFeedbackData] = useState([]);
  const [averageRating, setAverageRating] = useState(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await axiosInstance.get(
          `/api/interview/answers/${sessionId}?userId=testUser123`
        );
        const data = res.data || [];

        setFeedbackData(data);

        if (data.length > 0) {
          const avg =
            data.reduce((acc, item) => acc + item.rating, 0) / data.length;
          setAverageRating(avg.toFixed(1));
        }
      } catch (err) {
        console.error("Error fetching feedback", err);
      }
    };

    fetchFeedback();
  }, [sessionId]);

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto p-4">
        <h2 className="text-xl font-bold mb-4">Your Interview Feedback</h2>

        {averageRating && (
          <div className="mb-6 text-center">
            <p className="text-lg font-medium">Average Score:</p>
            <p className="text-3xl font-bold text-green-600">
              {averageRating} / 10
            </p>
          </div>
        )}

        <div className="space-y-4">
          {feedbackData.map((item, i) => (
            <Accordion.Root
              key={i}
              type="single"
              collapsible
              className="border rounded-lg"
            >
              <Accordion.Item value={`item-${i}`} className="border-b">
                <Accordion.Header>
                  <Accordion.Trigger className="w-full text-left flex justify-between items-center p-4 font-medium text-gray-900 hover:bg-gray-100">
                    <span>
                      Q{i + 1}: {item.question}
                    </span>
                    <FaChevronDown className="h-4 w-4" />
                  </Accordion.Trigger>
                </Accordion.Header>

                <Accordion.Content className="p-4 space-y-3 bg-white">
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      ⭐ <strong>Rating:</strong> {item.rating} / 10
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1 font-semibold">
                      Ideal Answer:
                    </p>
                    <p className="text-sm text-gray-700 bg-gray-100 rounded p-2 whitespace-pre-wrap">
                      {item.correct_ans}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1 font-semibold">
                      Your Answer:
                    </p>
                    <p className="text-sm text-gray-700 bg-gray-100 rounded p-2 whitespace-pre-wrap">
                      {item.user_ans}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1 font-semibold">
                      Gemini Feedback:
                    </p>
                    <div className="text-sm text-gray-700 bg-orange-50 rounded p-2 whitespace-pre-wrap">
                      {item.feedback}
                    </div>
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion.Root>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FeedbackPage;
