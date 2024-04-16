package org.project.boardreact.configs;

import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.ResourceBundleMessageSource;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.http.HttpMethod;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;


@Configuration
@EnableJpaAuditing
public class MvcConfig implements WebMvcConfigurer {

    @Bean
    public MessageSource messageSource() {
        ResourceBundleMessageSource ms = new ResourceBundleMessageSource();
        ms.setDefaultEncoding("UTF-8");
        ms.setBasenames("messages.commons", "messages.validations", "messages.errors");

        return ms;
    }

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.addAllowedOrigin("http://3.36.76.61:3000");
        config.addAllowedOrigin("http://localhost:3000");
        config.addAllowedOrigin("http://www.freeboard.store");
        config.addAllowedOrigin("http://www.freeboard.store:3000");



        // 메서드 및 헤더 제한
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH"));
        config.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));

        // 자격 증명 사용 설정
        config.setAllowCredentials(true);
        config.addAllowedMethod(HttpMethod.OPTIONS);

        // 최대 연령 설정
        config.setMaxAge(3600L);


        source.registerCorsConfiguration("/api/**", config);

        return new CorsFilter(source);
    }
}
