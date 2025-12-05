package com.qorikusi.orders.config;

import com.qorikusi.orders.util.Constants;
import feign.RequestInterceptor;
import feign.RequestTemplate;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Component
public class FeignAuthInterceptor implements RequestInterceptor {

    @Override
    public void apply(RequestTemplate template) {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();

        if (attributes != null) {
            HttpServletRequest request = attributes.getRequest();
            String token = request.getHeader(Constants.AUTHORIZATION_HEADER);
            if (token != null && !token.isBlank()) {
                template.header(Constants.AUTHORIZATION_HEADER, token);
            }
        }
    }
}