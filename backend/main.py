from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from yt_utils import get_video_info, download_stream
from fastapi.responses import StreamingResponse

app = FastAPI()

# Allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/info")
async def fetch_info(url: str):
    try:
        info = get_video_info(url)
        return info
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/download")
async def download(url: str, format_id: str):
    try:
        video_stream = download_stream(url, format_id)
        headers = {
            "Content-Disposition": 'attachment; filename="video.mp4"',
            "Content-Type": "application/octet-stream"
        }
        return StreamingResponse(video_stream, headers=headers)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
