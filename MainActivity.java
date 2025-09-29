package com.example.myapplication;

import android.os.Bundle;
import android.Manifest;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;

public class MainActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Request permissions
        ActivityCompat.requestPermissions(this, new String[] {
                Manifest.permission.SEND_SMS,
                Manifest.permission.ACCESS_FINE_LOCATION,
                Manifest.permission.RECORD_AUDIO,
                Manifest.permission.CAMERA
        }, 1);

        // Trigger SOS
        SOSManager.sendSOS(this);

        // Voice trigger
        VoiceTriggerService.startListening(this);

        // Triple tap detection
        TapDetectorService.start(this);
    }
}

