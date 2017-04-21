(function () {
    'use strict';

    var ChatRoom = firebase.database().ref('chatroom'),
        $set_name = document.getElementById('set-name'),
        $name = $set_name.getElementsByTagName('input')[0],
        $chatroom = document.getElementById('chatroom'),
        $chatroom_body = $chatroom.getElementsByClassName('chat-body')[0],
        $message_form = document.getElementById('message'),
        $message = $message_form.getElementsByTagName('input')[0],
        username,
        active_message,
        active,
        newMessage = function () {
            ChatRoom.push({
                by: username,
                message: '',
                status: 'initial',
                when: new Date().getTime()
            }).then(function (data) {
                active_message = ChatRoom.child(data.getKey());
                active = true;
            });
        },
        renderChat = function (r) {
            r.forEach(function (data) {

                var m = data.val(),
                    $m = $chatroom.querySelector('[data-id="' + data.getKey() + '"]'),
                    $bubble,
                    $name;

                if (!$m) {
                    
                    $m = document.createElement('div');
                    $m.setAttribute('data-id', data.getKey());
                    
                    if (m.by === 'system') {

                        $m.classList.add('uk-text-center');
                        $m.classList.add('font-0-8-em');
                        $m.innerHTML = m.message;
                        
                    } else {
                        
                        $m.classList.add('message');

                        $name = document.createElement('small');
                        $name.innerText = m.by;
                        $m.appendChild($name);

                        $m.innerHTML += '<div class="bubble"></div>';
                        
                        if (m.by === username) {
                            $m.classList.add('my');
                        }
                        
                    }
                    $chatroom_body.appendChild($m);
                    
                }
                
                // ignore message with status "typing" that older than 15 min
                if (m.status === 'typing' && (new Date().getTime()) - m.when > 9e5) {
                    m.message = '';
                }
                
                $m.title = new Date(m.when).toString();
                
                if (m.by !== 'system') {
                    
                    $bubble = $m.getElementsByClassName('bubble')[0];
                    $bubble.innerText = m.message;
                    
                    if (m.status === 'done') {
                        $m.classList.remove('typing');
                    } else {
                        $m.classList.add('typing');
                    }
                    
                    if (!$bubble.innerText) {
                        $m.parentNode.removeChild($m);
                    }
                    
                }
                
                $chatroom_body.scrollTop = $chatroom_body.scrollHeight;

            });
        };

    // create random username
    $name.value = 'CrazyAlpaca' + Math.floor(Math.random() * 1e4);
    $set_name.onsubmit = function (e) {
        e.preventDefault();

        var input = $name.value;

        if (input) {
            username = input;
            
            $set_name.style.display = 'none';
            $chatroom.style.display = 'block';

            // notify people that new user has join the room
            ChatRoom.push({
                by: 'system',
                message: '<b>' + username + '</b> has joined the room.',
                status: 'logs',
                when: new Date().getTime()
            });

            // start new message
            newMessage();
            
            // retrieve chat history of the last 6 hour up to 200 messages, once.
            ChatRoom.orderByChild('when').startAt(new Date().getTime() - 36e5 * 6).limitToLast(200).once('value', function (r) {
                $chatroom_body.innerHTML = '';
                renderChat(r);
                $message.focus();
            });

        }

        return false;
    };

    // save message when press enter
    $message_form.onsubmit = function (e) {
        e.preventDefault();

        active = false;
        var message = $message.value;

        // trigger on message save down below
        active_message.once('value', function (r) {

            $message.value = '';// clear chatbox
            
            // start new message
            newMessage();

        });

        // save
        active_message.set({
            by: username,
            message: message,
            status: 'done',
            when: new Date().getTime()
        });
        
        return false;
    };

    // update message onkeyup
    $message.onkeyup = function () {
        if (active) {
            active_message.set({
                by: username,
                message: this.value,
                status: 'typing',
                when: new Date().getTime()
            });
        }
    };

    // render new message
    ChatRoom.orderByChild('when').limitToLast(1).on('value', function (r) {
        renderChat(r);
    });

}());