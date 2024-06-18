package com.example.chat.models;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ConnectedUser extends User{
    private boolean isAssignedToAgent;
    private String chatSessionId;

    public ConnectedUser(){
        this.isAssignedToAgent = false;
    }

    public ConnectedUser(boolean isAssigned){
        this.isAssignedToAgent = isAssigned;
    }

    public void assign(){
        this.isAssignedToAgent = true;
    }

    public void unassign(){
        this.isAssignedToAgent = false;
    }
}
