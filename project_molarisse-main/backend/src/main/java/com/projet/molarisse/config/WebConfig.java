package com.projet.molarisse.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Value("${file.demande-upload-dir}")
    private String demandeUploadDir;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:4200")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                .allowedHeaders("*")
                .exposedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Register resource handler for profile pictures
        Path profileUploadPath = Paths.get(uploadDir);
        String profileUploadAbsolutePath = profileUploadPath.toFile().getAbsolutePath();
        
        registry.addResourceHandler("/api/users/profile/picture/**")
                .addResourceLocations("file:" + profileUploadAbsolutePath + "/");

        // Register resource handler for demande pictures
        Path demandeUploadPath = Paths.get(demandeUploadDir);
        String demandeUploadAbsolutePath = demandeUploadPath.toFile().getAbsolutePath();
        
        registry.addResourceHandler("/api/v1/demandes/pictures/**")
                .addResourceLocations("file:" + demandeUploadAbsolutePath + "/");
                
        // Register resource handler for static resources (only for non-API paths)
        registry.addResourceHandler("/static/**")
                .addResourceLocations("classpath:/static/");
    }
}