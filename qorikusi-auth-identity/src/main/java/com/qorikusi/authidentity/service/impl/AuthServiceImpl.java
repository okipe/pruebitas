package com.qorikusi.authidentity.service.impl;

import com.qorikusi.authidentity.domain.model.dto.request.*;
import com.qorikusi.authidentity.domain.model.dto.response.LoginResponse;
import com.qorikusi.authidentity.domain.model.entity.Administrador;
import com.qorikusi.authidentity.domain.model.entity.Cliente;
import com.qorikusi.authidentity.domain.repository.AdministradorRepository;
import com.qorikusi.authidentity.domain.repository.ClienteRepository;
import com.qorikusi.authidentity.exception.ClientNotFoundException;
import com.qorikusi.authidentity.exception.EmailFoundException;
import com.qorikusi.authidentity.exception.InvalidTokenException;
import com.qorikusi.authidentity.exception.UserFoundException;
import com.qorikusi.authidentity.service.AuthService;
import com.qorikusi.authidentity.service.EmailService;
import com.qorikusi.authidentity.service.JwtService;
import com.qorikusi.authidentity.util.Constants;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AdministradorRepository administradorRepository;
    private final ClienteRepository clienteRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;
    private final AuthenticationManager authenticationManager;

    @Value("${app.enlace.reset-password}")
    private String enlace;

    @Override
    public void registrarAdministrador(RegisterAdminRequest request) {
        administradorRepository.findByUsuario(request.getUsuario())
                .ifPresentOrElse(
                        admin -> {
                            if (admin.isEstado()) {
                                log.error("El usuario {} ya existe.", request.getUsuario());
                                throw new UserFoundException("El usuario ya existe");
                            }
                            admin.setContrasenia(passwordEncoder.encode(request.getContrasenia()));
                            admin.setEstado(true);
                            administradorRepository.save(admin);
                        },
                        () -> {
                            Administrador nuevoAdmin = new Administrador();
                            nuevoAdmin.setUsuario(request.getUsuario());
                            nuevoAdmin.setContrasenia(passwordEncoder.encode(request.getContrasenia()));
                            nuevoAdmin.setEstado(true);
                            administradorRepository.save(nuevoAdmin);
                        }
                );
    }


    @Override
    public void registrarCliente(RegisterClientRequest request) {
        clienteRepository.findByCorreo(request.getCorreo())
                .ifPresentOrElse(
                        cliente -> {
                            if (cliente.isEstado()) {
                                log.error("El correo {} ya está registrado.", request.getCorreo());
                                throw new EmailFoundException("El correo ya está registrado");
                            }
                            cliente.setContrasenia(passwordEncoder.encode(request.getContrasenia()));
                            cliente.setFechaRegistro(LocalDate.now());
                            cliente.setEstado(true);
                            clienteRepository.save(cliente);
                        },
                        () -> {
                            Cliente nuevoCliente = new Cliente();
                            nuevoCliente.setCorreo(request.getCorreo());
                            nuevoCliente.setContrasenia(passwordEncoder.encode(request.getContrasenia()));
                            nuevoCliente.setFechaRegistro(LocalDate.now());
                            nuevoCliente.setEstado(true);
                            clienteRepository.save(nuevoCliente);
                        }
                );
    }

    @Override
    public LoginResponse iniciarSesion(LoginRequest request) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsuarioOCorreo(),
                        request.getContrasenia()));

        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        String token = jwtService.generateAccessToken(
                userDetails.getUsername(),
                userDetails.uuid(),
                userDetails.getAuthorities().iterator().next().getAuthority());

        List<String> roles = auth.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .toList();

        return new LoginResponse(token, Constants.BEARER, Constants.ACCESS_TOKEN_EXP_SECONDS, roles);
    }

    @Override
    public void recuperarContrasenia(ForgotPasswordRequest request) {
        Cliente cliente = clienteRepository.findByCorreo(request.getCorreo())
                .orElseThrow(() -> {
                    log.error("El correo {} no existe.", request.getCorreo());
                    return new ClientNotFoundException("El correo no existe");
                });

        String token = jwtService.generatePasswordResetToken(cliente.getCorreo(), cliente.getUuidCliente());
        emailService.enviarCorreo(cliente.getCorreo(), enlace + token);
    }

    @Override
    public void cambiarContrasenia(String token, ResetPasswordRequest request) {
        Claims claims = jwtService.parsePasswordResetToken(token);

        if (!"pwd-reset".equals(claims.get("typ"))) {
            throw new InvalidTokenException("Token inválido");
        }

        UUID uuidCliente = UUID.fromString(claims.get("uuid", String.class));

        Cliente cliente = clienteRepository.findByUuidCliente(uuidCliente)
                .orElseThrow(() -> new ClientNotFoundException("Usuario no encontrado"));

        cliente.setContrasenia(passwordEncoder.encode(request.getNuevaContrasenia()));
        clienteRepository.save(cliente);
    }
}