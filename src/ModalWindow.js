class ModalWindow {
    constructor(id, title, body) {
        this.id = id || 'modalWindow';
        this.title = title || '...';
        this.body = body || '...';
        this.created = false;
    }

    create() {
        const htmlWindow = '<div id="' + this.id + '" class="modal-window">' +
            '<div class="modal-header">' +
                '<h1>' + this.title + '</h1>' +
                '<span id="modalClose" class="glyphicon glyphicon-remove" title="Закрыть"></span>' +
            '</div>' +
            '<div class="modal-body">' + this.body + '</div>' +
            '</div>' +
            '<div id="overlay"></div>';

        $('body').append(htmlWindow).promise().done(() => {
            this.created = true;
            $('#modalClose, #overlay').on('click', () => {
                this.close();
            });
            $(document).keyup((e) => {
                (e.keyCode == 27) && this.close();
            });
        });
    }

    setBody(body) {
        if (this.created) {
            $('#' + this.id + ' .modal-body').html(body);
        }else {
            this.body = body
        }
    }

    open() {
        if (this.created) {
            $('#' + this.id).css('display', 'block');
            $('#overlay').css('display', 'block');
        } else {
            this.create();
        }
    }

    close() {
        $('#' + this.id).css('display', 'none');
        $('#overlay').css('display', 'none');
    }
}

export default ModalWindow;
