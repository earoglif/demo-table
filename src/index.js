import 'jquery';
import 'bootstrap/dist/js/bootstrap';

import Table from './table.view';

const table = new Table({
    header: [
        {
            reference: 'id',
            name: 'ID',
            hold: true,
            visible: true,
            width: '50px'
        },
        {
            reference: 'login',
            name: 'Login',
            hold: false,
            visible: true
        },
        {
            reference: 'rate',
            name: 'Рейтинг',
            hold: false,
            visible: false,
            wrapper: 'colorizeNumber',
            width: '150px'
        },
        {
            reference: 'score',
            name: 'Счет',
            hold: false,
            visible: true,
            wrapper: 'roundNumber',
            width: '100px'
        },
        {
            reference: 'admin',
            name: 'Права администратора',
            hold: false,
            sorted: false,
            visible: true,
            wrapper: 'boolToIcon',
            width: '210px'
        },
        {
            reference: 'website',
            name: 'Сайт',
            hold: false,
            visible: true,
            wrapper: 'stringToLink',
            width: '200px'
        }
    ],
    sortParams: {
        orderBy: 'id',
        sort: 'ASC',
        dbLimit: 5
    },
    targetId: 'content'
});

$(document).ready(() => {

    table.render();

    $('#needMoreUsers').click(() => {
        table.loadUsers();
    });

    $('.table-container').on('click', '#tableUser thead td.sorted', (props) => {
        const tdId = props.target.id;
        const sort = (table.orderBy === tdId && table.sort === 'ASC') ? 'DESC' : 'ASC';

        console.log('TD-click:', tdId, table.orderBy, table.sort, props);

        table.sortUsers(tdId, sort);
    });

    $('#menuBtn').on('click', () => {
        table.openTableMenu();
    });

});
