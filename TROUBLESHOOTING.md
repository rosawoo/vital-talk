# Troubleshooting Guide

## Audio Processing Issues

### Issue: "Failed to process audio. Please try again."

**Root Cause:** OpenAI API quota exceeded

**Error Details:**
```
OpenAI API Error 429 - insufficient_quota
"You exceeded your current quota, please check your plan and billing details."
```

**Solution:**
1. Check your OpenAI account billing at: https://platform.openai.com/account/billing
2. Add credits to your account or upgrade your plan
3. Verify your API key has active credits

**What Was Fixed:**
- ✅ Improved error handling in audio endpoints
- ✅ Better error messages that indicate quota issues
- ✅ More robust OpenAI response parsing
- ✅ Added logging for debugging

**Code Changes:**
- Updated `backend/app/api/audio.py` with better error handling
- Enhanced `backend/app/core/config.py` for more robust config loading

## How to Check Your OpenAI API Status

1. Visit: https://platform.openai.com/account/billing
2. Check your current usage and limits
3. Add payment method if needed
4. Consider using:
   - **Free tier**: $5 free credits (limited time)
   - **Pay-as-you-go**: $0.006/min for Whisper, $15/1M chars for TTS

## Testing Audio Features

Once you've added credits to your OpenAI account:

1. **Test TTS endpoint:**
```bash
curl -X POST http://localhost:8000/api/audio/text-to-speech \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello, this is a test.","emotion":"neutral"}' \
  -o test.mp3
```

2. **Test Whisper endpoint:**
```bash
# Record audio in browser and use the UI
# Or use curl with an audio file:
curl -X POST http://localhost:8000/api/audio/speech-to-text \
  -F "audio_file=@recording.webm"
```

## Alternative Solutions

If you don't want to use OpenAI's paid API:

### Option 1: Use Text Mode Only
- Toggle to "Text Mode" in the conversation interface
- Type responses instead of speaking
- No audio API calls required

### Option 2: Use Local Models (Advanced)
- Replace OpenAI Whisper with local Whisper model
- Use open-source TTS like Piper or Coqui TTS
- Requires more setup but free to use

## Error Messages You Might See

### "OpenAI API quota exceeded"
**Solution:** Add credits to your OpenAI account

### "Transcription service unavailable"
**Solution:** Check your internet connection and API key

### "Connection lost. Attempting to reconnect..."
**Solution:** Backend might be restarting, wait 30 seconds

### "Microphone access denied"
**Solution:** Allow microphone permissions in browser settings

## Backend Health Check

Check if services are running:
```bash
# Overall health
curl http://localhost:8000/health

# Audio services
curl http://localhost:8000/api/audio/health

# All containers
docker-compose ps
```

## Useful Commands

**View backend logs:**
```bash
docker-compose logs backend --tail=50
```

**Restart services:**
```bash
docker-compose restart backend
```

**Check API key in container:**
```bash
docker-compose exec backend python -c "import os; print('API Key set:', bool(os.getenv('OPENAI_API_KEY')))"
```

## Getting Help

1. Check OpenAI status: https://status.openai.com/
2. Review API docs: https://platform.openai.com/docs
3. Check backend logs for specific errors
4. Verify environment variables are set correctly

## Cost Optimization Tips

To reduce API costs:

1. **Use Text Mode** when practicing basic responses
2. **Use Audio Mode** only for final practice runs
3. **Keep responses concise** - shorter audio = lower costs
4. **Practice with friends first** before using AI
5. **Set budget alerts** in OpenAI dashboard

## Current API Costs

- **Whisper (STT)**: ~$0.003 per 30-second recording
- **TTS**: ~$0.0015 per typical response
- **Total per conversation**: ~$0.05 for 10 exchanges

Very affordable for training, but be mindful of frequent practice sessions.
