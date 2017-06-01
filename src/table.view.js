import ctrlTable from './table.controller';
import RenderField from './RenderField';
import ModalWindow from './ModalWindow';

class Table extends RenderField{
    constructor(props) {
        super(props);
        const lsSortParams = JSON.parse(localStorage.getItem('sortParams'));
        const lsHeader = JSON.parse(localStorage.getItem('tableHeader'));

        this.header = lsHeader ? lsHeader : props.header;
        this.targetId = props.targetId;
        this.dbSrart = 0;
        this.dbLimit = props.sortParams.dbLimit || 10;
        this.store = {
            data: [],
            length: 0
        };
        this.orderBy = lsSortParams ? lsSortParams.orderBy : props.sortParams.orderBy;
        this.sort = lsSortParams ? lsSortParams.sort : props.sortParams.sort;

        this.modalWindow = new ModalWindow('modalWindow', 'Видимость колонок');

        $('body').on('change', '#modalWindow input', (props) => {
            this.setColVisible(props.target.value, props.target.checked)
        });
    }

    openTableMenu() {
        let body = '';

        $.each(this.header, (key, item) => {
            body += '<div class="checkbox' + ((item['hold']) ? ' disabled' : '') + '">' +
                '<label>' +
                '<input type="checkbox" ' + ((item['visible']) ? ' checked' : '') + ' value="' + item['reference'] + '"' +
                ((item['hold']) ? ' disabled' : '') + '>' +
                item['name'] +
                '</label>' +
                '</div>';
        });

        this.modalWindow.setBody(body);
        this.modalWindow.open();
    }

    getColumns(key, val) {
        let columns = [];
        this.header.forEach((item) => {
            (item[key] === ref) && columns.push(item);
        });

        return columns;
    }

    setColVisible(ref, visible) {
        for(let i = 0; i < this.header.length; i++) {
            if(this.header[i].reference === ref) {
                this.header[i].visible = visible;
                localStorage.setItem( 'tableHeader', JSON.stringify(this.header) );
                this.render();
                break;
            }
        }
    }

    setTableContainer() {
        const header = this.header;

        let tdHeader = '';

        $.each(header, (key, item) => {
            if(item['visible']){
                tdHeader += '<td id="' + item['reference'] + '"' +
                ( !!item['width'] ? ' style="width:' + item['width'] + '"' : '' ) +
                ( (item['sorted'] !== false) ? ' class="sorted"' : ' title="Ээээ, нет! Эту колонку не cортируем."' ) +
                '>' + item['name'] + '</td>';
            }
        });

        const tableContainer = '<table id="tableUser" class="table table-hover table-user">' +
            '<thead>' +
            '<tr>' + tdHeader + '</tr>' +
            '</thead>' +
            '<tbody>' +
            '</tbody>' +
            '</table>';

        return tableContainer;
    }

    tableBodyInit() {
        const store = this.getStore();
        if(store.length) {
            store.data = ctrlTable.sortData(this.orderBy, this.sort, this.getStore().data);
            $('#' + this.targetId + ' tbody').empty().promise().done(() => {
                $.each(store.data, (key, row) => {
                    this.addRow(row);
                });
            });
        }else {
            this.loadUsers();
        }
    }

    loadUsers() {
        this.loadStore(this.dbSrart, this.dbLimit, (rows) => {
            (rows.length < this.dbLimit) && $('#needMoreUsers').prop('disabled', true).html('Все! Юзеров больше нет :(');
            this.dbSrart += this.dbLimit;

            this.setStore(this.store.data.concat(rows)).then(() => {
                this.tableBodyInit();
            });
        })
    }

    addRow(rowParams) {
        let tdBody = '';

        $.each(this.header, (key, item) => {
            if(item['visible']){
                tdBody += '<td>' + this.renderWrapper(item.wrapper, rowParams[item.reference]) + '</td>';
            }
        });

        const newRow = '<tr>'+ tdBody + '</tr>';

        $('#' + this.targetId + ' tbody').append(newRow);
    }

    getStore() {
        return this.store;
    }

    setStore(storeData) {
        return new Promise((resolve, reject) => {
            if(Array.isArray(storeData)) {
                this.store = {
                    data: storeData,
                    length: storeData.length
                };
                resolve(this.store);
            } else {
                reject(new Error('Неверный тип данных! Необходимо передавать массив...'))
            }
        });
    }

    loadStore(start, limit, fn) {
        let data = {
            _start: start,
            _limit: limit
        }

        // На случай, если понадобится сортировка на сарвере
        // if(this.orderBy && this.sort) {
        //     Object.assign(data, {
        //         _sort: this.orderBy,
        //         _order: this.sort
        //     });
        // }

        ctrlTable.loadData({
            url: 'http://localhost:3000/users',
            type: 'GET',
            data: data
        }).then( (props) => {
            !!fn && fn(props);
        });
    }

    sortUsers(orderBy, sort) {
        this.orderBy = orderBy || this.orderBy;
        this.sort = sort || this.sort

        localStorage.setItem('sortParams', JSON.stringify({
            orderBy: this.orderBy,
            sort: this.sort
        }));

        this.setStore(ctrlTable.sortData(orderBy, sort, this.getStore().data));

        this.render();
    }

    render() {
        const tableContainer = this.setTableContainer();

        $('#' + this.targetId).html(tableContainer).promise().done(() => {
            this.tableBodyInit();

            const addStyleClass =  (this.sort === 'DESC') ? 'sort-desc' : 'sort-asc';
            $('#' + this.orderBy).addClass( addStyleClass );
        });
    }
}

export default Table;
