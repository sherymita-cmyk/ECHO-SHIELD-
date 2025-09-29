package com.example.myapplication;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.widget.Toast;

public class SOSManager {
    public static void sendSOS(Context context) {
        String message = "SOS! I need help. Location: https://maps.google.com/?q=28.6139,77.2090";

        String[] contacts = {
                "+911234567890", "+919876543210", "+911112223334",
                "+919998887776", "+911234443322", "+919191919191", "+917171717171"
        };

        for (String contact : contacts) {
            // SMS
            Intent smsIntent = new Intent(Intent.ACTION_SENDTO);
            smsIntent.setData(Uri.parse("smsto:" + contact));
            smsIntent.putExtra("sms_body", message);
            context.startActivity(smsIntent);

            // WhatsApp
            Intent waIntent = new Intent(Intent.ACTION_SEND);
            waIntent.putExtra(Intent.EXTRA_TEXT, message);
            waIntent.setType("text/plain");
            waIntent.setPackage("com.whatsapp");
            try {
                context.startActivity(waIntent);
            } catch (Exception e) {
                Toast.makeText(context, "WhatsApp not installed", Toast.LENGTH_SHORT).show();
            }
        }
    }
}
