package com.example.myapplication;

import android.content.Context;
import android.hardware.*;

public class TapDetectorService {
    public static void start(Context context) {
        SensorManager manager = (SensorManager) context.getSystemService(Context.SENSOR_SERVICE);
        Sensor accelerometer = manager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);

        manager.registerListener(new SensorEventListener() {
            int tapCount = 0;
            long lastTapTime = 0;

            @Override
            public void onSensorChanged(SensorEvent event) {
                float z = event.values[2];
                long now = System.currentTimeMillis();

                if (Math.abs(z) > 15) {
                    if (now - lastTapTime < 1000) tapCount++;
                    else tapCount = 1;
                    lastTapTime = now;

                    if (tapCount == 3) {
                        SOSManager.sendSOS(context);
                        new android.os.Handler().postDelayed(() -> VideoRecorder.startRecording(), 3000);
                    }
                }
            }

            @Override
            public void onAccuracyChanged(Sensor sensor, int accuracy) {}
        }, accelerometer, SensorManager.SENSOR_DELAY_NORMAL);
    }
}
