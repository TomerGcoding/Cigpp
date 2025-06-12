package com.bech.cigpp.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

@Configuration
public class FireBaseConfig {

    @Value("${firebase.enabled:false}")
    private boolean firebaseEnabled;

    @Value("${firebase.credentials.path:cigpp-proto-firebase-adminsdk-fbsvc-f246536198.json}")
    private String credentialsPath;

    @PostConstruct
    public void initialize() throws IOException {
        if (!firebaseEnabled) {
            System.out.println("Firebase is disabled. Set firebase.enabled=true to enable.");
            return;
        }

        try {
            Resource resource = new ClassPathResource(credentialsPath);

            if (!resource.exists()) {
                System.err.println("Firebase credentials file not found: " + credentialsPath);
                System.out.println("Firebase initialization skipped. API will work without authentication.");
                return;
            }

            InputStream serviceAccount = resource.getInputStream();

            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();

            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
                System.out.println("Firebase initialized successfully");
            }

            serviceAccount.close();
        } catch (Exception e) {
            System.err.println("Failed to initialize Firebase: " + e.getMessage());
            System.out.println("API will continue without Firebase authentication");
        }
    }
}