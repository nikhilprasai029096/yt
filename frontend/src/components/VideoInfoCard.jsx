import React from "react";

function VideoInfoCard({ data, url, simulateDownloadPopup }) {
  const handleDownload = (format_id, label) => {
    simulateDownloadPopup();
    setTimeout(() => {
      const link = document.createElement("a");
      link.href = `http://localhost:8000/download?url=${encodeURIComponent(url)}&format_id=${format_id}`;
      link.download = `${data.title} - ${label}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 2500);
  };

  const formatSize = (size) => {
    if (!size) return "";
    const mb = size / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const audioOnly = data.formats.filter(f => f.label.includes("Audio Only"));
  const combined = data.formats.filter(f => !f.label.includes("Audio Only") && !f.label.includes("Video Only"));

  const renderSection = (title, formats) => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <div className="flex flex-wrap gap-3">
        {formats.map((fmt, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-between bg-gray-100 rounded-md px-4 py-3 hover:bg-gray-200 transition w-full md:w-[48%] lg:w-[32%]"
          >
            <div className="mb-2">
              <div className="font-medium text-sm">{fmt.label}</div>
              <div className="text-xs text-gray-600">
                Format: {fmt.ext.toUpperCase()}<br />Size: {formatSize(fmt.filesize)}
              </div>
            </div>
            <button
              onClick={() => handleDownload(fmt.format_id, fmt.label)}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded shadow-sm transition-transform hover:scale-105"
            >
              Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-white text-black rounded-xl shadow-lg p-4 animate-slide-in">
      <img src={data.thumbnail} alt="thumbnail" className="rounded-xl mb-4 w-full" />
      <h2 className="text-xl font-bold mb-4">{data.title}</h2>
      {renderSection("🎧 Audio Only", audioOnly)}
      {renderSection("🎞️ Video with Audio (Merged)", combined)}
    </div>
  );
}

export default VideoInfoCard;