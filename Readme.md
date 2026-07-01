# TTS Web

A web interface for [Kitten TTS](https://github.com/KittenML/KittenTTS) — an ultra-lightweight text-to-speech model that runs on CPU. Built with a Next.js frontend and FastAPI Python backend.

## Features

- **8 voices** — Bella, Jasper, Luna, Bruno, Rosie, Hugo, Kiki, Leo
- **Adjustable speed** — 0.5x to 2.0x
- **Audio playback & download** — listen or save as WAV
- **Share to WhatsApp** — share audio on mobile
- **CPU-only** — no GPU required
- **ONNX-based** — fast inference with onnxruntime

## Project Structure

```
├── backend/            # FastAPI Python server
│   ├── main.py         # API endpoints
│   ├── Dockerfile      # Container build
│   └── requirements.txt
├── frontend/           # Next.js web app
│   ├── src/app/        # React components
│   ├── next.config.ts
│   └── package.json
├── start.sh            # Launch both servers
└── .env                # HF_TOKEN (optional)
```

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Python | 3.8 – 3.12 | [python.org](https://python.org) |
| Node.js | 18+ | [nodejs.org](https://nodejs.org) |
| npm | (comes with Node.js) | — |
| Git | (optional) | [git-scm.com](https://git-scm.com) |

## Setup

### 1. Clone the repo

```bash
git clone https://github.com/harismehboob142/TTS-Web.git
cd TTS-Web
```

### 2. Backend setup

Create a virtual environment and install dependencies:

**Linux / macOS:**
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r backend/requirements.txt
```

**Windows (PowerShell):**
```powershell
python -m venv venv
venv\Scripts\activate
pip install -r backend\requirements.txt
```

> If you get a `misaki` dependency error about Python version, run:
> ```bash
> pip install --ignore-requires-python "misaki[en]>=0.9.4"
> ```

### 3. Frontend setup

```bash
cd frontend
npm install
cd ..
```

### 4. Environment variables (optional)

Create a `.env` file in the project root:

```env
HF_TOKEN=hf_your_token_here
```

This avoids Hugging Face rate limit warnings when downloading the model. Get a free token at [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens).

For local development, create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Running locally

### One-command start (Linux / macOS)

```bash
chmod +x start.sh
./start.sh
```

### Manual start (all OS)

**Terminal 1 — Backend:**
```bash
# Linux / macOS
source venv/bin/activate
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000

# Windows PowerShell
venv\Scripts\activate
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

Open **http://localhost:3000** in your browser.

## Usage

1. Type or paste text into the text area
2. Choose a voice from the dropdown
3. Adjust speed with the slider
4. Click **Generate Speech**
5. Play, download, or share the audio

## Deploying

### Frontend → Vercel

```bash
cd frontend
npx vercel --prod
```

Set environment variable in Vercel dashboard:
- `NEXT_PUBLIC_API_URL` = your backend URL

Set **Root Directory** to `frontend/` in Vercel project settings.

### Backend → Railway

1. Push repo to GitHub
2. Create a new Railway project → **Deploy from GitHub**
3. Set **Root Directory** to `backend/`
4. Add environment variable: `HF_TOKEN` = your Hugging Face token
5. Railway auto-detects the Dockerfile

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/voices` | List available voices |
| POST | `/api/synthesize` | Generate speech from text |

### POST `/api/synthesize`

```json
{
  "text": "Hello world.",
  "voice": "Jasper",
  "speed": 1.0
}
```

Returns a WAV audio file.

## Tech Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend:** FastAPI, Python, ONNX Runtime
- **Model:** Kitten TTS (80M or 15M params)
- **Deployment:** Vercel (frontend), Railway (backend)
