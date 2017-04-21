# Chatbase 
The proof of concept of how to implement Chat with Firebase Database

# [Demo](https://earthchie.github.io/Chatbase/)
[https://earthchie.github.io/Chatbase/](https://earthchie.github.io/Chatbase/)

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
