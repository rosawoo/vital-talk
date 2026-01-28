# 🎤 Audio Interaction Quick Start

## ✅ You're Ready to Use Audio!

Your MVP now supports **realistic voice interactions** for medical conversation training.

## 🚀 Try It Now

### 1. Open Your Browser
Navigate to: **http://localhost:3000**

### 2. Select a Scenario
- Click "Get Started" or go to Scenarios
- Choose any of the 3 available training scenarios
- Click "Start Scenario"

### 3. Start Speaking!

**The conversation page opens with Audio Mode ON by default:**

1. **Click the red microphone button** 🎤 "Hold to Speak"
2. **Speak naturally** as if you're talking to a real family member:
   - "Hello, thank you for meeting with me today."
   - "I need to discuss your mother's condition with you."
3. **Click "Stop Recording"** when done
4. **Watch the magic happen:**
   - Your speech is transcribed automatically
   - Message is sent to the AI
   - Family member responds with **emotional voice synthesis**
   - Voice changes based on their emotional state!

### 4. Experience Realistic Emotions

The AI family member's voice changes based on emotional state:
- **Denial:** Defensive, disbelieving tone
- **Anger:** Intense, frustrated voice
- **Sadness:** Soft, emotional tone
- **Bargaining:** Hopeful, pleading voice
- **Acceptance:** Peaceful, resigned tone

## 🎛️ Controls

### Audio Mode Toggle
- **Audio Mode (default):** 🎤 Voice input + voice responses
- **Text Mode:** ⌨️ Keyboard input only

Click the mode button in the top-right to switch anytime.

### Other Controls
- **💡 Get Hint:** Coaching suggestions from the AI coach
- **⏮️ Redo:** Undo last exchange and try again
- **✓ End & Get Feedback:** Complete session and see evaluation

## 📊 What's Happening Behind the Scenes

### Your Voice → Text (Whisper AI)
```
Your speech → Microphone → OpenAI Whisper → Transcribed text
```

### AI Response → Voice (TTS)
```
AI generates response → OpenAI TTS → Emotional voice → Your speakers
```

## 💡 Tips for Best Experience

### For Clear Transcription:
1. **Speak clearly** at a moderate pace
2. **Reduce background noise** (close windows, turn off fans)
3. **Use a good microphone** (built-in works, headset is better)
4. **Keep responses concise** (30-60 seconds ideal)

### For Realistic Training:
1. **Use Audio Mode** for immersive experience
2. **Pay attention to emotions** - watch the indicator
3. **Listen to voice changes** - they reflect emotional state
4. **Practice different approaches** - use the Redo feature
5. **Request hints** when stuck

## 🎯 Example Training Session

**Scenario:** Terminal Cancer - Family in Denial

**You (speaking):** "I need to discuss your mother's test results with you."

**AI Family (denial voice - defensive):** "What do you mean? She was fine yesterday! You must have mixed up the charts."

**You (speaking):** "I understand this is shocking. The scans show stage 4 cancer that has spread."

**AI Family (shifting to anger - intense):** "No! This can't be right! You're supposed to fix her, that's your job!"

**You (speaking):** "I hear your frustration. This is not the news anyone wants to hear. Let me explain what we found..."

**AI Family (bargaining voice - hopeful):** "But... there must be something we can try. What about experimental treatments?"

## 🔧 Troubleshooting

### "Microphone access denied"
→ Click the 🔒 lock icon in your browser's address bar
→ Allow microphone access
→ Refresh the page

### No audio playback
→ Check system volume
→ Unmute browser tab
→ Verify "Audio Mode" button is blue (ON)

### Transcription seems wrong
→ Speak more clearly and slowly
→ Move closer to microphone
→ Reduce background noise

## 📱 Browser Compatibility

✅ **Works great on:**
- Chrome / Edge (recommended)
- Firefox
- Safari
- Opera

❌ **Not supported:**
- Internet Explorer
- Very old browser versions

## 🎓 Training Benefits

### Why Audio Mode is Better:

1. **More Realistic** - Mimics real hospital conversations
2. **Faster** - Speaking is quicker than typing
3. **Emotional Immersion** - Hear the pain, anger, hope
4. **Natural Flow** - Feels like actual patient interactions
5. **Better Feedback** - Coach can evaluate verbal delivery

## 📈 Next Steps

1. **Complete a full scenario** in Audio Mode
2. **Try different emotional scenarios**
3. **Experiment with Redo** to practice alternatives
4. **Use hints** to learn best practices
5. **Review feedback** after each session

## 🌟 Pro Tips

- **Don't rush** - Take time to respond thoughtfully
- **Mirror emotions** - Acknowledge their feelings
- **Use pauses** - Silence can be powerful
- **Watch the emotion indicator** - Adjust your approach
- **Practice, practice, practice** - Each attempt gets better

---

## Need Help?

- **Full Documentation:** See `AUDIO_FEATURES.md`
- **API Docs:** http://localhost:8000/docs
- **Check Logs:** `docker-compose logs backend`

**Ready to practice? Go to:** http://localhost:3000

Good luck with your training! 🏥
