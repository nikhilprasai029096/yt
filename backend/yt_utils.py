import os
import uuid
import subprocess
from yt_dlp import YoutubeDL

TEMP_DIR = "temp_downloads"
os.makedirs(TEMP_DIR, exist_ok=True)

MERGE_RESOLUTIONS = {
    "360p": "🎬 360p Standard",
    "720p": "📹 720p HD",
    "1080p": "📺 1080p Full HD",
    "2160p": "🐉 4K Ultra HD",
}


def get_video_info(url):
    ydl_opts = {"quiet": True, "skip_download": True}
    with YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=False)

        formats = info["formats"]
        audio = max((f for f in formats if f["vcodec"] == "none"), key=lambda x: x.get("filesize", 0), default=None)

        resolution_formats = []
        used = set()

        for res, label in MERGE_RESOLUTIONS.items():
            video = next((f for f in formats if res in (f.get("format_note") or f.get("resolution") or "")
                          and f["acodec"] == "none" and f["vcodec"] != "none"), None)
            if video and audio:
                resolution_formats.append({
                    "format_id": res,  # simplified for merging
                    "video_format_id": video['format_id'],
                    "audio_format_id": audio['format_id'],
                    "label": label,
                    "ext": "mp4",
                    "filesize": video.get("filesize", 0) + audio.get("filesize", 0),
                })

        audio_only = []
        if audio:
            audio_only.append({
                "format_id": audio["format_id"],
                "label": "🎧 Audio Only",
                "ext": audio["ext"],
                "filesize": audio.get("filesize", 0),
            })

        return {
            "title": info["title"],
            "thumbnail": info["thumbnail"],
            "formats": audio_only + resolution_formats,
        }


def download_stream(url, format_id):
    # If it's one of the labeled resolutions, merge manually
    if format_id in MERGE_RESOLUTIONS:
        unique_id = str(uuid.uuid4())
        video_path = os.path.join(TEMP_DIR, f"{unique_id}_v.mp4")
        audio_path = os.path.join(TEMP_DIR, f"{unique_id}_a.m4a")
        output_path = os.path.join(TEMP_DIR, f"{unique_id}_merged.mp4")

        # Pick format for that resolution
        with YoutubeDL({"quiet": True, "skip_download": True}) as ydl:
            info = ydl.extract_info(url, download=False)
            formats = info["formats"]

            video = next((f for f in formats if format_id in (f.get("format_note") or f.get("resolution") or "")
                          and f["acodec"] == "none" and f["vcodec"] != "none"), None)
            audio = max((f for f in formats if f["vcodec"] == "none"), key=lambda x: x.get("filesize", 0), default=None)

        if not video or not audio:
            raise Exception("Matching video/audio format not found")

        ydl_opts_v = {"format": video['format_id'], "quiet": True, "outtmpl": video_path, "noplaylist": True}
        ydl_opts_a = {"format": audio['format_id'], "quiet": True, "outtmpl": audio_path, "noplaylist": True}

        with YoutubeDL(ydl_opts_v) as ydl:
            ydl.download([url])
        with YoutubeDL(ydl_opts_a) as ydl:
            ydl.download([url])

        cmd = ["ffmpeg", "-i", video_path, "-i", audio_path, "-c:v", "copy", "-c:a", "aac", "-strict", "experimental", output_path, "-y"]
        subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

        return open(output_path, "rb")

    # Otherwise normal single format download
    else:
        path = os.path.join(TEMP_DIR, f"{uuid.uuid4()}.mp4")
        ydl_opts = {"format": format_id, "outtmpl": path, "quiet": True, "noplaylist": True}
        with YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])
        return open(path, "rb")