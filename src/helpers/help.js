'use strict';

const helpMessage = `
$ organize --help

Usage
  $ organize [<options> ...]
  Options
      none             Display board view
    --help,     -h     Help log message
    --version,  -v     Current version
    --task,     -t     Create task
    --note,     -n     Create note
    --remove    -r     Remove items
    --done,     -d     Mark task done/pending
    --priority, -p     Update priority of task
    --board     -b     Change board name
    --edit,     -e     Edit item description
    --move,     -m     Move item between boards
    --find,     -f     Find item/boards
    --star,     -s     Star/unstar item
    --copy,     -c     Copy item description to clipboard
    --unpin,    -u     Remove all completed tasks
    --timeline, -i     Display timeline view
    --begin,    -b     Begin/Pause task
    --list,     -l     List items by attributes
    --erase,    -e     Clear all the items
    --mark             Add book mark
    --unmark           Remove book mark
    --get              Copy bookmark to clipboard
    --bookmarks        Display all bookmarks

  Examples
    $ organize
    $ organize --help
    $ organize --version
    $ organize --task Check commit b:project p:2
    $ organize --note Complexity of Merge-sort is O(nlogn) b:project
    $ organize --remove 1
    $ organize --done 2
    $ organize --priority 2 p:3
    $ organize --board c:project n:coding
    $ organize --edit 2 Some new task description
    $ organize --move 1 b:college
    $ organize --find college
    $ organize --star 3
    $ organize --copy 1 2 3
    $ organize --unpin
    $ organize --timeline
    $ organize --begin 2
    $ organize --list pending
    $ organize --erase
    $ organize --mark http://abc.com abc
    $ organize --unmark abc
    $ organize --get abc
    $ organize --bookmarks
`;

module.exports = helpMessage;