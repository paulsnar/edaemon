'use strict';

window.EdaemonAdmin = {
    ChangeList: {
        init: (target, { data }) => {
            require.ensure([], () => {
                const ChangeList = require('./ChangeList').default;
                ChangeList.init(target, data);
            }, 'ChangeList');
        }
    },
    ChangeEntryPane: {
        init: (target) => {
            require.ensure([], () => {
                const ChangeEntryPane = require('./ChangeEntryPane').default;
                ChangeEntryPane.init(target);
            }, 'ChangeEntryPane');
        }
    }
}
