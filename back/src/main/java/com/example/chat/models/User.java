package com.example.chat.models;

import lombok.*;
import jakarta.persistence.*;

@Entity(name = "users")
@Table(name = "users", uniqueConstraints = {
        @UniqueConstraint(columnNames = "username"),
})
@Data
@Builder
@NoArgsConstructor
@RequiredArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NonNull
    @Column(name = "username", unique = true)
    private String name;

    @NonNull
    private String password;
}
