const loadData = (options) => {
    return new Promise((resolve, reject) => {
        $.ajax(options).done(resolve).fail(reject);
    });
}

const sortData = (orderBy, sort, data) => {
    data.sort((a, b)=> {
        if(sort === 'DESC') {
            return (a[orderBy] < b[orderBy]) ? 1 : -1
        }else{
            return (a[orderBy] > b[orderBy]) ? 1 : -1
        }
    });

    return data;
}

const ctrlTable = {
    loadData,
    sortData
}

export default ctrlTable;
