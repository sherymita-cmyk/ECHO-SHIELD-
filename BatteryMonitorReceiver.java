package com.example.myapplication;

import android.content.*;
import android.os.BatteryManager;

public class BatteryMonitorReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        int level = intent.getIntExtra(BatteryManager.EXTRA_LEVEL, -1);
        if (level <= 3) {
            SOSManager.sendSOS(context);
        }
    }
}
