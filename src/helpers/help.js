'use strict';

const helpMessage = `
  Usage
    $ handle [<options> ...]
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

    Examples
      $ handle
      $ handle --help
      $ handle --version
      $ handle --task Check commit b:project p:2
      $ handle --note Complexity of Merge-sort is O(nlogn) b:project
      $ handle --remove 1
      $ handle --done 2
      $ handle --priority 2 p:3
      $ handle --board c:project n:coding
      $ handle --edit 2 Some new task description
      $ handle --move 1 b:college
      $ handle --find college
      $ handle --star 3
      $ handle --copy 1 2 3
      $ handle --unpin
      $ handle --timeline
      $ handle --begin 2
      $ handle --list pending
      $ handle --erase
`;

module.exports = helpMessage;