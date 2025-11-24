package com.qorikusi.authidentity.service.impl;

import com.qorikusi.authidentity.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {
    private final JavaMailSender mailSender;

    @Override
    public void enviarCorreo(String destinatario, String enlace) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(destinatario);
        message.setSubject("Recuperación de contraseña - Qorikusi");
        message.setText("Haz clic en el siguiente enlace para restablecer tu contraseña:\n\n" + enlace);
        message.setFrom("no-reply@demomailtrap.co");

        mailSender.send(message);
    }
}