package com.example.myapplication;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.speech.*;

public class VoiceTriggerService {
    public static void startListening(Context context) {
        SpeechRecognizer recognizer = SpeechRecognizer.createSpeechRecognizer(context);
        Intent intent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
        intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);

        recognizer.setRecognitionListener(new RecognitionListener() {
            @Override
            public void onResults(Bundle results) {
                for (String match : results.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)) {
                    if (match.toLowerCase().contains("help")) {
                        SOSManager.sendSOS(context);
                    }
                }
            }

            public void onError(int error) {}
            public void onReadyForSpeech(Bundle params) {}
            public void onBeginningOfSpeech() {}
            public void onRmsChanged(float rmsdB) {}
            public void onBufferReceived(byte[] buffer) {}
            public void onEndOfSpeech() {}
            public void onPartialResults(Bundle partialResults) {}
            public void onEvent(int eventType, Bundle params) {}
        });

        recognizer.startListening(intent);
    }
}
