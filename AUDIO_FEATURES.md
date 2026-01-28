# Audio Interaction Features

## Overview

Your Vital Talk MVP now supports **realistic audio interactions** for end-of-life conversation training. Doctors can speak naturally using their microphone, and the AI family member responds with realistic emotional voice synthesis.

## Features

### 🎤 Speech-to-Text (STT)
- **Technology:** OpenAI Whisper API
- **Input:** Doctor's spoken responses via microphone
- **Output:** Transcribed text sent to the conversation
- **Supported:** Multiple languages (currently configured for English)

### 🔊 Text-to-Speech (TTS)
- **Technology:** OpenAI TTS API
- **Emotion-Based Voices:** Different voices for different emotional states
  - **Neutral:** Nova (calm, professional)
  - **Denial:** Alloy (slightly defensive)
  - **Anger:** Onyx (deeper, more intense)
  - **Bargaining:** Shimmer (hopeful, pleading)
  - **Sadness:** Echo (softer, emotional)
  - **Acceptance:** Fable (peaceful, resigned)

### 🎯 Real-Time Interaction
- **Audio Mode Toggle:** Switch between text and voice input anytime
- **Live Playback:** Agent responses play automatically in audio mode
- **Visual Feedback:** Recording indicator, processing status, speaking animations

## How to Use

### Starting a Conversation with Audio

1. **Navigate to Scenarios** at http://localhost:3000/scenarios
2. **Select a scenario** to begin training
3. **Audio Mode is ON by default** - you'll see a "🎤 Audio Mode" button in the header

### Recording Your Response

1. **Click the microphone button** "🎤 Hold to Speak"
2. **Speak your response** clearly as the doctor
3. **Click "⏹️ Stop Recording"** when finished
4. **Wait for processing** - your speech will be transcribed and sent
5. **Listen to the AI response** - the family member will respond with realistic emotion

### Switching Between Modes

- **Audio Mode:** Click "🎤 Audio Mode" (blue button)
- **Text Mode:** Click "⌨️ Text Mode" (gray button)
- You can switch at any time during the conversation

## Technical Implementation

### Backend API Endpoints

```
POST /api/audio/speech-to-text
- Accepts: audio/webm file
- Returns: { text: string, success: boolean }
- Uses: OpenAI Whisper-1 model

POST /api/audio/text-to-speech
- Accepts: { text: string, emotion: string }
- Returns: audio/mpeg stream
- Uses: OpenAI TTS-1 model with emotion-based voice selection

GET /api/audio/health
- Health check for audio services
```

### Frontend Components

**Audio Controls:**
- MediaRecorder API for browser-based recording
- Real-time audio playback with HTMLAudioElement
- Visual state indicators (recording, processing, playing)

**User Experience:**
- One-click recording start/stop
- Automatic transcription and message sending
- Automatic playback of agent responses
- Seamless mode switching

## Configuration

### Environment Variables

Make sure your `.env` file has a valid OpenAI API key:

```bash
OPENAI_API_KEY=your-openai-api-key-here
```

### Browser Requirements

- **Microphone Access:** Required for voice input
- **Supported Browsers:** Chrome, Firefox, Safari, Edge (modern versions)
- **HTTPS:** Not required for localhost development

## Cost Considerations

### OpenAI API Pricing (as of 2026)

**Whisper (STT):**
- $0.006 per minute of audio
- Typical doctor response: 30 seconds = $0.003

**TTS (Text-to-Speech):**
- $15 per 1M characters (tts-1 model)
- Typical response: 100 characters = $0.0015

**Estimated Cost per Conversation:**
- 10 exchanges = ~$0.05 USD
- Very affordable for training purposes

## Future Enhancements

### Planned Features
1. **Japanese Language Support** - Critical for target market
2. **Voice Cloning** - Customize family member voices
3. **Emotion Detection** - Analyze doctor's tone for better feedback
4. **Voice Speed Control** - Adjust based on emotional state
5. **Offline Mode** - Local speech processing for privacy

### Advanced Audio Features
- **Background Sounds** - Hospital ambiance for realism
- **Multiple Speakers** - Multiple family members in one scenario
- **Voice Interruptions** - More natural conversation flow
- **Emotion Intensity** - Varying voice characteristics within same emotion

## Troubleshooting

### Microphone Not Working

**Issue:** "Microphone access denied" error

**Solutions:**
1. Check browser permissions (click lock icon in address bar)
2. Reload the page after granting permission
3. Try a different browser
4. Check system microphone settings

### Audio Not Playing

**Issue:** Agent responses show but no sound

**Solutions:**
1. Check browser audio isn't muted
2. Verify system volume is up
3. Check Audio Mode is ON (blue button)
4. Try refreshing the page

### Transcription Errors

**Issue:** Speech not transcribed correctly

**Solutions:**
1. Speak clearly and at moderate pace
2. Use a good quality microphone
3. Reduce background noise
4. Keep recordings under 2 minutes for best results

### Slow Processing

**Issue:** Long delay between recording and response

**Solutions:**
1. Check internet connection speed
2. OpenAI API may be experiencing high load
3. Keep recordings concise (30-60 seconds ideal)
4. Consider upgrading to faster TTS model (tts-1-hd)

## API Documentation

For detailed API documentation, visit:
http://localhost:8000/docs

The interactive Swagger UI allows you to test audio endpoints directly.

## Testing Audio Features

### Quick Test Checklist

1. ✅ Microphone permission granted
2. ✅ Audio Mode is ON
3. ✅ Click microphone button
4. ✅ Speak: "I understand this must be difficult for you"
5. ✅ Stop recording
6. ✅ See transcribed text appear
7. ✅ Hear AI family member response
8. ✅ Check emotion indicator updates

### Example Test Conversation

**Doctor (You):** "I need to talk to you about your mother's condition."
**Family (AI):** *[In denial tone]* "What do you mean? She was fine yesterday! There must be some mistake."

**Doctor (You):** "I understand this is hard to hear. Unfortunately, the tests show her condition is very serious."
**Family (AI):** *[Shifting to bargaining]* "But... can't we try something else? Maybe a different hospital?"

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review browser console for errors (F12)
3. Check backend logs: `docker-compose logs backend`
4. Verify OpenAI API key is valid and has credits

## Credits

- **OpenAI Whisper:** Speech recognition
- **OpenAI TTS:** Voice synthesis  
- **FastAPI:** Backend framework
- **Next.js:** Frontend framework
- **Web Audio API:** Browser audio handling
