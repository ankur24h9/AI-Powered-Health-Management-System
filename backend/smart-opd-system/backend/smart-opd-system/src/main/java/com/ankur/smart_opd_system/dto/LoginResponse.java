package com.ankur.smart_opd_system.dto;

public class LoginResponse {

    private String token;
    private String role;
    private String username;
    private String email;

    public LoginResponse(String token, String role, String username, String email) {
        this.token = token;
        this.role = role;
        this.username = username;
        this.email = email;
    }

    public String getToken() {
        return token;
    }

    public String getRole() {
        return role;
    }
    public String getUsername() {
        return username;
    }
    public String getEmail() {
        return email;
    }
    public void setToken(String token) {
        this.token = token;
    }
    public void setRole(String role) {
        this.role = role;
    }
    public void setUsername(String username) {
        this.username = username;       
    }
    public void setEmail(String email) {
        this.email = email;
    }

}