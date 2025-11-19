function throttle(fn, delay){
    let lastCall = 0;
    return function(...args){
        const now = Date.now();
        if(now - lastCall < delay){
            return;
        }
        lastCall = now;
        return fn(...args);
    };
}
function sendChatMessage(message){
    console.log(`Sending message`, message);
}

const senChatMessageWithSlowMode = throttle(sendChatMessage, 2 * 1000);

setTimeout(() => senChatMessageWithSlowMode("Hi"), 0);
senChatMessageWithSlowMode("Hello");
senChatMessageWithSlowMode("Hey there");
senChatMessageWithSlowMode("Howdy");
setTimeout(() => senChatMessageWithSlowMode("Hey are you listening"), 3000);


