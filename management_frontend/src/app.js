'use strict';

import ChangeList from './ChangeList';

window.EdaemonAdmin = {
    ChangeList: {
        init: (target, { data }) => {
            require.ensure([], () => {
                const ChangeList = require('./ChangeList').default;
                ChangeList.init(target, data);
            }, 'ChangeList');
        }
    }
}
