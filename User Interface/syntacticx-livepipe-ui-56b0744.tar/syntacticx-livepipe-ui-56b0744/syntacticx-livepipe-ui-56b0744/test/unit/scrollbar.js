module('Control.ScrollBar');

test('Basic requirements', function () {
    expect(1);
    ok(Control.ScrollBar, 'Control.ScrollBar');
});

test('options', function () {
    expect(1);
    var s = new Control.ScrollBar('scrollbar_container', 'scrollbar_track', { active_class_name: 'scrollbar_test' });
    ok($('scrollbar_container').hasClassName('scrollbar_test'), 'an active class name.');
    s.destroy();
});

test('Add ScrollBar instance', function () {
    expect(1);
    var originalLength = Control.ScrollBar.instances.length;
    var s = new Control.ScrollBar('scrollbar_container', 'scrollbar_track');
    equals(Control.ScrollBar.instances.length-originalLength, 1, 'number of new instances.');
    s.destroy();
});

test('ScrollBar custom event', function () {
    expect(2);
    var eventName = 'my:event';
    // create scrollbar
    var s = new Control.ScrollBar('scrollbar_container', 'scrollbar_track', { custom_event: eventName });
    var registry = Element.retrieve('scrollbar_container', 'prototype_event_registry');
    var responders = registry.get(eventName);
    equals(responders.length, 1, 'Number of custom event listeners');
    s.destroy();
    // should be no listeners after we destroyed ScrollBar object.
    var registry = Element.retrieve('scrollbar_container', 'prototype_event_registry');
    var responders = registry.get(eventName);
    equals(responders.length, 0, 'Should be no custom event listeners after destruction');
});

test('ScrollBar custom event handler', function () {
    expect(3);
    var eventName = 'my:event_handler';
    var eventHandler = function(e) { };
    // create scrollbar
    var s = new Control.ScrollBar('scrollbar_container', 'scrollbar_track',
            {
                custom_event: eventName,
                custom_event_handler: eventHandler
            });
    var registry = Element.retrieve('scrollbar_container', 'prototype_event_registry');
    var responders = registry.get(eventName);
    equals(responders.length, 1, 'Custom event listener');
    equals(responders[0].handler, eventHandler, 'Custom event handler');
    s.destroy();
    // should be no listeners after we destroyed ScrollBar object.
    var registry = Element.retrieve('scrollbar_container', 'prototype_event_registry');
    var responders = registry.get(eventName);
    equals(responders.length, 0, 'Should be no custom event listeners after destruction');
});
