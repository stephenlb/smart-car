// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// DOOR LOCK INDICATOR
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
var channel = 'smart-car'
,   ready   = false
,   pubnub  = PUBNUB({
    publish_key   : 'pub-c-b6b25975-7d5a-4323-9bfe-308f40a6c5a0',
    subscribe_key : 'sub-c-8cc85050-9705-11e4-a07f-02ee2ddab7fe'
});

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// LOCK/UNLOCK RECEIVER INDICATOR
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
pubnub.subscribe({
    channel : channel,
    message : receiver,
    connect : function() { ready = true }
});

function receiver(message) {
    set_indicator(message.action);
}

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// LOCK/UNLOCK SENDER
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
function send_command(cmd) {
    pubnub.publish({
        channel : channel,
        message : cmd
    });
}

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// PREVENT SCROLLING
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
PUBNUB.bind( 'touchmove', document, function(e) {} );

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// BUTTON PRESSES
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
var door_lock      = PUBNUB.$('door-lock')
,   door_unlock    = PUBNUB.$('door-unlock')
,   door_indicator = PUBNUB.$('door-indicator');

PUBNUB.bind( 'mousedown,touchstart', door_lock, function(e) {
    if (!ready) return;
    set_indicator( 'circle-o-notch fa-spin', 5000 );
    send_command({ action : 'lock' });
} );
PUBNUB.bind( 'mousedown,touchstart', door_unlock, function(e) {
    if (!ready) return;
    set_indicator( 'circle-o-notch fa-spin', 5000 );
    send_command({ action : 'unlock-alt' });
} );

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// LOCK/UNLOCK INDICATION
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
function set_indicator( lock, wait ) {
    door_indicator.className = "door-indicator-on";
    clearTimeout(set_indicator.ival);
    set_indicator.ival = setTimeout( function() {
        door_indicator.className = "door-indicator-off";
    }, wait || 1400 );
    door_indicator.innerHTML = '<i class="fa fa-'+lock+'"></i>';
}
