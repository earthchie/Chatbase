# Chatbase
The proof of concept of how to implement Chat with Firebase Database

# Firebase Rule

```
{
  "rules": {
    ".read": "true",
    ".write": "true",
    
    "chatroom":{
      ".indexOn": "when"
    }
  }
}
```