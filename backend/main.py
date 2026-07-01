import os
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

from fastapi import FastAPI
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from kittentts import KittenTTS
import io
import soundfile as sf
import numpy as np

logger.info("Loading model...")
model = KittenTTS("KittenML/kitten-tts-nano-0.8-int8")
logger.info("Model loaded successfully")

app = FastAPI(title="Kitten TTS API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class SynthesizeRequest(BaseModel):
    text: str
    voice: str = "Jasper"
    speed: float = 1.0


@app.get("/")
def root():
    return {"status": "ok"}


@app.get("/api/voices")
def get_voices():
    return {"voices": model.available_voices}


@app.post("/api/synthesize")
def synthesize(req: SynthesizeRequest):
    audio = model.generate(req.text, voice=req.voice, speed=req.speed)
    audio = (audio * 32767).astype(np.int16)
    buf = io.BytesIO()
    sf.write(buf, audio, 24000, format="WAV")
    return Response(content=buf.getvalue(), media_type="audio/wav")


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
