package com.bech.cigpp.config;

import com.bech.cigpp.firebase.FirebaseAuthenticationFilter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@EnableWebSecurity
@Configuration
public class SecurityConfig {

    @Value("${firebase.enabled:false}")
    private boolean firebaseEnabled;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        HttpSecurity httpSecurity = http
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll()); // For now, permit all requests

        // Only add Firebase filter if Firebase is enabled
        if (firebaseEnabled) {
            httpSecurity.addFilterBefore(firebaseAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
            System.out.println("Firebase authentication filter added");
        } else {
            System.out.println("Firebase authentication disabled - all requests permitted");
        }

        return httpSecurity.build();
    }

    @Bean
    public FirebaseAuthenticationFilter firebaseAuthenticationFilter() {
        return new FirebaseAuthenticationFilter();
    }
}