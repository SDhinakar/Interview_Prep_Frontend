// 📁src/pages/InterviewPrep/TestPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import { HiSpeakerWave, HiSpeakerXMark, HiMicrophone } from "react-icons/hi2";
import { toast } from "react-hot-toast";
import SpinnerLoader from "../../components/Loader/SpinnerLoader";
import { ClipLoader } from "react-spinners";

const TestPage = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [questions, setQuestions] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [transcripts, setTranscripts] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const synthRef = useRef(window.speechSynthesis);
  const videoRef = useRef();
  const recognitionRef = useRef(null);
  const [loadingQuestions, setLoadingQuestions] = useState(true);

  // Get session details from navigation state
  const role = location.state?.role || "";
  const topicsToFocus = location.state?.topicsToFocus || "";
  const experience = location.state?.experience || "";

  const generateQuestions = async () => {
    try {
      setLoadingQuestions(true);
      const res = await axiosInstance.post("/api/interview/questions", {
        role,
        topics: topicsToFocus,
        experience,
      });
      const raw = res?.data?.questions || [];
      setQuestions(raw);
      const ideal = res?.data?.idealAnswers || [];
      setCorrectAnswers(ideal);
    } catch (err) {
      console.error("Error generating questions", err);
    } finally {
      setLoadingQuestions(false);
    }
  };

  // Auto-generate questions on mount
  useEffect(() => {
    generateQuestions();
    // eslint-disable-next-line
  }, []);

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      // ❌ Don't null it here. Let onend clean it.
    } else {
    }
  };

  const startListening = () => {
    if (recognitionRef.current) {
      console.warn("🛑 Recognition already running");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    let finalTranscript = "";

    recognition.onstart = () => {
      setIsListening(true);
      toast.success("🎤 Recording started...");
    };

    recognition.onresult = (event) => {
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalTranscript += transcript + " ";
        } else {
          interimTranscript += transcript;
        }
      }

      const fullText = finalTranscript + interimTranscript;

      setTranscripts((prev) => ({
        ...prev,
        [currentIndex]: fullText.trim(),
      }));
    };

    recognition.onerror = (event) => {
      console.error("❌ Recognition error:", event.error);
      toast.error("Speech error: " + event.error);
      stopListening();
    };

    recognition.onend = () => {
      toast("🎤 Recording stopped");
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  useEffect(() => {
    stopListening();
  }, [currentIndex]);

  const speakQuestion = () => {
    const utterance = new SpeechSynthesisUtterance(
      questions[currentIndex]?.replace(/\*\*/g, "")
    );
    synthRef.current.speak(utterance);
    setIsSpeaking(true);
  };

  const stopSpeaking = () => {
    synthRef.current.cancel();
    setIsSpeaking(false);
  };

  const submitAnswer = async () => {
    try {
      const question = questions[currentIndex]?.replace(/\*\*/g, "");
      const user_ans = transcripts[currentIndex];
      const correct_ans = correctAnswers[currentIndex];

      if (!question || !user_ans) {
        toast.error("Missing question, your answer, or ideal answer.");
        return;
      }

      const payload = {
        mockIdRef: sessionId,
        question,
        user_ans,
        correct_ans,
      };

      await axiosInstance.post("/api/interview/answers", payload);

      if (currentIndex < questions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setSubmitted(true);

        toast.success("Test completed!");
      }
    } catch (err) {
      console.error("Submit failed", err);
      toast.error("Failed to submit answer.");
    }
  };

  const initCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
      toast.success("Camera permission granted");
    } catch (err) {
      toast.error("Camera permission denied");
    }
  };

  useEffect(() => {
    if (cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [cameraStream]);

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto p-4">
        <h2 className="text-xl font-bold mb-4">Start Interview Test</h2>

        {loadingQuestions ? (
          <div className="flex flex-col justify-center items-center h-40">
            <ClipLoader color="#FF9324" size={60} speedMultiplier={1.2} />
            <span className="mt-4 text-orange-500 text-lg font-semibold animate-pulse">
              Generating your personalized questions...
            </span>
          </div>
        ) : questions.length > 0 ? (
          <>
            <div className="flex gap-2 mb-4">
              {questions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`px-4 py-1 text-sm rounded-full border cursor-pointer transition-all duration-200 ${
                    i === currentIndex
                      ? "bg-green-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Question #{i + 1}
                </button>
              ))}
            </div>

            <div className="border rounded p-4 mb-4 relative">
              <h4 className="font-semibold text-lg mb-3">
                {questions[currentIndex]?.replace(/\*\*/g, "")}
              </h4>

              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={isSpeaking ? stopSpeaking : speakQuestion}
                  className="text-gray-700 cursor-pointer"
                >
                  {isSpeaking ? (
                    <HiSpeakerXMark size={20} />
                  ) : (
                    <HiSpeakerWave size={20} />
                  )}
                </button>
              </div>

              <div className="flex justify-center my-6">
                {cameraStream ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    className="w-32 h-32 rounded object-cover"
                  />
                ) : (
                  <div
                    onClick={initCamera}
                    className="w-32 h-32 bg-gray-200 rounded flex items-center justify-center cursor-pointer"
                  >
                    <span role="img" aria-label="webcam" className="text-4xl">
                      📷
                    </span>
                  </div>
                )}
              </div>

              <div className="text-sm bg-gray-100 p-3 rounded mb-3 min-h-[60px]">
                <p>
                  <strong>Your Answer:</strong>{" "}
                  {transcripts[currentIndex] ||
                    "Start recording to see your answer here"}
                </p>
              </div>

              <div className="flex gap-4">
                {isListening ? (
                  <button
                    onClick={stopListening}
                    className="flex items-center gap-2 bg-red-600 text-white px-4 py-1 rounded cursor-pointer"
                  >
                    <HiMicrophone /> Stop Listening
                  </button>
                ) : (
                  <button
                    onClick={startListening}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-1 rounded cursor-pointer"
                  >
                    <HiMicrophone /> Record Answer
                  </button>
                )}

                {transcripts[currentIndex] && (
                  <button
                    onClick={submitAnswer}
                    className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded cursor-pointer"
                  >
                    Submit Answer
                  </button>
                )}
              </div>
            </div>
          </>
        ) : null}

        {submitted && (
          <div className="text-center mt-6">
            <button
              onClick={() => navigate(`/interview-prep/${sessionId}/feedback`)}
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded cursor-pointer"
            >
              View Feedback
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TestPage;
