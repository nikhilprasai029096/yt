import React, { useState, useEffect } from "react";
import axios from "axios";
import VideoInfoCard from "../components/VideoInfoCard";

function Home() {
  const [url, setUrl] = useState("");
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupProgress, setPopupProgress] = useState(0);
  const [popupReady, setPopupReady] = useState(false);
  const [showFinalNote, setShowFinalNote] = useState(false);

  const handleFetch = async () => {
    if (!url) return;
    setLoading(true);
    setVideoData(null);
    setProgress(0);
    setShowVideo(false);
    let progressInterval;
    try {
      progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 2.5;
        });
      }, 100);

      const res = await axios.get(`http://localhost:8000/info?url=${encodeURIComponent(url)}`);
      setTimeout(() => {
        setVideoData(res.data);
        setShowVideo(true);
        setLoading(false);
        clearInterval(progressInterval);
        setProgress(100);
      }, 4000);
    } catch (err) {
      alert("Error fetching video info");
      clearInterval(progressInterval);
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleFetch();
    }
  };

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setUrl(text);
    } catch (err) {
      alert("Failed to paste from clipboard");
    }
  };

  const simulateDownloadPopup = () => {
    setPopupVisible(true);
    setPopupProgress(0);
    setPopupReady(false);
    setShowFinalNote(false);

    const interval = setInterval(() => {
      setPopupProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setPopupReady(true);
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };

  const handlePopupDownload = () => {
    setShowFinalNote(true);
    setTimeout(() => {
      setPopupVisible(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#0d0b27] flex flex-col justify-between text-white px-4 py-12 font-sans relative">
      <div className="w-full max-w-3xl mx-auto text-center animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-pink-400">YouTube Video Downloader</h1>

        <div className="flex flex-col md:flex-row justify-center gap-4 items-center bg-[#1e1b3a] rounded-lg p-4 shadow-xl border border-pink-500/20">
          <input
            type="text"
            placeholder="Paste your video link here"
            className="flex-1 px-4 py-3 text-black rounded-md w-full outline-none focus:ring-2 focus:ring-pink-400"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <div className="flex gap-2">
            <button
              onClick={handleFetch}
              className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white px-4 py-3 rounded-md font-semibold transition-transform transform hover:scale-105 shadow-md"
            >
              <i className="fas fa-download mr-2"></i>Download
            </button>
            <button
              onClick={pasteFromClipboard}
              className="block md:hidden bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-md font-semibold shadow-md"
            >
              Paste
            </button>
          </div>
        </div>

        <p className="text-sm text-yellow-300 mt-2">🔒 Scanned by Norton™ Safe Web</p>

        {loading && (
          <div className="mt-6 w-full">
            <p className="text-pink-200 text-sm mb-1">Getting your video ready, please wait a sec...</p>
            <div className="relative w-full h-3 rounded-full overflow-hidden bg-white/20">
              <div
                className="absolute h-full bg-white rounded-full transition-all"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {showVideo && videoData && (
          <div className="mt-10 animate-slide-down bg-gradient-to-br from-[#1e1b3a] to-[#2d295d] border border-white/10 shadow-2xl rounded-xl p-5">
            <h2 className="text-lg font-semibold text-pink-300 mb-4 animate-fade-in">Download video as:</h2>
            <VideoInfoCard data={videoData} url={url} simulateDownloadPopup={simulateDownloadPopup} />
          </div>
        )}

        <div className="mt-20 text-center">
          <p className="text-gray-300 max-w-xl mx-auto text-sm">
            SSYouTube is your go-to online video downloader, crafted to bypass YouTube's download restrictions. We bridge the gap by offering a fast and reliable way to download YouTube videos. With our user-friendly interface, accessing your favorite content has never been easier.
          </p>

          <h3 className="text-white text-lg font-bold mt-8 mb-4">Supported Platforms:</h3>
          <div className="flex justify-center gap-8 flex-wrap">
            <img src="https://img.icons8.com/?size=100&id=s9k2rXOtb7lB&format=png&color=000000" alt="Android" className="w-10 h-10" />
            <img src="https://img.icons8.com/?size=100&id=17852&format=png&color=000000" alt="Windows" className="w-10 h-10" />
            <img src="https://img.icons8.com/?size=100&id=gXR9fwimIOsU&format=png&color=000000" alt="ios" className="w-10 h-10" />
            <img src="https://img.icons8.com/?size=100&id=HF4xGsjDERHf&format=png&color=000000" alt="Linux" className="w-10 h-10" />
          </div>
        </div>
      </div>

      {popupVisible && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#1e1b3a] p-6 rounded-lg shadow-xl border border-pink-500 text-center w-[90%] max-w-md">
            {!showFinalNote ? (
              <>
                <p className="text-pink-200 mb-4">Preparing your download...</p>
                <div className="w-full h-3 rounded-full overflow-hidden bg-white/20 mb-4">
                  <div
                    className="h-full bg-white rounded-full transition-all"
                    style={{ width: `${popupProgress}%` }}
                  ></div>
                </div>
                {popupReady && (
                  <button
                    onClick={handlePopupDownload}
                    className="inline-block bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-semibold"
                  >
                    Download Now
                  </button>
                )}
              </>
            ) : (
              <>
                <p className="text-green-300 mb-2 font-semibold">✅ Your download should begin automatically.</p>
                <p className="text-sm text-gray-300">If it doesn’t, please click the download link again or check your browser settings.</p>
              </>
            )}
          </div>
        </div>
      )}

      <footer className="text-center text-xs text-pink-200 mt-12 mb-6 animate-fade-in">
        <p className="mb-1">© 2025 VidVortex. All rights reserved.</p>
        <p className="max-w-xl mx-auto text-[13px]">
          This website is not affiliated with YouTube. Videos are downloaded for personal use only. By using this service, you agree to our <span className="underline">Terms of Service</span> and <span className="underline">Privacy Policy</span>.
        </p>
      </footer>

      <style>
        {`
          @keyframes slide-down {
            0% { opacity: 0; transform: translateY(-30px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-slide-down {
            animation: slide-down 0.6s ease-out;
          }
        `}
      </style>
    </div>
  );
}

export default Home;