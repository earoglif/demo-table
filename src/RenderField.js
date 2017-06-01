class RenderField {
    constructor(props) {
        this.header = props.header;
    }

    //Меняем true или false на соответствующую колонку
    boolToIcon(bool) {
        const iconClass = (bool) ? 'glyphicon-ok color-green' : 'glyphicon-remove color-red';

        return '<span class="glyphicon icon-col ' + iconClass + '"></span>';
    }

    //Красим отрицательные числа в красный, положитльные в зеленый, а ноль е трогаем
    colorizeNumber(num) {
        let colorClass = 'color-inherit';
        (num < 0) && (colorClass = 'color-red');
        (num > 0) && (colorClass = 'color-blue');

        return '<span class="' + colorClass + '">' + num + '</span>';
    }

    //Округляем число до двух знаков после запятой
    roundNumber(num) {
        return num.toFixed(2);
    }

    //Форматирование ссылки
    stringToLink(str) {
        const reg = /(?:https?|file|ftp):\/\/([^\/\s]+)[^\s]*/ig;

        return '<a href="' + str + '">' + str.replace( reg, '$1') + '</a>';
    }

    //Оборачиваем данные таблицы в соответствующее отображение
    renderWrapper(wrapper, val) {
        return wrapper ? this[wrapper](val) : val;
    }
}

export default RenderField;
