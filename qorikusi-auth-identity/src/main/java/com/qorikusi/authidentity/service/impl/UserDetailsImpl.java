package com.qorikusi.authidentity.service.impl;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.UUID;

public record UserDetailsImpl(String user, String password, UUID uuid,
                              Collection<? extends GrantedAuthority> authorities,
                              boolean enabled) implements UserDetails {

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.authorities;
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public String getUsername() {
        return this.user;
    }

    @Override
    public boolean isEnabled() {
        return this.enabled;
    }
}