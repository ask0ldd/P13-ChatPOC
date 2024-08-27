package com.example.chat.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.util.Date;

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

    // time + user.id
    @OneToOne(mappedBy = "owner")
    @JsonBackReference
    private ChatRoomHistory chatroom;

    public String getChatroomName() {
        return chatroom != null ? chatroom.getName() : null;
    }

    @NonNull
    @Column(name = "username", unique = true)
    private String username;

    @NonNull
    @Column(name = "lastname", unique = true)
    private String lastname;

    @NonNull
    @Column(name = "firstname", unique = true)
    private String firstname;

    @NonNull
    @Column(name = "phone", unique = true)
    private String phone;

    @Column(name = "email", unique = true)
    private String email;

    @NonNull
    @Column(name = "password")
    @JsonIgnore
    private String password;

    @NonNull
    @Column(name = "address_id", unique = true)
    private Long addressId;

    @NonNull
    @Column(name = "role")
    private String role;

    @NonNull
    @Column(name = "birthdate")
    private LocalDate birthdate;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Date creation;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Date update;
}
