package com.qorikusi.authidentity.service.impl;

import com.qorikusi.authidentity.domain.repository.AdministradorRepository;
import com.qorikusi.authidentity.domain.repository.ClienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final AdministradorRepository administradorRepository;
    private final ClienteRepository clienteRepository;

    @Override
    public UserDetails loadUserByUsername(String user) {
        return administradorRepository.findByUsuario(user)
                .map(a -> buildUserDetails(
                        a.getUsuario(),
                        a.getContrasenia(),
                        a.getUuidAdministrador(),
                        "ROLE_ADMIN",
                        a.isEstado()
                ))
                .orElseGet(() -> clienteRepository.findByCorreo(user)
                        .map(c -> buildUserDetails(
                                c.getCorreo(),
                                c.getContrasenia(),
                                c.getUuidCliente(),
                                "ROLE_CLIENTE",
                                c.isEstado()
                        ))
                        .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + user))
                );
    }

    private UserDetails buildUserDetails(String username, String password, UUID uuid, String role, boolean estado) {
        return new UserDetailsImpl(username, password, uuid, List.of(new SimpleGrantedAuthority(role)), estado);
    }
}