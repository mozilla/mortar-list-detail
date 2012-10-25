
define(function() {
    return function(Item, items) {
        items.add(new Item({ id: 0,
                             title: 'Cook yummy food',
                             desc: 'COOK ALL THE THINGS',
                             date: new Date() }));
        items.add(new Item({ id: 1,
                             title: 'Make things',
                             desc: 'Make this look like that',
                             date: new Date(12, 9, 5) }));
        items.add(new Item({ id: 2,
                             title: 'Move stuff',
                             desc: 'Move this over there',
                             date: new Date(12, 10, 1) }));
        // items.add(new Item({ id: 3,
        //                      title: 'Cook yummy food',
        //                      desc: 'COOK ALL THE THINGS',
        //                      date: new Date() }));
        // items.add(new Item({ id: 4,
        //                      title: 'Make things',
        //                      desc: 'Make this look like that',
        //                      date: new Date(12, 9, 5) }));
        // items.add(new Item({ id: 5,
        //                      title: 'Move stuff',
        //                      desc: 'Move this over there',
        //                      date: new Date(12, 10, 1) }));
        // items.add(new Item({ id: 6,
        //                      title: 'Cook yummy food',
        //                      desc: 'COOK ALL THE THINGS',
        //                      date: new Date() }));
        // items.add(new Item({ id: 7,
        //                      title: 'Make things',
        //                      desc: 'Make this look like that',
        //                      date: new Date(12, 9, 5) }));
        // items.add(new Item({ id: 8,
        //                      title: 'Move stuff',
        //                      desc: 'Move this over there',
        //                      date: new Date(12, 10, 1) }));
        // items.add(new Item({ id: 9,
        //                      title: 'Cook yummy food',
        //                      desc: 'COOK ALL THE THINGS',
        //                      date: new Date() }));
        // items.add(new Item({ id: 10,
        //                      title: 'Make things',
        //                      desc: 'Make this look like that',
        //                      date: new Date(12, 9, 5) }));
        // items.add(new Item({ id: 11,
        //                      title: 'Move stuff',
        //                      desc: 'Move this over there',
        //                      date: new Date(12, 10, 1) }));
    };
});