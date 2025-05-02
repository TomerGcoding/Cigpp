package com.bech.cigpp.firebase;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

public class FirebaseAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(FirebaseAuthenticationFilter.class);


    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {
        logger.info("Firebase token received.");

        String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);  // no token, continue
            return;
        }

        String token = header.substring(7); // remove "Bearer "

        try {
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(token);
            String uid = decodedToken.getUid();

            // You could build roles/authorities here based on Firebase claims
            var auth = new UsernamePasswordAuthenticationToken(uid, null, List.of());
            SecurityContextHolder.getContext().setAuthentication(auth);
            logger.info("Token verified. UID: {}", uid);

        } catch (FirebaseAuthException e) {
            logger.error("Firebase token verification failed: {}", e.getMessage());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");

            var out = response.getWriter();
            out.print("""
        {
            "error": "Firebase authentication failed",
            "message": "%s",
            "code": "%s"
        }
        """.formatted(e.getMessage(), e.getAuthErrorCode().name()));
            out.flush();
            return;
        }

        filterChain.doFilter(request, response);
    }
}


